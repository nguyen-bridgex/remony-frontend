import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { User, UserFormData, RoleOptions, GenderOptions } from '../../types/user';

const UserDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    client_id: 0,
    lineid: '',
    email: '',
    phone: '',
    gender: 1,
    birthday: '',
    weight: 0,
    height: 0,
    role: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock users data - in a real app, this would come from your backend
  const mockUsers: User[] = [
    {
      id: 1,
      name: '田中太郎',
      client_id: 67,
      lineid: 'tanaka@medistep',
      email: 'tanaka.taro@example.com',
      phone: '090-1234-5678',
      gender: 1,
      birthday: '1990-01-15',
      weight: 70,
      height: 175,
      role: 0
    },
    {
      id: 2,
      name: '佐藤花子',
      client_id: 68,
      lineid: 'sato@medistep',
      email: 'sato.hanako@example.com',
      phone: '090-2345-6789',
      gender: 0,
      birthday: '1992-03-22',
      weight: 55,
      height: 160,
      role: 0
    },
    {
      id: 3,
      name: '鈴木一郎',
      client_id: 69,
      lineid: 'suzuki@medistep',
      email: 'suzuki.ichiro@example.com',
      phone: '090-3456-7890',
      gender: 1,
      birthday: '1985-07-10',
      weight: 80,
      height: 180,
      role: 1
    },
    {
      id: 4,
      name: '高橋美穂',
      client_id: 70,
      lineid: 'takahashi@medistep',
      email: 'takahashi.miho@example.com',
      phone: '090-4567-8901',
      gender: 0,
      birthday: '1988-11-05',
      weight: 62,
      height: 165,
      role: 0
    },
    {
      id: 5,
      name: '山田次郎',
      client_id: 71,
      lineid: 'yamada@medistep',
      email: 'yamada.jiro@example.com',
      phone: '090-5678-9012',
      gender: 1,
      birthday: '1995-09-18',
      weight: 65,
      height: 170,
      role: 0
    }
  ];

  useEffect(() => {
    if (id) {
      const userId = parseInt(id as string);
      const foundUser = mockUsers.find(u => u.id === userId);
      
      if (foundUser) {
        setUser(foundUser);
        setFormData({
          name: foundUser.name,
          client_id: foundUser.client_id,
          lineid: foundUser.lineid,
          email: foundUser.email,
          phone: foundUser.phone,
          gender: foundUser.gender,
          birthday: foundUser.birthday,
          weight: foundUser.weight,
          height: foundUser.height,
          role: foundUser.role
        });
      } else {
        toast.error('ユーザーが見つかりませんでした');
        router.push('/users');
      }
      setIsLoading(false);
    }
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      gender: parseInt(e.target.value)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.client_id <= 0) newErrors.client_id = 'クライアントIDは必須です';
    if (!formData.lineid.trim()) newErrors.lineid = 'LINE IDは必須です';
    if (!formData.name.trim()) newErrors.name = '名前は必須です';
    if (!formData.email.trim()) newErrors.email = 'メールアドレスは必須です';
    if (!formData.phone.trim()) newErrors.phone = '電話番号は必須です';
    if (!formData.birthday) newErrors.birthday = '生年月日は必須です';
    if (formData.weight <= 0) newErrors.weight = '体重は0より大きい値を入力してください';
    if (formData.height <= 0) newErrors.height = '身長は0より大きい値を入力してください';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('User updated:', formData);
      toast.success('ユーザー情報を更新しました！');
      setIsEditing(false);
      // Update the user state with new data
      if (user) {
        setUser({ ...user, ...formData });
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name,
        client_id: user.client_id,
        lineid: user.lineid,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthday: user.birthday,
        weight: user.weight,
        height: user.height,
        role: user.role
      });
    }
    setErrors({});
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">ユーザー情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-gray-600 text-lg">ユーザーが見つかりませんでした</p>
          <button
            onClick={() => router.push('/users')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ユーザー一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  ユーザープロフィール
                </h1>
                <p className="text-blue-100 mt-2">
                  Remony - ユーザーID: {user.id}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/users')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  ユーザー一覧
                </button>
                <button
                  onClick={() => router.push('/user/register')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  新規ユーザー
                </button>
                <button
                  onClick={() => router.push(`/user/${id}/setting`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors"
                >
                  設定
                </button>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors"
                  >
                    編集
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              /* Edit Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client ID */}
                <div>
                  <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">
                    クライアントID
                  </label>
                  <input
                    type="number"
                    id="client_id"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="クライアントIDを入力してください"
                    min="1"
                  />
                  {errors.client_id && <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>}
                </div>

                {/* LINE ID */}
                <div>
                  <label htmlFor="lineid" className="block text-sm font-medium text-gray-700 mb-2">
                    LINE ID
                  </label>
                  <input
                    type="text"
                    id="lineid"
                    name="lineid"
                    value={formData.lineid}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="LINE IDを入力してください"
                  />
                  {errors.lineid && <p className="text-red-500 text-sm mt-1">{errors.lineid}</p>}
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    名前
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="お名前を入力してください"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="メールアドレスを入力してください"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="電話番号を入力してください"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    性別
                  </label>
                  <div className="flex space-x-6">
                    {GenderOptions.map((option) => (
                      <label key={option.value.toString()} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={option.value.toString()}
                          checked={formData.gender === option.value}
                          onChange={handleRadioChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Birthday */}
                <div>
                  <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
                    生年月日
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.birthday && <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>}
                </div>

                {/* Weight and Height */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                      体重（kg）
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="体重を入力"
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                  </div>

                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                      身長（cm）
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="身長を入力"
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    権限
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {RoleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
                  >
                    変更を保存
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">クライアントID</h3>
                    <p className="text-lg font-semibold text-gray-900">{user.client_id}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">LINE ID</h3>
                    <p className="text-lg font-semibold text-gray-900">{user.lineid}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">名前</h3>
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">メールアドレス</h3>
                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">電話番号</h3>
                    <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">権限</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {RoleOptions.find(r => r.value === user.role)?.label || '不明'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">性別</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.gender === 1 ? '男性' : '女性'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">生年月日</h3>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(user.birthday)}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">体重</h3>
                    <p className="text-lg font-semibold text-gray-900">{user.weight} kg</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">身長</h3>
                    <p className="text-lg font-semibold text-gray-900">{user.height} cm</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">BMI</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {((user.weight / (user.height / 100)) / (user.height / 100)).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 