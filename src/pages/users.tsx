import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { User } from '../types/user';
import { getUsers, PaginationInfo } from '../api/users';
import { getHospitalList, addUserToHospital, removeUserFromHospital, Hospital } from '../api/hospitals';

const UserListPage = () => {
  const router = useRouter();
  
  // Left panel - hospital members
  const [hospitalUsers, setHospitalUsers] = useState<User[]>([]);
  const [isLoadingHospitalUsers, setIsLoadingHospitalUsers] = useState(false);
  const [hospitalPagination, setHospitalPagination] = useState<PaginationInfo | null>(null);
  
  // Right panel - non-hospital users
  const [nonHospitalUsers, setNonHospitalUsers] = useState<User[]>([]);
  const [isLoadingNonHospitalUsers, setIsLoadingNonHospitalUsers] = useState(false);
  const [nonHospitalPagination, setNonHospitalPagination] = useState<PaginationInfo | null>(null);
  
  // Common state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentHospitalPage, setCurrentHospitalPage] = useState(1);
  const [currentNonHospitalPage, setCurrentNonHospitalPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Hospital state
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(true);
  const [managingUserId, setManagingUserId] = useState<number | null>(null);

  // Fetch hospital users (left panel)
  const fetchHospitalUsers = async () => {
    if (!selectedHospitalId) {
      setHospitalUsers([]);
      setHospitalPagination(null);
      return;
    }

    setIsLoadingHospitalUsers(true);
    try {
      const offset = (currentHospitalPage - 1) * itemsPerPage;
      const result = await getUsers({
        limit: itemsPerPage,
        offset: offset,
        search: searchTerm || undefined,
        hospital_id: selectedHospitalId,
      });
      
      if (result.success && result.users) {
        setHospitalUsers(result.users);
        setHospitalPagination(result.pagination || null);
      } else {
        setHospitalUsers([]);
        setHospitalPagination(null);
      }
    } catch (error) {
      console.error('Error fetching hospital users:', error);
      setHospitalUsers([]);
      setHospitalPagination(null);
    } finally {
      setIsLoadingHospitalUsers(false);
    }
  };

  // Fetch non-hospital users (right panel)
  const fetchNonHospitalUsers = async () => {
    if (!selectedHospitalId) {
      setNonHospitalUsers([]);
      setNonHospitalPagination(null);
      return;
    }

    setIsLoadingNonHospitalUsers(true);
    try {
      const result = await getUsers({
        limit: 100,
        offset: 0,
        search: searchTerm || undefined,
      });
      
      if (result.success && result.users) {
        const filteredUsers = result.users.filter(user => user.hospital_id !== selectedHospitalId);
        const startIndex = (currentNonHospitalPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        setNonHospitalUsers(paginatedUsers);
        setNonHospitalPagination({
          total_count: filteredUsers.length,
          total_pages: Math.ceil(filteredUsers.length / itemsPerPage),
          current_page: currentNonHospitalPage,
          limit: itemsPerPage,
          offset: startIndex,
          has_next: endIndex < filteredUsers.length,
          has_previous: startIndex > 0
        });
      } else {
        setNonHospitalUsers([]);
        setNonHospitalPagination(null);
      }
    } catch (error) {
      console.error('Error fetching non-hospital users:', error);
      setNonHospitalUsers([]);
      setNonHospitalPagination(null);
    } finally {
      setIsLoadingNonHospitalUsers(false);
    }
  };

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoadingHospitals(true);
      try {
        const response = await getHospitalList();
        if (response.success && response.hospitals) {
          setHospitals(response.hospitals);
        } else {
          console.error('Failed to fetch hospitals:', response.message);
          toast.error('事業所リストの取得に失敗しました');
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        toast.error('事業所リストの取得中にエラーが発生しました');
      } finally {
        setIsLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, []);

  // Effects for data fetching
  useEffect(() => {
    fetchHospitalUsers();
  }, [selectedHospitalId, currentHospitalPage, searchTerm]);

  useEffect(() => {
    fetchNonHospitalUsers();
  }, [selectedHospitalId, currentNonHospitalPage, searchTerm]);

  // Hospital selection handler
  const handleHospitalFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hospitalId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedHospitalId(hospitalId);
    setCurrentHospitalPage(1);
    setCurrentNonHospitalPage(1);

    if (hospitalId) {
      const selectedHospital = hospitals.find(h => h.id === hospitalId);
      toast.success(`${selectedHospital?.name}が選択されました`);
    }
  };

  // Add user to hospital
  const handleAddUserToHospital = async (userId: number) => {
    if (!selectedHospitalId) return;

    const user = nonHospitalUsers.find(u => u.id === userId);
    setManagingUserId(userId);
    
    try {
      const result = await addUserToHospital({
        hospital_id: selectedHospitalId,
        user_id: userId.toString().padStart(6, '0')
      });

      if (result.success) {
        const hospitalName = hospitals.find(h => h.id === selectedHospitalId)?.name;
        toast.success(`${user?.name}さんを${hospitalName}に追加しました`);
        fetchHospitalUsers();
        fetchNonHospitalUsers();
      } else {
        toast.error(`追加に失敗しました: ${result.message}`);
      }
    } catch (error) {
      toast.error('追加中にエラーが発生しました');
    } finally {
      setManagingUserId(null);
    }
  };

  // Remove user from hospital
  const handleRemoveUserFromHospital = async (userId: number) => {
    if (!selectedHospitalId) return;

    const user = hospitalUsers.find(u => u.id === userId);
    setManagingUserId(userId);
    
    try {
      const result = await removeUserFromHospital({
        hospital_id: selectedHospitalId,
        user_id: userId.toString().padStart(6, '0')
      });

      if (result.success) {
        const hospitalName = hospitals.find(h => h.id === selectedHospitalId)?.name;
        toast.success(`${user?.name}さんを${hospitalName}から削除しました`);
        fetchHospitalUsers();
        fetchNonHospitalUsers();
      } else {
        toast.error(`削除に失敗しました: ${result.message}`);
      }
    } catch (error) {
      toast.error('削除中にエラーが発生しました');
    } finally {
      setManagingUserId(null);
    }
  };

  // Navigation handlers
  const handleNewUser = () => {
    router.push('/user/register');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleUserClick = (userId: number) => {
    router.push(`/user/${userId}`);
  };

  // Calculate age
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

  if (isLoadingHospitals) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">初期設定を読み込み中...</p>
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
                <h1 className="text-3xl font-bold text-white">事業所利用者管理</h1>
                <p className="text-blue-100 mt-2">事業所別利用者の管理と割り当て</p>
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

          {/* Hospital Selection and Search */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">事業所選択</label>
                <select
                  value={selectedHospitalId || ''}
                  onChange={handleHospitalFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">事業所を選択してください</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">利用者検索</label>
                <input
                  type="text"
                  placeholder="名前やIDで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            {selectedHospitalId && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{hospitals.find(h => h.id === selectedHospitalId)?.name}</strong>の管理画面
                </p>
              </div>
            )}
          </div>

          {selectedHospitalId ? (
            <>
              {/* Split Panel Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left Panel - Hospital Members */}
                <div className="bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="bg-green-100 px-4 py-3 border-b border-green-200">
                    <h2 className="text-lg font-semibold text-green-800">
                      所属メンバー ({hospitalPagination?.total_count || 0}人)
                    </h2>
                  </div>
                  <div className="p-4">
                    {isLoadingHospitalUsers ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-green-600 mt-2">読み込み中...</p>
                      </div>
                    ) : hospitalUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>この事業所に所属する利用者はいません</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {hospitalUsers.map(user => (
                          <div key={user.id} className="bg-white rounded-lg p-4 shadow border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {user.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 
                                      className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                      onClick={() => handleUserClick(user.id)}
                                    >
                                      {user.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                                  </div>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                  <div>年齢: {calculateAge(user.birthday)}歳</div>
                                  <div>性別: {user.gender === 1 ? '男性' : '女性'}</div>
                                  <div>電話: {user.phone}</div>
                                  <div>メール: {user.email}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveUserFromHospital(user.id)}
                                disabled={managingUserId === user.id}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 disabled:opacity-50"
                              >
                                {managingUserId === user.id ? '削除中...' : '削除'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel - Available Users */}
                <div className="bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="bg-blue-100 px-4 py-3 border-b border-blue-200">
                    <h2 className="text-lg font-semibold text-blue-800">
                      追加可能な利用者 ({nonHospitalPagination?.total_count || 0}人)
                    </h2>
                  </div>
                  <div className="p-4">
                    {isLoadingNonHospitalUsers ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-blue-600 mt-2">読み込み中...</p>
                      </div>
                    ) : nonHospitalUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>追加可能な利用者はいません</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {nonHospitalUsers.map(user => (
                          <div key={user.id} className="bg-white rounded-lg p-3 shadow border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-xs">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                                  {user.hospital_name && (
                                    <p className="text-xs text-orange-600">現在: {user.hospital_name}</p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddUserToHospital(user.id)}
                                disabled={managingUserId === user.id}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 disabled:opacity-50"
                              >
                                {managingUserId === user.id ? '追加中...' : '追加'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-500 text-lg">
                事業所を選択してください
              </div>
              <p className="text-gray-400 text-sm mt-2">
                上記のドロップダウンから管理する事業所を選んでください
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListPage; 