import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { updateUserSettings, getUserSettings, UpdateSettingsRequest } from '../../../api/userSettings';
import { getUsers } from '../../../api/users';
import { User } from '../../../types/user';

interface SettingsFormData {
  // Steps
  step_lower_threshold: number;
  step_upper_threshold: number;
  step_alert_enabled: boolean;
  
  // Distance
  distance_lower_threshold: number;
  distance_upper_threshold: number;
  distance_alert_enabled: boolean;
  
  // Heart Rate
  heart_rate_lower_threshold: number;
  heart_rate_upper_threshold: number;
  heart_rate_alert_enabled: boolean;
  
  // Sleep
  sleep_lower_threshold: number;
  sleep_upper_threshold: number;
  sleep_alert_enabled: boolean;
  
  // BMR Calories
  bmr_cals_lower_threshold: number;
  bmr_cals_upper_threshold: number;
  bmr_cals_alert_enabled: boolean;
  
  // Activity Calories
  act_cals_lower_threshold: number;
  act_cals_upper_threshold: number;
  act_cals_alert_enabled: boolean;
  
  // Skin Temperature
  skin_temp_lower_threshold: number;
  skin_temp_upper_threshold: number;
  skin_temp_alert_enabled: boolean;
  
  // Solar Generation
  solar_gen_lower_threshold: number;
  solar_gen_upper_threshold: number;
  solar_gen_alert_enabled: boolean;
  
  // Thermal Generation
  thermal_gen_lower_threshold: number;
  thermal_gen_upper_threshold: number;
  thermal_gen_alert_enabled: boolean;
  
  // Alert message
  alert_message: string;
}

interface MetricConfig {
  key: keyof Omit<SettingsFormData, 'alert_message'>;
  name: string;
  unit: string;
  color: string;
  lowerKey: keyof SettingsFormData;
  upperKey: keyof SettingsFormData;
  alertKey: keyof SettingsFormData;
  lowerPlaceholder: string;
  upperPlaceholder: string;
  stepValue: string;
  minLimit?: number;
  maxLimit?: number;
}

const METRICS_CONFIG: MetricConfig[] = [
  {
    key: 'step_lower_threshold',
    name: '歩数',
    unit: '歩',
    color: 'blue',
    lowerKey: 'step_lower_threshold',
    upperKey: 'step_upper_threshold',
    alertKey: 'step_alert_enabled',
    lowerPlaceholder: '0',
    upperPlaceholder: '10000',
    stepValue: '1',
    minLimit: 0,
  },
  {
    key: 'distance_lower_threshold',
    name: '距離',
    unit: 'km',
    color: 'green',
    lowerKey: 'distance_lower_threshold',
    upperKey: 'distance_upper_threshold',
    alertKey: 'distance_alert_enabled',
    lowerPlaceholder: '0',
    upperPlaceholder: '10',
    stepValue: '0.1',
    minLimit: 0,
  },
  {
    key: 'heart_rate_lower_threshold',
    name: '心拍数',
    unit: 'bpm',
    color: 'red',
    lowerKey: 'heart_rate_lower_threshold',
    upperKey: 'heart_rate_upper_threshold',
    alertKey: 'heart_rate_alert_enabled',
    lowerPlaceholder: '50',
    upperPlaceholder: '150',
    stepValue: '1',
    minLimit: 30,
    maxLimit: 220,
  },
  {
    key: 'sleep_lower_threshold',
    name: '睡眠時間',
    unit: '時間',
    color: 'purple',
    lowerKey: 'sleep_lower_threshold',
    upperKey: 'sleep_upper_threshold',
    alertKey: 'sleep_alert_enabled',
    lowerPlaceholder: '6',
    upperPlaceholder: '10',
    stepValue: '0.5',
    minLimit: 0,
    maxLimit: 24,
  },
  {
    key: 'bmr_cals_lower_threshold',
    name: '基礎代謝カロリー',
    unit: 'kcal',
    color: 'orange',
    lowerKey: 'bmr_cals_lower_threshold',
    upperKey: 'bmr_cals_upper_threshold',
    alertKey: 'bmr_cals_alert_enabled',
    lowerPlaceholder: '1200',
    upperPlaceholder: '2500',
    stepValue: '10',
    minLimit: 500,
  },
  {
    key: 'act_cals_lower_threshold',
    name: '活動カロリー',
    unit: 'kcal',
    color: 'yellow',
    lowerKey: 'act_cals_lower_threshold',
    upperKey: 'act_cals_upper_threshold',
    alertKey: 'act_cals_alert_enabled',
    lowerPlaceholder: '200',
    upperPlaceholder: '1000',
    stepValue: '10',
    minLimit: 0,
  },
  {
    key: 'skin_temp_lower_threshold',
    name: '皮膚温',
    unit: '℃',
    color: 'pink',
    lowerKey: 'skin_temp_lower_threshold',
    upperKey: 'skin_temp_upper_threshold',
    alertKey: 'skin_temp_alert_enabled',
    lowerPlaceholder: '35.0',
    upperPlaceholder: '38.5',
    stepValue: '0.1',
    minLimit: 30,
    maxLimit: 45,
  },
  {
    key: 'solar_gen_lower_threshold',
    name: '太陽光発電',
    unit: '%',
    color: 'cyan',
    lowerKey: 'solar_gen_lower_threshold',
    upperKey: 'solar_gen_upper_threshold',
    alertKey: 'solar_gen_alert_enabled',
    lowerPlaceholder: '0',
    upperPlaceholder: '100',
    stepValue: '1',
    minLimit: 0,
    maxLimit: 100,
  },
  {
    key: 'thermal_gen_lower_threshold',
    name: '熱発電',
    unit: '%',
    color: 'indigo',
    lowerKey: 'thermal_gen_lower_threshold',
    upperKey: 'thermal_gen_upper_threshold',
    alertKey: 'thermal_gen_alert_enabled',
    lowerPlaceholder: '0',
    upperPlaceholder: '100',
    stepValue: '1',
    minLimit: 0,
    maxLimit: 100,
  },
];

