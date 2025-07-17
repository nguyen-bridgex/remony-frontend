import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { updateUserSettings, getUserSettings, UpdateSettingsRequest } from '../../../api/userSettings';

interface SettingsFormData {
  heart_rate_threshold: number;
  skin_temp_threshold: number;
  heart_rate_alert_enable: boolean;
  skin_temp_alert_enable: boolean;
}

const UserSettingsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [settings, setSettings] = useState<SettingsFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<SettingsFormData>({
    heart_rate_threshold: 50.0,
    skin_temp_threshold: 38.5,
    heart_rate_alert_enable: true,
    skin_temp_alert_enable: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user settings data using the API
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const userId = parseInt(id as string);
          const result = await getUserSettings(userId);
          
          if (result.success && result.data) {
            setSettings(result.data);
            setFormData(result.data);
          } else {
            console.error('Failed to fetch settings:', result.message);
            toast.error(`設定の取得に失敗しました: ${result.message}`);
            setSettings(null);
          }
        } catch (error) {
          console.error('Error fetching settings:', error);
          toast.error('設定の取得中にエラーが発生しました。');
          setSettings(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserSettings();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.heart_rate_threshold <= 0) {
      newErrors.heart_rate_threshold = '心拍数閾値は0より大きい値を入力してください';
    }
    if (formData.skin_temp_threshold <= 0) {
      newErrors.skin_temp_threshold = '皮膚温閾値は0より大きい値を入力してください';
    }
    if (formData.skin_temp_threshold < 35 || formData.skin_temp_threshold > 42) {
      newErrors.skin_temp_threshold = '皮膚温閾値は35-42℃の範囲で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Call the API to update settings with user ID
      const userId = parseInt(id as string);
      const result = await updateUserSettings(userId, formData);
      
      if (result.success) {
        toast.success('設定を更新しました！');
        setIsEditing(false);
        setSettings(formData);
      } else {
        toast.error(`結果： ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('設定の更新に失敗しました。');
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

  const handleBackToUser = () => {
    router.push(`/user/${id}`);
  };

  const handleBackToUserList = () => {
    router.push('/users');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">設定を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-gray-600 text-lg">設定が見つかりませんでした</p>
          <button
            onClick={handleBackToUser}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ユーザー詳細に戻る
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
                  アラート設定
                </h1>
                <p className="text-blue-100 mt-2">
                  Remony - ユーザーID: {id} の監視設定
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleBackToUserList}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  ユーザー一覧
                </button>
                <button
                  onClick={handleBackToUser}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  ユーザー詳細
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

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              /* Edit Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Heart Rate Alert Section */}
                <div className="bg-red-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-red-800 mb-6">心拍数アラート設定</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="heart_rate_alert_enable"
                        name="heart_rate_alert_enable"
                        checked={formData.heart_rate_alert_enable}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="heart_rate_alert_enable" className="text-sm font-medium text-gray-700">
                        心拍数アラートを有効にする
                      </label>
                    </div>

                    <div>
                      <label htmlFor="heart_rate_threshold" className="block text-sm font-medium text-gray-700 mb-2">
                        心拍数閾値（下限）（bpm）
                      </label>
                      <input
                        type="number"
                        id="heart_rate_threshold"
                        name="heart_rate_threshold"
                        value={formData.heart_rate_threshold}
                        onChange={handleInputChange}
                        min="1"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="50.0"
                      />
                      {errors.heart_rate_threshold && <p className="text-red-500 text-sm mt-1">{errors.heart_rate_threshold}</p>}
                    </div>
                  </div>
                </div>

                {/* Skin Temperature Alert Section */}
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-orange-800 mb-6">皮膚温アラート設定</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="skin_temp_alert_enable"
                        name="skin_temp_alert_enable"
                        checked={formData.skin_temp_alert_enable}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="skin_temp_alert_enable" className="text-sm font-medium text-gray-700">
                        皮膚温アラートを有効にする
                      </label>
                    </div>

                    <div>
                      <label htmlFor="skin_temp_threshold" className="block text-sm font-medium text-gray-700 mb-2">
                        皮膚温閾値（下限）（℃）
                      </label>
                      <input
                        type="number"
                        id="skin_temp_threshold"
                        name="skin_temp_threshold"
                        value={formData.skin_temp_threshold}
                        onChange={handleInputChange}
                        min="35"
                        max="42"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="38.5"
                      />
                      {errors.skin_temp_threshold && <p className="text-red-500 text-sm mt-1">{errors.skin_temp_threshold}</p>}
                    </div>
                  </div>
                </div>

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
                {/* Heart Rate Alert Display */}
                <div className="bg-red-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-red-800 mb-6">心拍数アラート設定</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">心拍数アラート</h3>
                      <p className="text-lg font-bold text-red-600">{settings.heart_rate_alert_enable ? 'ON' : 'OFF'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">心拍数閾値（下限）</h3>
                      <p className="text-2xl font-bold text-red-600">{settings.heart_rate_threshold} bpm</p>
                    </div>
                  </div>
                </div>
                
                {/* Skin Temperature Alert Display */}
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-orange-800 mb-6">皮膚温アラート設定</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">皮膚温アラート</h3>
                      <p className="text-lg font-bold text-orange-600">{settings.skin_temp_alert_enable ? 'ON' : 'OFF'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">皮膚温閾値（下限）</h3>
                      <p className="text-2xl font-bold text-orange-600">{settings.skin_temp_threshold}℃</p>
                    </div>
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

export default UserSettingsPage; 