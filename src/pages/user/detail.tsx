import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, UserFormData, RoleOptions, GenderOptions } from '../../types/user';

const UserDetail = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    deviceId: '',
    name: '',
    email: '',
    phone: '',
    gender: true,
    birthday: '',
    weight: 0,
    height: 0,
    role: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock user data - in a real app, this would come from your backend
  useEffect(() => {
    const mockUser: User = {
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
    };
    setUser(mockUser);
    setFormData({
      deviceId: mockUser.deviceId,
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      gender: mockUser.gender,
      birthday: mockUser.birthday,
      weight: mockUser.weight,
      height: mockUser.height,
      role: mockUser.role
    });
  }, []);

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
      gender: e.target.value === 'true'
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.deviceId.trim()) newErrors.deviceId = 'デバイスIDは必須です';
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
      alert('ユーザー情報を更新しました！');
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
        deviceId: user.deviceId,
        name: user.name,
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">ユーザー情報を読み込み中...</p>
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
                  onClick={() => router.push('/user/register')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  新規ユーザー
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
                {/* Device ID */}
                <div>
                  <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-2">
                    デバイスID（MACアドレス）
                  </label>
                  <input
                    type="text"
                    id="deviceId"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="MACアドレスを入力してください"
                  />
                  {errors.deviceId && <p className="text-red-500 text-sm mt-1">{errors.deviceId}</p>}
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
                    <h3 className="text-sm font-medium text-gray-600 mb-1">デバイスID</h3>
                    <p className="text-lg font-semibold text-gray-900">{user.deviceId}</p>
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
                      {user.gender ? '男性' : '女性'}
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