const COLOR_CLASSES = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-800', ring: 'focus:ring-blue-500', button: 'text-blue-600' },
  green: { bg: 'bg-green-50', text: 'text-green-800', ring: 'focus:ring-green-500', button: 'text-green-600' },
  red: { bg: 'bg-red-50', text: 'text-red-800', ring: 'focus:ring-red-500', button: 'text-red-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-800', ring: 'focus:ring-purple-500', button: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-800', ring: 'focus:ring-orange-500', button: 'text-orange-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', ring: 'focus:ring-yellow-500', button: 'text-yellow-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-800', ring: 'focus:ring-pink-500', button: 'text-pink-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-800', ring: 'focus:ring-cyan-500', button: 'text-cyan-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-800', ring: 'focus:ring-indigo-500', button: 'text-indigo-600' },
};

const AlertSettingsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log({id});
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<SettingsFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [formData, setFormData] = useState<SettingsFormData>({
    step_lower_threshold: 0,
    step_upper_threshold: 10000,
    step_alert_enabled: false,
    distance_lower_threshold: 0,
    distance_upper_threshold: 10,
    distance_alert_enabled: false,
    heart_rate_lower_threshold: 50,
    heart_rate_upper_threshold: 150,
    heart_rate_alert_enabled: true,
    sleep_lower_threshold: 6,
    sleep_upper_threshold: 10,
    sleep_alert_enabled: false,
    bmr_cals_lower_threshold: 1200,
    bmr_cals_upper_threshold: 2500,
    bmr_cals_alert_enabled: false,
    act_cals_lower_threshold: 200,
    act_cals_upper_threshold: 1000,
    act_cals_alert_enabled: false,
    skin_temp_lower_threshold: 35.0,
    skin_temp_upper_threshold: 38.5,
    skin_temp_alert_enabled: true,
    solar_gen_lower_threshold: 0,
    solar_gen_upper_threshold: 100,
    solar_gen_alert_enabled: false,
    thermal_gen_lower_threshold: 0,
    thermal_gen_upper_threshold: 100,
    thermal_gen_alert_enabled: false,
    alert_message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users list for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const result = await getUsers();
        if (result.success && result.data) {
          setUsers(result.data);
          setSelectedUserId(id ? parseInt(id as string) : 0);
        } else {
          console.error('Failed to fetch users:', result.message);
          toast.error(`利用者の取得に失敗しました: ${result.message}`);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('利用者の取得中にエラーが発生しました。');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [id]);

  console.log({selectedUserId});

  // Fetch user settings when selected user changes
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (selectedUserId > 0) {
        setIsLoading(true);
        try {
          const result = await getUserSettings(selectedUserId);
          
          if (result.success && result.data) {
            setSettings(result.data);
            setFormData(result.data);
          } else {
            console.error('Failed to fetch settings:', result.message);
            // Keep default settings if none exist
          }
        } catch (error) {
          console.error('Error fetching settings:', error);
          toast.error('設定の取得中にエラーが発生しました。');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserSettings();
  }, [selectedUserId]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value);
    setSelectedUserId(userId);
    // Update URL without page reload
    router.replace(`/user/${userId}/setting`, undefined, { shallow: true });
    setIsEditing(false); // Reset editing state when changing user
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    METRICS_CONFIG.forEach(metric => {
      const minValue = formData[metric.lowerKey] as number;
      const maxValue = formData[metric.upperKey] as number;
      
      if (minValue < 0) {
        newErrors[metric.lowerKey] = `${metric.name}の最小値は0以上である必要があります`;
      }
      
      if (metric.minLimit !== undefined && minValue < metric.minLimit) {
        newErrors[metric.lowerKey] = `${metric.name}の最小値は${metric.minLimit}以上である必要があります`;
      }
      
      if (metric.maxLimit !== undefined && maxValue > metric.maxLimit) {
        newErrors[metric.upperKey] = `${metric.name}の最大値は${metric.maxLimit}以下である必要があります`;
      }
      
      if (minValue >= maxValue) {
        newErrors[metric.lowerKey] = `${metric.name}の最小値は最大値より小さい必要があります`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || selectedUserId <= 0) return;

    setIsSubmitting(true);
    try {
      const result = await updateUserSettings(selectedUserId, formData);
      
      if (result.success || (result.message && result.message.toLowerCase().includes('updated'))) {
        toast.success('設定を更新しました！');
        setIsEditing(false);
        setSettings(formData);
      } else {
        toast.error(`設定の更新に失敗しました: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('設定の更新中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (settings) {
      setFormData(settings);
    }
    setErrors({});
  };

  const handleBackToUserList = () => {
    router.push('/users');
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  if (isLoadingUsers) {
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  ヘルスメトリック設定
                </h1>
                <p className="text-blue-100 mt-2">
                  見守りサービス - 各種メトリックのアラート設定管理
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleBackToUserList}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  利用者一覧
                </button>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors"
                  >
                    設定編集
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* User Selection */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="max-w-md">
              <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                利用者を選択
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={handleUserChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="0">利用者を選択してください</option>
                {users.map((user) => (
                  <option key={user.id} value={parseInt(user.id + "")}>
                    {user.name} (ID: {user.id})
                  </option>
                ))}
              </select>
            </div>
            {selectedUser && (
              <div className="mt-3 text-sm text-gray-600">
                選択中: {selectedUser.name} ({selectedUser.email})
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedUserId === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">利用者を選択してください</div>
                <div className="text-gray-400 text-sm mt-2">上のプルダウンから設定したい利用者を選択してください</div>
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">設定を読み込み中...</p>
              </div>
            ) : (
              <>
                {isEditing ? (
                  /* Edit Form */
                  <form onSubmit={handleSubmit} className="space-y-8 relative">
                    
                    {/* Loading Overlay */}
                    {isSubmitting && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-xl">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                          <p className="text-gray-600 mt-4 font-medium">設定を保存中...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {METRICS_CONFIG.map((metric) => {
                        const colorClass = COLOR_CLASSES[metric.color as keyof typeof COLOR_CLASSES];
                        return (
                          <div key={metric.key} className={`${colorClass.bg} p-6 rounded-xl`}>
                            <h2 className={`text-2xl font-bold ${colorClass.text} mb-6`}>
                              {metric.name} ({metric.unit})
                            </h2>
                            <div className="space-y-6">
                              {/* Alert Enable Checkbox */}
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  id={metric.alertKey}
                                  name={metric.alertKey}
                                  checked={formData[metric.alertKey] as boolean}
                                  onChange={handleInputChange}
                                  className={`h-5 w-5 ${colorClass.button} ${colorClass.ring} border-gray-300 rounded`}
                                />
                                <label htmlFor={metric.alertKey} className="text-sm font-medium text-gray-700">
                                  {metric.name}アラートを有効にする
                                </label>
                              </div>

                              {/* Min Value */}
                              <div>
                                <label htmlFor={metric.lowerKey} className="block text-sm font-medium text-gray-700 mb-2">
                                  最小値 ({metric.unit})
                                </label>
                                <input
                                  type="number"
                                  id={metric.lowerKey}
                                  name={metric.lowerKey}
                                  value={formData[metric.lowerKey] as number}
                                  onChange={handleInputChange}
                                  min={metric.minLimit}
                                  max={metric.maxLimit}
                                  step={metric.stepValue}
                                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${colorClass.ring} focus:border-transparent transition-all duration-200`}
                                  placeholder={metric.lowerPlaceholder}
                                />
                                {errors[metric.lowerKey] && <p className="text-red-500 text-sm mt-1">{errors[metric.lowerKey]}</p>}
                              </div>

                              {/* Max Value */}
                              <div>
                                <label htmlFor={metric.upperKey} className="block text-sm font-medium text-gray-700 mb-2">
                                  最大値 ({metric.unit})
                                </label>
                                <input
                                  type="number"
                                  id={metric.upperKey}
                                  name={metric.upperKey}
                                  value={formData[metric.upperKey] as number}
                                  onChange={handleInputChange}
                                  min={metric.minLimit}
                                  max={metric.maxLimit}
                                  step={metric.stepValue}
                                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${colorClass.ring} focus:border-transparent transition-all duration-200`}
                                  placeholder={metric.upperPlaceholder}
                                />
                                {errors[metric.upperKey] && <p className="text-red-500 text-sm mt-1">{errors[metric.upperKey]}</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Alert Message Section */}
                    {/* <div className="bg-gray-50 p-6 rounded-xl">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">アラートメッセージ設定</h2>
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="alert_message" className="block text-sm font-medium text-gray-700 mb-2">
                            アラートメッセージ
                          </label>
                          <textarea
                            id="alert_message"
                            name="alert_message"
                            value={formData.alert_message}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                            placeholder="アラート時に表示するメッセージを入力してください..."
                          />
                          {errors.alert_message && <p className="text-red-500 text-sm mt-1">{errors.alert_message}</p>}
                        </div>
                      </div>
                    </div> */}

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? '保存中...' : '設定を保存'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        キャンセル
                      </button>
                    </div>
                  </form>
                ) : (
                  /* View Mode */
                  <div className="space-y-8">
                    {/* Metrics Grid Display */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {METRICS_CONFIG.map((metric) => {
                        const colorClass = COLOR_CLASSES[metric.color as keyof typeof COLOR_CLASSES];
                        return (
                          <div key={metric.key} className={`${colorClass.bg} p-6 rounded-xl`}>
                            <h2 className={`text-xl font-bold ${colorClass.text} mb-4`}>
                              {metric.name}
                            </h2>
                            <div className="space-y-3">
                              <div className="bg-white p-3 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-600 mb-1">アラート状態</h3>
                                <p className={`text-lg font-bold ${formData[metric.alertKey] ? colorClass.button : 'text-gray-400'}`}>
                                  {formData[metric.alertKey] ? 'ON' : 'OFF'}
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-600 mb-1">範囲設定</h3>
                                <p className={`text-base font-bold ${colorClass.button}`}>
                                  {formData[metric.lowerKey]} - {formData[metric.upperKey]} {metric.unit}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Alert Message Display */}
                    {/* <div className="bg-gray-50 p-6 rounded-xl">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">アラートメッセージ設定</h2>
                      <div className="bg-white p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">アラートメッセージ</h3>
                        <p className="text-gray-800 text-base leading-relaxed">
                          {settings?.alert_message || 'メッセージが設定されていません'}
                        </p>
                      </div>
                    </div> */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertSettingsPage; 