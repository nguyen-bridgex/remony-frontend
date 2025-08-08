import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { User, GenderOptions } from '../types/user';
import { getUsers, deleteUser } from '../api/users';

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
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'id',
    direction: 'asc'
  });
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  
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

  // Sorting functions
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

  const sortUsers = (usersToSort: User[]) => {
    const sortedUsers = [...usersToSort].sort((a, b) => {
      let aValue: any = a[sortConfig.field];
      let bValue: any = b[sortConfig.field];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Handle special cases
      if (sortConfig.field === 'birthday') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortConfig.field === 'is_wearing') {
        // Sort wearing status: wearing (1) first, then not wearing (0), then unknown (undefined)
        aValue = aValue === 1 ? 3 : aValue === 0 ? 2 : 1;
        bValue = bValue === 1 ? 3 : bValue === 0 ? 2 : 1;
      } else if (['id', 'weight', 'height'].includes(sortConfig.field)) {
        // Handle numeric fields
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Handle string comparison (case-insensitive)
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    console.log({sortedUsers});
    return sortedUsers;
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
        const result = await getUsers();
        
        if (result.success && result.data) {
          setUsers(result.data);
        } else {
          console.error('Failed to fetch users:', result.message);
          toast.error(`利用者の取得に失敗しました: ${result.message}`);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('利用者の取得中にエラーが発生しました。');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
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

  const handleDeleteUser = async (userId: number, userName: string) => {
    const confirmed = window.confirm(`${userName}さんを削除してもよろしいですか？この操作は取り消せません。`);
    
    if (!confirmed) {
      return;
    }

    setDeletingUserId(userId);
    
    try {
      const result = await deleteUser(userId);
      
      if (result.success) {
        // Remove the user from the local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        toast.success(`${userName}さんを削除しました`);
        
        // Reset to first page if current page becomes empty
        const filteredCount = users.filter(user => user.id !== userId).length;
        const newTotalPages = Math.ceil(filteredCount / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(1);
        }
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

  const filteredUsers = sortUsers(users.filter(user => {
    const wearingStatusText = getWearingStatus(user.is_wearing).text;
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.line_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.line_id && user.line_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      wearingStatusText.includes(searchTerm)
    );
  }));

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
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

          {/* Search Bar and Sort Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-2xl">
                <input
                  type="text"
                  placeholder="名前、メールアドレス、電話番号、LINE ID、装着状況で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">ソート:</span> {getSortFieldLabel(sortConfig.field)} {sortConfig.direction === 'asc' ? '昇順' : '降順'}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleDeleteUser(user.id, user.name);
                        }}
                        disabled={deletingUserId === user.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingUserId === user.id ? '削除中...' : '削除'}
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {filteredUsers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {searchTerm ? '検索結果が見つかりませんでした' : '利用者が見つかりませんでした'}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {searchTerm ? '検索条件を変更してください' : '利用者を追加してください'}
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  合計 {filteredUsers.length} 件の利用者 ({startIndex + 1} - {Math.min(endIndex, filteredUsers.length)} 件を表示)
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
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
                      disabled={currentPage === totalPages}
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