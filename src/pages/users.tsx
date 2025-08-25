import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { User, GenderOptions } from '../types/user';
import { getUsers, deleteUser, PaginationInfo } from '../api/users';
import { getHospitalList, addUserToHospital, removeUserFromHospital, Hospital } from '../api/hospitals';

type SortField = 'name' | 'id' | 'line_id' | 'email' | 'phone' | 'birthday' | 'weight' | 'height' | 'is_wearing';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

const UserListPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'id',
    direction: 'asc'
  });
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);
  
  // Hospital filtering state
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(true);
  const [managingUserId, setManagingUserId] = useState<number | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(true); // New state for showing all users vs filtering

  
  // Function to get wearing status
  const getWearingStatus = (isWearing: number | undefined) => {
    if (isWearing === 1) {
      return {
        text: '装着中',
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: '✓'
      };
    } else if (isWearing === 0) {
      return {
        text: '未装着',
        className: 'bg-red-100 text-red-800 border-red-300',
        icon: '✗'
      };
    } else {
      return {
        text: '不明',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: '?'
      };
    }
  };

  // Server-side sorting function
  const handleSort = (field: SortField) => {
    const newDirection = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({
      field,
      direction: newDirection
    });
    setCurrentPage(1); // Reset to first page when sorting
    
    // Show toast notification
    const fieldLabel = getSortFieldLabel(field);
    const directionLabel = newDirection === 'asc' ? '昇順' : '降順';
    toast.success(`${fieldLabel}で${directionLabel}にソートしました`, {
      duration: 2000,
      position: 'top-center',
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getSortFieldLabel = (field: SortField) => {
    const labels: Record<SortField, string> = {
      name: '名前',
      id: 'ID',
      line_id: 'クライアントID',
      email: 'メールアドレス',
      phone: '電話番号',
      birthday: '生年月日',
      weight: '体重',
      height: '身長',
      is_wearing: '装着状況'
    };
    return labels[field];
  };

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const result = await getUsers({
          limit: itemsPerPage,
          offset: offset,
          order_by: `users.${sortConfig.field}`,
          order_direction: sortConfig.direction.toUpperCase() as 'ASC' | 'DESC',
          search: searchTerm || undefined,
          hospital_id: (!showAllUsers && selectedHospitalId) ? selectedHospitalId : undefined,
        });
        
        if (result.success && result.users) {
          let nextUsers = result.users;
          if (sortConfig.field === 'birthday') {
            nextUsers = [...nextUsers].sort((a, b) => {
              const aTime = a.birthday ? new Date(a.birthday).getTime() : 0;
              const bTime = b.birthday ? new Date(b.birthday).getTime() : 0;
              if (isNaN(aTime) && isNaN(bTime)) return 0;
              if (isNaN(aTime)) return sortConfig.direction === 'asc' ? 1 : -1;
              if (isNaN(bTime)) return sortConfig.direction === 'asc' ? -1 : 1;
              return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
            });
          }
          setUsers(nextUsers);
          setPagination(result.pagination || null);
        } else {
          console.error('Failed to fetch users:', result.message);
          toast.error(`利用者の取得に失敗しました: ${result.message}`);
          setUsers([]);
          setPagination(null);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('利用者の取得中にエラーが発生しました。');
        setUsers([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, itemsPerPage, sortConfig.field, sortConfig.direction, searchTerm, selectedHospitalId, showAllUsers]);

  // Fetch hospitals data from API
  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoadingHospitals(true);
      try {
        const response = await getHospitalList();
        if (response.success && response.hospitals) {
          setHospitals(response.hospitals);
        } else {
          console.error('Failed to fetch hospitals:', response.message);
          toast.error('病院リストの取得に失敗しました');
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        toast.error('病院リストの取得中にエラーが発生しました');
      } finally {
        setIsLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleUserClick = (userId: number) => {
    router.push(`/user/${userId}`);
  };

  const handleNewUser = () => {
    router.push('/user/register');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleEditUser = (userId: number) => {
    router.push(`/user/${userId}/edit`);
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    const confirmed = window.confirm(`${userName}さんを削除してもよろしいですか？この操作は取り消せません。`);
    
    if (!confirmed) {
      return;
    }

    setDeletingUserId(userId);
    
    try {
      const result = await deleteUser(userId);
      console.log('Delete result:', result);
      
      if (result.success) {
        // Remove the user from the local state
        setUsers(prevUsers => {
          console.log('Previous users count:', prevUsers.length);
          const updatedUsers = prevUsers.filter(user => user.id !== userId);
          console.log('Updated users count:', updatedUsers.length);
          console.log('Deleted user ID:', userId);
          
          // Reset to first page if current page becomes empty
          const filteredCount = updatedUsers.length;
          const newTotalPages = Math.ceil(filteredCount / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(1);
          }
          
          return updatedUsers;
        });
        
        toast.success(`${userName}さんを削除しました`);
      } else {
        toast.error(`削除に失敗しました: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('削除中にエラーが発生しました。');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Server-side pagination - use users directly
  const paginatedUsers = users;

  // Pagination calculations from server response
  const totalPages = pagination?.total_pages || 1;
  const startIndex = pagination?.offset || 0;
  const endIndex = startIndex + (pagination?.limit || itemsPerPage);
  const totalCount = pagination?.total_count || users.length;

  // Reset to first page when search term changes with debounce
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }
    
    const timeout = setTimeout(() => {
      setCurrentPage(1);
    }, 300); // 300ms debounce
    
    setSearchDebounce(timeout);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Updated function to get alert settings from user object
  const getAlertSettings = (user: User) => {
    const alerts = [];
    if (user.step_alert_enabled) alerts.push('歩数');
    if (user.distance_alert_enabled) alerts.push('距離');
    if (user.heart_rate_alert_enabled) alerts.push('心拍数');
    if (user.sleep_alert_enabled) alerts.push('睡眠');
    if (user.bmr_cals_alert_enabled) alerts.push('基礎代謝');
    if (user.act_cals_alert_enabled) alerts.push('活動カロリー');
    if (user.skin_temp_alert_enabled) alerts.push('表体温');
    if (user.solar_gen_alert_enabled) alerts.push('太陽光発電');
    if (user.thermal_gen_alert_enabled) alerts.push('熱発電');
    
    return alerts.length > 0 ? alerts.join('、') : 'なし';
  };

  // Hospital filtering functions
  const handleHospitalFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hospitalId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedHospitalId(hospitalId);
    setCurrentPage(1); // Reset to first page when filtering

    if (hospitalId) {
      const selectedHospital = hospitals.find(h => h.id === hospitalId);
      if (showAllUsers) {
        toast.success(`${selectedHospital?.name}が選択されました（全ユーザー表示中）`);
      } else {
        toast.success(`${selectedHospital?.name}でフィルタリングしています`);
      }
    } else {
      toast.success('病院が選択解除されました');
    }
  };

  // Handle show all users toggle
  const handleShowAllUsersChange = (showAll: boolean) => {
    setShowAllUsers(showAll);
    setCurrentPage(1); // Reset to first page when changing view mode

    if (showAll) {
      toast.success('全ユーザーを表示しています');
    } else if (selectedHospitalId) {
      const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);
      toast.success(`${selectedHospital?.name}でフィルタリングしています`);
    } else {
      toast.success('病院フィルターモードに変更しました');
    }
  };

  // Add user to selected hospital
  const handleAddUserToHospital = async (userId: number) => {
    if (!selectedHospitalId) {
      toast.error('病院が選択されていません');
      return;
    }

    const user = users.find(u => u.id === userId);
    if (user && user.hospital_id === selectedHospitalId) {
      toast.error('この利用者は既に選択された病院に所属しています');
      return;
    }

    setManagingUserId(userId);
    try {
      const result = await addUserToHospital({
        hospital_id: selectedHospitalId,
        user_id: userId.toString().padStart(6, '0')
      });

      if (result.success) {
        const hospitalName = hospitals.find(h => h.id === selectedHospitalId)?.name;
        const userName = user?.name || 'ユーザー';
        toast.success(`${userName}さんを${hospitalName}に追加しました`);
        // Refresh the users list to reflect the change
        const offset = (currentPage - 1) * itemsPerPage;
        const refreshResult = await getUsers({
          limit: itemsPerPage,
          offset: offset,
          order_by: `users.${sortConfig.field}`,
          order_direction: sortConfig.direction.toUpperCase() as 'ASC' | 'DESC',
          search: searchTerm || undefined,
          hospital_id: (!showAllUsers && selectedHospitalId) ? selectedHospitalId : undefined,
        });
        if (refreshResult.success && refreshResult.users) {
          setUsers(refreshResult.users);
        }
      } else {
        toast.error(`利用者の追加に失敗しました: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding user to hospital:', error);
      toast.error('利用者の追加中にエラーが発生しました');
    } finally {
      setManagingUserId(null);
    }
  };

  // Remove user from selected hospital
  const handleRemoveUserFromHospital = async (userId: number) => {
    if (!selectedHospitalId) {
      toast.error('病院が選択されていません');
      return;
    }

    const user = users.find(u => u.id === userId);
    if (user && user.hospital_id !== selectedHospitalId) {
      toast.error('この利用者は選択された病院に所属していません');
      return;
    }

    setManagingUserId(userId);
    try {
      const result = await removeUserFromHospital({
        hospital_id: selectedHospitalId,
        user_id: userId.toString().padStart(6, '0')
      });

      if (result.success) {
        const hospitalName = hospitals.find(h => h.id === selectedHospitalId)?.name;
        const userName = user?.name || 'ユーザー';
        toast.success(`${userName}さんを${hospitalName}から削除しました`);
        // Refresh the users list to reflect the change
        const offset = (currentPage - 1) * itemsPerPage;
        const refreshResult = await getUsers({
          limit: itemsPerPage,
          offset: offset,
          order_by: `users.${sortConfig.field}`,
          order_direction: sortConfig.direction.toUpperCase() as 'ASC' | 'DESC',
          search: searchTerm || undefined,
          hospital_id: (!showAllUsers && selectedHospitalId) ? selectedHospitalId : undefined,
        });
        if (refreshResult.success && refreshResult.users) {
          setUsers(refreshResult.users);
        }
      } else {
        toast.error(`利用者の削除に失敗しました: ${result.message}`);
      }
    } catch (error) {
      console.error('Error removing user from hospital:', error);
      toast.error('利用者の削除中にエラーが発生しました');
    } finally {
      setManagingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">利用者リストを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  利用者管理
                </h1>
                <p className="text-blue-100 mt-2">
                  見守りサービス - 登録利用者一覧
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGoHome}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors shadow-lg border-2 border-blue-400"
                >
                  ホームに戻る
                </button>
                <button
                  onClick={handleNewUser}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                >
                  新しい利用者を登録
                </button>
              </div>
            </div>
          </div>

          {/* View Mode Selection */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">表示モード</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="viewMode"
                      checked={showAllUsers}
                      onChange={() => handleShowAllUsersChange(true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">全ユーザー表示</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="viewMode"
                      checked={!showAllUsers}
                      onChange={() => handleShowAllUsersChange(false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">病院別フィルター</span>
                  </label>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">現在:</span> 
                {showAllUsers ? (
                  <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    全ユーザー表示中
                  </span>
                ) : (
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    病院別フィルター中
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar, Hospital Filter and Sort Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 max-w-2xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">利用者検索</label>
                  <input
                    type="text"
                    placeholder="名前、メールアドレス、電話番号、LINE ID、装着状況で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="w-full sm:w-80">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {showAllUsers ? '管理対象病院' : '病院フィルター'}
                  </label>
                  <select
                    value={selectedHospitalId || ''}
                    onChange={handleHospitalFilterChange}
                    disabled={isLoadingHospitals}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">{showAllUsers ? '病院を選択してください' : 'すべての病院'}</option>
                    {hospitals.map(hospital => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingHospitals && (
                    <p className="text-sm text-gray-500 mt-1">病院リスト読み込み中...</p>
                  )}
                  {showAllUsers && selectedHospitalId && (
                    <p className="text-sm text-green-600 mt-1">
                      ユーザーをこの病院に追加できます
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">表示中:</span> {totalCount}人の利用者
                  {!showAllUsers && selectedHospitalId && (
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {hospitals.find(h => h.id === selectedHospitalId)?.name}でフィルタリング中
                    </span>
                  )}
                  {showAllUsers && selectedHospitalId && (
                    <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      管理対象: {hospitals.find(h => h.id === selectedHospitalId)?.name}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">ソート:</span> {getSortFieldLabel(sortConfig.field)} {sortConfig.direction === 'asc' ? '昇順' : '降順'}
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border-r-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('is_wearing')}
                  >
                    <div className="flex items-center">
                      装着状況
                      <span className="ml-1 text-xs">{getSortIcon('is_wearing')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      利用者情報
                      <span className="ml-1 text-xs">{getSortIcon('name')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      連絡先
                      <span className="ml-1 text-xs">{getSortIcon('email')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    病院/医院
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('birthday')}
                  >
                    <div className="flex items-center">
                      プロフィール
                      <span className="ml-1 text-xs">{getSortIcon('birthday')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('line_id')}
                  >
                    <div className="flex items-center">
                      クライアント・LINE
                      <span className="ml-1 text-xs">{getSortIcon('line_id')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アラート設定
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    アクション・病院管理
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => {
                  const wearingStatus = getWearingStatus(user.is_wearing);
                  return (
                  <tr
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap bg-blue-50 border-r-2 border-blue-200">
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center px-4 py-3 text-sm font-bold rounded-full border-2 ${wearingStatus.className} min-w-[100px] justify-center shadow-sm`}>
                          <span className="text-lg mr-2">{wearingStatus.icon}</span>
                          {wearingStatus.text}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.hospital_name || user.hospital || '未設定'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.gender === 1 ? '男性' : '女性'} · {calculateAge(user.birthday)}歳
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.height}cm · {user.weight}kg
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Client ID: {user.line_id}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {user.line_id || user.line_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-4 py-2 text-xs font-semibold rounded-full bg-green-100 text-green-800 border-2 border-green-200">
                        {getAlertSettings(user)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleEditUser(user.id);
                            }}
                            className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50"
                          >
                            編集
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleDeleteUser(user.id, user.name);
                            }}
                            disabled={deletingUserId === user.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                          >
                            {deletingUserId === user.id ? '削除中...' : '削除'}
                          </button>
                        </div>
                        {selectedHospitalId && (
                          <div className="flex gap-1">
                            {/* Show Add button only if user is NOT in the selected hospital */}
                            {user.hospital_id !== selectedHospitalId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click
                                  handleAddUserToHospital(user.id);
                                }}
                                disabled={managingUserId === user.id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                                title={`${hospitals.find(h => h.id === selectedHospitalId)?.name}に追加`}
                              >
                                {managingUserId === user.id ? '追加中...' : '追加'}
                              </button>
                            )}
                            {/* Show Remove button only if user IS in the selected hospital (and not in filter-only mode or they would be hidden) */}
                            {user.hospital_id === selectedHospitalId && (showAllUsers || !showAllUsers) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click
                                  handleRemoveUserFromHospital(user.id);
                                }}
                                disabled={managingUserId === user.id}
                                className="text-orange-600 hover:text-orange-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs px-2 py-1 border border-orange-300 rounded hover:bg-orange-50"
                                title={`${hospitals.find(h => h.id === selectedHospitalId)?.name}から削除`}
                              >
                                {managingUserId === user.id ? '削除中...' : '削除'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {users.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {searchTerm && !showAllUsers && selectedHospitalId 
                  ? '検索・フィルター条件に一致する利用者が見つかりませんでした'
                  : searchTerm 
                    ? '検索結果が見つかりませんでした'
                    : !showAllUsers && selectedHospitalId
                      ? `${hospitals.find(h => h.id === selectedHospitalId)?.name}に所属する利用者が見つかりませんでした`
                      : showAllUsers
                        ? '利用者が見つかりませんでした'
                        : '利用者が見つかりませんでした'
                }
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {searchTerm || (!showAllUsers && selectedHospitalId)
                  ? 'フィルター条件を変更するか、新しい利用者を追加してください'
                  : '利用者を追加してください'
                }
              </div>
              {(searchTerm || (!showAllUsers && selectedHospitalId)) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    if (!showAllUsers) {
                      setSelectedHospitalId(null);
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {showAllUsers ? '検索をクリア' : 'フィルターをクリア'}
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {users.length > 0 && (
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  合計 {totalCount} 件の利用者 ({startIndex + 1} - {Math.min(endIndex, totalCount)} 件を表示)
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination?.has_previous}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      前へ
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current page
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          (page === currentPage - 2 && currentPage > 3) ||
                          (page === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span key={page} className="px-2 py-2 text-sm text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination?.has_next}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      次へ
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListPage; 