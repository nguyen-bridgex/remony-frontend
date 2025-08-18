import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { User, UserFormData, GenderOptions, VitalDeviceOptions, NotificationTargetOptions, OfficeOptions } from '../../../types/user';
import { getUser, updateUser } from '../../../api/users';

const UserEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    client_id: 0,
    line_id: '',
    email: '',
    phone: '',
    gender: 1,
    birthday: '',
    weight: 0,
    height: 0,
    address: '',
    office: 'おうちのカンゴ',
    gateway_id: '',
    uid: '',
    device_id: '',
    vital_device: 'remony',
    notification_target: 'line'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setIsLoading(true);
        try {
          const result = await getUser(parseInt(id as string));
          if (result.success && result.data) {
            const user = result.data;
            setFormData({
              name: user.name || '',
              client_id: user.client_id || 0,
              line_id: user.line_id || '',
              email: user.email || '',
              phone: user.phone || '',
              gender: user.gender || 1,
              birthday: user.birthday ? user.birthday.split('T')[0] : '', // Format for date input
              weight: user.weight || 0,
              height: user.height || 0,
              address: user.address || '',
              office: user.office || 'おうちのカンゴ',
              gateway_id: user.gateway_id || '',
              uid: user.uid || '',
              device_id: user.device_id || '',
              vital_device: 'remony',
              notification_target: 'line'
            });
          } else {
            toast.error('利用者情報の取得に失敗しました');
            router.push('/users');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          toast.error('利用者情報の取得中にエラーが発生しました');
          router.push('/users');
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genderValue = parseInt(e.target.value);
    console.log('Edit page - Radio change - value:', e.target.value, 'parsed:', genderValue);
    setFormData(prev => ({
      ...prev,
      gender: genderValue
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    } else if (formData.name.length < 2) {
      newErrors.name = '名前は2文字以上で入力してください';
    } else if (formData.name.length > 50) {
      newErrors.name = '名前は50文字以内で入力してください';
    }

    // Client ID validation
    if (!formData.client_id || formData.client_id < 1) {
      newErrors.client_id = 'クライアントIDは1以上の数値で入力してください';
    }

    // LINE ID validation
    if (!formData.line_id.trim()) {
      newErrors.line_id = 'LINE IDは必須です';
    } else if (formData.line_id.length < 3) {
      newErrors.line_id = 'LINE IDは3文字以上で入力してください';
    } else if (formData.line_id.length > 100) {
      newErrors.line_id = 'LINE IDは100文字以内で入力してください';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    // Phone validation
    const phoneRegex = /^[0-9\-\+\s\(\)]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号は必須です';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = '正しい電話番号を入力してください';
    }

    // Birthday validation
    if (!formData.birthday) {
      newErrors.birthday = '生年月日は必須です';
    }

    // Weight validation
    if (!formData.weight || formData.weight < 1 || formData.weight > 300) {
      newErrors.weight = '体重は1kg〜300kgの間で入力してください';
    }

    // Height validation  
    if (!formData.height || formData.height < 50 || formData.height > 250) {
      newErrors.height = '身長は50cm〜250cmの間で入力してください';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = '住所は必須です';
    } else if (formData.address.length < 5) {
      newErrors.address = '住所は5文字以上で入力してください';
    } else if (formData.address.length > 200) {
      newErrors.address = '住所は200文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('入力内容を確認してください');
      return;
    }

    setIsSubmitting(true);

    try {
      // Debug logging to check gender value before update
      console.log('Edit page - Form data gender:', formData.gender, typeof formData.gender);
      console.log('Edit page - Form data being sent:', formData);
      
      const result = await updateUser(parseInt(id as string), formData);
      
      if (result.success) {
        toast.success('利用者情報を更新しました', {
          duration: 3000,
          position: 'top-center',
        });

        // Redirect to user detail page
        router.push(`/user/${id}`);
      } else {
        toast.error(`更新に失敗しました: ${result.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('利用者情報の更新に失敗しました', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/user/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">利用者情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white text-center">
              利用者情報編集
            </h1>
            <p className="text-blue-100 text-center mt-2">
              見守りサービス - 利用者の基本情報を編集
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.client_id 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="クライアントIDを入力してください"
                min="1"
              />
              {errors.client_id && <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>}
            </div>

            {/* LINE ID */}
            <div>
              <label htmlFor="line_id" className="block text-sm font-medium text-gray-700 mb-2">
                LINE ID
              </label>
              <input
                type="text"
                id="line_id"
                name="line_id"
                value={formData.line_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.line_id 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="LINE IDを入力してください"
              />
              {errors.line_id && <p className="text-red-500 text-sm mt-1">{errors.line_id}</p>}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="名前を入力してください"
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
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
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.phone 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="電話番号を入力してください"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                住所
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.address 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="住所を入力してください"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Office */}
            <div>
              <label htmlFor="office" className="block text-sm font-medium text-gray-700 mb-2">
                事業所
              </label>
              <select
                id="office"
                name="office"
                value={formData.office}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {OfficeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                性別 (現在: {formData.gender === 1 ? '男性' : '女性'} - 値: {formData.gender})
              </label>
              <div className="flex gap-6">
                {GenderOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={handleRadioChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option.label} (値: {option.value})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Birthday, Weight, Height */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.birthday 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.birthday && <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>}
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  体重 (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.weight 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="体重"
                  min="1"
                  max="300"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  身長 (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.height 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="身長"
                  min="50"
                  max="250"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>
            </div>

            {/* Device Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="gateway_id" className="block text-sm font-medium text-gray-700 mb-2">
                  ゲートウェイID（任意）
                </label>
                <input
                  type="text"
                  id="gateway_id"
                  name="gateway_id"
                  value={formData.gateway_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="ゲートウェイIDを入力"
                />
              </div>

              <div>
                <label htmlFor="uid" className="block text-sm font-medium text-gray-700 mb-2">
                  UID（任意）
                </label>
                <input
                  type="text"
                  id="uid"
                  name="uid"
                  value={formData.uid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="UIDを入力"
                />
              </div>

              <div>
                <label htmlFor="device_id" className="block text-sm font-medium text-gray-700 mb-2">
                  デバイスID（任意）
                </label>
                <input
                  type="text"
                  id="device_id"
                  name="device_id"
                  value={formData.device_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="デバイスIDを入力"
                />
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '更新中...' : '更新'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit; 