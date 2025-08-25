import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { User, UserFormData, GenderOptions, VitalDeviceOptions, NotificationTargetOptions, HospitalOptions } from '../../types/user';
import { registUser } from '../../api/users';
import { getHospitalList, Hospital } from '../../api/hospitals';

const UserRegister = () => {
  const router = useRouter();
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
    hospital: 'おうちのカンゴ',
    gateway_id: '',
    uid: '',
    device_id: '',
    vital_device: 'remony',
    notification_target: 'line'
  });

  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(true);

  // Fetch hospital list on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoadingHospitals(true);
      try {
        const response = await getHospitalList();
        if (response.success && response.hospitals) {
          setHospitals(response.hospitals);
          // Set default to first hospital if available
          if (response.hospitals.length > 0) {
            const defaultHospital = response.hospitals[0];
            setSelectedHospitalId(defaultHospital.id);
            setFormData(prev => ({ ...prev, hospital: defaultHospital.name }));
          }
        } else {
          console.error('Failed to fetch hospitals:', response.message);
          toast.error('病院リストの読み込みに失敗しました');
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        toast.error('病院リストの読み込み中にエラーが発生しました');
      } finally {
        setIsLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, []);

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
    console.log('Radio change - value:', e.target.value, 'parsed:', genderValue);
    setFormData(prev => ({
      ...prev,
      gender: genderValue
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Client ID validation
    if (formData.client_id <= 0) {
      newErrors.client_id = 'クライアントIDは必須です';
    }
    
    // LINE ID validation
    if (!formData.line_id.trim()) {
      newErrors.line_id = 'LINE IDは必須です';
    } else if (formData.line_id.length < 3) {
      newErrors.line_id = 'LINE IDは3文字以上で入力してください';
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    } else if (formData.name.length < 2) {
      newErrors.name = '名前は2文字以上で入力してください';
    } else if (formData.name.length > 50) {
      newErrors.name = '名前は50文字以内で入力してください';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    } else if (formData.email.length > 100) {
      newErrors.email = 'メールアドレスは100文字以内で入力してください';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号は必須です';
    } else if (!/^[\d\-\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = '電話番号は数字、ハイフン、括弧、スペースのみ使用可能です';
    } else if (formData.phone.replace(/[\d\-\(\)\s]/g, '').length > 0) {
      newErrors.phone = '電話番号に無効な文字が含まれています';
    }
    
    // Birthday validation
    if (!formData.birthday) {
      newErrors.birthday = '生年月日は必須です';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
      
      if (actualAge < 0) {
        newErrors.birthday = '生年月日は今日以前の日付を入力してください';
      } else if (actualAge > 120) {
        newErrors.birthday = '生年月日が正しくありません';
      }
    }
    
    // Weight validation
    if (formData.weight <= 0) {
      newErrors.weight = '体重は0より大きい値を入力してください';
    } else if (formData.weight > 300) {
      newErrors.weight = '体重は300kg以下で入力してください';
    }
    
    // Height validation
    if (formData.height <= 0) {
      newErrors.height = '身長は0より大きい値を入力してください';
    } else if (formData.height > 250) {
      newErrors.height = '身長は250cm以下で入力してください';
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
    
    // Show toast notification if there are validation errors
    if (Object.keys(newErrors).length > 0) {
      const errorCount = Object.keys(newErrors).length;
      toast.error(`${errorCount}個の入力エラーがあります。入力内容を確認してください。`, {
        duration: 4000,
        position: 'top-center',
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert UserFormData to User format expected by API
      const userData: User = {
        id: 0, // Will be assigned by backend
        name: formData.name,
        client_id: formData.client_id,
        line_id: formData.line_id,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        birthday: formData.birthday,
        weight: formData.weight,
        height: formData.height,
        address: formData.address,
        hospital: formData.hospital,
        hospital_id: selectedHospitalId || undefined,
        hospital_name: formData.hospital,
        gateway_id: formData.gateway_id || undefined,
        uid: formData.uid || undefined,
        device_id: formData.device_id || undefined
      };

      // Debug logging to check gender value
      console.log('Form data gender:', formData.gender, typeof formData.gender);
      console.log('User data being sent:', userData);

      const response = await registUser(userData);

      if (response.success) {
        toast.success('利用者登録が完了しました！', {
          duration: 4000,
          position: 'top-center',
        });
        
        // Redirect to users page after showing success message
        setTimeout(() => {
          router.push('/users');
        }, 2000);
      } else {
        toast.error(response.message || '登録に失敗しました。もう一度お試しください。', {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('登録中にエラーが発生しました。もう一度お試しください。', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white text-center">
              利用者登録
            </h1>
            <p className="text-blue-100 text-center mt-2">
              見守りサービス - 新しい利用者を登録しましょう
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
                type="text"
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

            {/* Hospital */}
            <div>
              <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-2">
                病院/医院
              </label>
                                <select
                    id="hospital"
                    name="hospital"
                    value={selectedHospitalId || ''}
                    onChange={(e) => {
                      const hospitalId = e.target.value ? parseInt(e.target.value) : null;
                      setSelectedHospitalId(hospitalId);
                      if (hospitalId) {
                        const selectedHospital = hospitals.find(h => h.id === hospitalId);
                        if (selectedHospital) {
                          setFormData(prev => ({ ...prev, hospital: selectedHospital.name }));
                        }
                      } else {
                        setFormData(prev => ({ ...prev, hospital: '' }));
                      }
                    }}
                    disabled={isLoadingHospitals}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">病院を選択してください</option>
                    {isLoadingHospitals ? (
                      <option value="" disabled>読み込み中...</option>
                    ) : (
                      <>
                        {hospitals.length > 0 ? (
                          hospitals.map(hospital => (
                            <option key={hospital.id} value={hospital.id}>
                              {hospital.name}
                            </option>
                          ))
                        ) : (
                          // Fallback to static options if API fails
                          HospitalOptions.map((option, index) => (
                            <option key={option.value} value={index + 1}>
                              {option.label}
                            </option>
                          ))
                        )}
                      </>
                    )}
                  </select>
              {isLoadingHospitals && (
                <p className="text-sm text-gray-500 mt-1">病院リストを読み込んでいます...</p>
              )}
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

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                性別 (現在: {formData.gender === 1 ? '男性' : '女性'} - 値: {formData.gender})
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
                    <span className="ml-2 text-gray-700">{option.label} (値: {option.value})</span>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.birthday 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.weight 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.height 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="身長を入力"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>
            </div>

            {/* Vital Device */}
            <div>
              <label htmlFor="vital_device" className="block text-sm font-medium text-gray-700 mb-2">
                バイタル機器
              </label>
              <select
                id="vital_device"
                name="vital_device"
                value={formData.vital_device}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {VitalDeviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Target */}
            {/* <div>
              <label htmlFor="notification_target" className="block text-sm font-medium text-gray-700 mb-2">
                通知先設定
              </label>
              <select
                id="notification_target"
                name="notification_target"
                value={formData.notification_target}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {NotificationTargetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">MVPでは処理の実装は行いません</p>
            </div> */}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    登録中...
                  </div>
                ) : (
                  '利用者登録'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister; 