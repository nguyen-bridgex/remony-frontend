import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { User, GenderOptions } from '../types/user';
import { getUsers } from '../api/users';

const UserListPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    router.push(`/user/${userId}/setting`);
  };

  const handleNewUser = () => {
    router.push('/user/register');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.line_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.line_id && user.line_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    if (user.skin_temp_alert_enabled) alerts.push('皮膚温');
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
      <div className="max-w-7xl mx-auto">
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
              <button
                onClick={handleNewUser}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
              >
                新しい利用者を登録
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="max-w-md">
              <input
                type="text"
                placeholder="名前、メールアドレス、電話番号、LINE IDで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    利用者情報
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    連絡先
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プロフィール
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    クライアント・LINE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アラート設定
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                  >
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
                        Client ID: {user.client_id}
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
                  </tr>
                ))}
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