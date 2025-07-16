import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, RoleOptions } from '../types/user';

const UserListPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock users data - in a real app, this would come from your backend
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        deviceId: '00:1B:44:11:3A:B7',
        name: '田中太郎',
        email: 'tanaka.taro@example.com',
        phone: '090-1234-5678',
        gender: true,
        birthday: '1990-01-15',
        weight: 70,
        height: 175,
        role: 0
      },
      {
        id: 2,
        deviceId: '00:1B:44:11:3A:B8',
        name: '佐藤花子',
        email: 'sato.hanako@example.com',
        phone: '090-2345-6789',
        gender: false,
        birthday: '1992-03-22',
        weight: 55,
        height: 160,
        role: 0
      },
      {
        id: 3,
        deviceId: '00:1B:44:11:3A:B9',
        name: '鈴木一郎',
        email: 'suzuki.ichiro@example.com',
        phone: '090-3456-7890',
        gender: true,
        birthday: '1985-07-10',
        weight: 80,
        height: 180,
        role: 1
      },
      {
        id: 4,
        deviceId: '00:1B:44:11:3A:C0',
        name: '高橋美穂',
        email: 'takahashi.miho@example.com',
        phone: '090-4567-8901',
        gender: false,
        birthday: '1988-11-05',
        weight: 62,
        height: 165,
        role: 0
      },
      {
        id: 5,
        deviceId: '00:1B:44:11:3A:C1',
        name: '山田次郎',
        email: 'yamada.jiro@example.com',
        phone: '090-5678-9012',
        gender: true,
        birthday: '1995-09-18',
        weight: 65,
        height: 170,
        role: 0
      }
    ];
    
    // Simulate loading time
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleUserClick = (userId: number) => {
    router.push(`/user/${userId}`);
  };

  const handleNewUser = () => {
    router.push('/user/register');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">ユーザーリストを読み込み中...</p>
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
                  ユーザー管理
                </h1>
                <p className="text-blue-100 mt-2">
                  Remony - 登録ユーザー一覧
                </p>
              </div>
              <button
                onClick={handleNewUser}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
              >
                新規ユーザー追加
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="max-w-md">
              <input
                type="text"
                placeholder="名前、メールアドレス、電話番号で検索..."
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
                    ユーザー情報
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    連絡先
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プロフィール
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    デバイス
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    権限
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
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
                        {user.gender ? '男性' : '女性'} · {calculateAge(user.birthday)}歳
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.height}cm · {user.weight}kg
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {user.deviceId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 1
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {RoleOptions.find(r => r.value === user.role)?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                検索結果が見つかりませんでした
              </div>
              <div className="text-gray-400 text-sm mt-2">
                検索条件を変更してください
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                合計 {filteredUsers.length} 件のユーザー
              </div>
              <div className="text-sm text-gray-500">
                クリックして詳細を表示
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListPage; 