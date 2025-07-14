import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserSettings, UserSettingsFormData } from '../../types/userSettings';

const UserSettingsPage = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserSettingsFormData>({
    hrDutyCycle: 60,
    caloriesGoal: 2000,
    sleepGoal: 8,
    stepsGoal: 10000,
    distanceGoal: 5000,
    alertHeartRateEnabled: false,
    alertHeartRateLowerThreshold: 50,
    alertHeartRateUpperThreshold: 100,
    alertSosEnabled: true,
    alertDetectFallDownEnabled: true,
    alertAwakeningEnabled: false,
    alertAwakeningWatchingStartTime: 22,
    alertAwakeningWatchingEndTime: 6,
    alertAwakeningDurationThresholdMinutes: 30,
    alertNonWearingEnabled: true,
    alertNonWearingDurationMinutesLimit: 60,
    alertDisconnectionEnabled: true,
    alertDisconnectionTimeoutMinutesThreshold: 10,
    alertHeatstrokeEnabled: true,
    alertHeatstrokeSkinTempThreshold: 38
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock settings data
  useEffect(() => {
    const mockSettings: UserSettings = {
      id: 1,
      userid: 1,
      hrDutyCycle: 60,
      caloriesGoal: 2000,
      sleepGoal: 8,
      stepsGoal: 10000,
      distanceGoal: 5000,
      alertHeartRateEnabled: false,
      alertHeartRateLowerThreshold: 50,
      alertHeartRateUpperThreshold: 100,
      alertSosEnabled: true,
      alertDetectFallDownEnabled: true,
      alertAwakeningEnabled: false,
      alertAwakeningWatchingStartTime: 22,
      alertAwakeningWatchingEndTime: 6,
      alertAwakeningDurationThresholdMinutes: 30,
      alertNonWearingEnabled: true,
      alertNonWearingDurationMinutesLimit: 60,
      alertDisconnectionEnabled: true,
      alertDisconnectionTimeoutMinutesThreshold: 10,
      alertHeatstrokeEnabled: true,
      alertHeatstrokeSkinTempThreshold: 38
    };
    setSettings(mockSettings);
    setFormData({
      hrDutyCycle: mockSettings.hrDutyCycle,
      caloriesGoal: mockSettings.caloriesGoal,
      sleepGoal: mockSettings.sleepGoal,
      stepsGoal: mockSettings.stepsGoal,
      distanceGoal: mockSettings.distanceGoal,
      alertHeartRateEnabled: mockSettings.alertHeartRateEnabled,
      alertHeartRateLowerThreshold: mockSettings.alertHeartRateLowerThreshold,
      alertHeartRateUpperThreshold: mockSettings.alertHeartRateUpperThreshold,
      alertSosEnabled: mockSettings.alertSosEnabled,
      alertDetectFallDownEnabled: mockSettings.alertDetectFallDownEnabled,
      alertAwakeningEnabled: mockSettings.alertAwakeningEnabled,
      alertAwakeningWatchingStartTime: mockSettings.alertAwakeningWatchingStartTime,
      alertAwakeningWatchingEndTime: mockSettings.alertAwakeningWatchingEndTime,
      alertAwakeningDurationThresholdMinutes: mockSettings.alertAwakeningDurationThresholdMinutes,
      alertNonWearingEnabled: mockSettings.alertNonWearingEnabled,
      alertNonWearingDurationMinutesLimit: mockSettings.alertNonWearingDurationMinutesLimit,
      alertDisconnectionEnabled: mockSettings.alertDisconnectionEnabled,
      alertDisconnectionTimeoutMinutesThreshold: mockSettings.alertDisconnectionTimeoutMinutesThreshold,
      alertHeatstrokeEnabled: mockSettings.alertHeatstrokeEnabled,
      alertHeatstrokeSkinTempThreshold: mockSettings.alertHeatstrokeSkinTempThreshold
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.hrDutyCycle <= 0) newErrors.hrDutyCycle = '心拍測定周期は0より大きい値を入力してください';
    if (formData.caloriesGoal <= 0) newErrors.caloriesGoal = 'カロリー目標は0より大きい値を入力してください';
    if (formData.sleepGoal <= 0) newErrors.sleepGoal = '睡眠目標は0より大きい値を入力してください';
    if (formData.stepsGoal <= 0) newErrors.stepsGoal = '歩数目標は0より大きい値を入力してください';
    if (formData.distanceGoal <= 0) newErrors.distanceGoal = '距離目標は0より大きい値を入力してください';
    
    if (formData.alertHeartRateEnabled) {
      if (formData.alertHeartRateLowerThreshold <= 0) newErrors.alertHeartRateLowerThreshold = '心拍アラート下限は0より大きい値を入力してください';
      if (formData.alertHeartRateUpperThreshold <= 0) newErrors.alertHeartRateUpperThreshold = '心拍アラート上限は0より大きい値を入力してください';
      if (formData.alertHeartRateLowerThreshold >= formData.alertHeartRateUpperThreshold) {
        newErrors.alertHeartRateUpperThreshold = '心拍アラート上限は下限より大きい値を入力してください';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Settings updated:', formData);
      alert('設定を更新しました！');
      setIsEditing(false);
      if (settings) {
        setSettings({ ...settings, ...formData });
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (settings) {
      setFormData({
        hrDutyCycle: settings.hrDutyCycle,
        caloriesGoal: settings.caloriesGoal,
        sleepGoal: settings.sleepGoal,
        stepsGoal: settings.stepsGoal,
        distanceGoal: settings.distanceGoal,
        alertHeartRateEnabled: settings.alertHeartRateEnabled,
        alertHeartRateLowerThreshold: settings.alertHeartRateLowerThreshold,
        alertHeartRateUpperThreshold: settings.alertHeartRateUpperThreshold,
        alertSosEnabled: settings.alertSosEnabled,
        alertDetectFallDownEnabled: settings.alertDetectFallDownEnabled,
        alertAwakeningEnabled: settings.alertAwakeningEnabled,
        alertAwakeningWatchingStartTime: settings.alertAwakeningWatchingStartTime,
        alertAwakeningWatchingEndTime: settings.alertAwakeningWatchingEndTime,
        alertAwakeningDurationThresholdMinutes: settings.alertAwakeningDurationThresholdMinutes,
        alertNonWearingEnabled: settings.alertNonWearingEnabled,
        alertNonWearingDurationMinutesLimit: settings.alertNonWearingDurationMinutesLimit,
        alertDisconnectionEnabled: settings.alertDisconnectionEnabled,
        alertDisconnectionTimeoutMinutesThreshold: settings.alertDisconnectionTimeoutMinutesThreshold,
        alertHeatstrokeEnabled: settings.alertHeatstrokeEnabled,
        alertHeatstrokeSkinTempThreshold: settings.alertHeatstrokeSkinTempThreshold
      });
    }
    setErrors({});
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">設定を読み込み中...</p>
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
                  ユーザー設定
                </h1>
                <p className="text-blue-100 mt-2">
                  Remony - 健康管理とアラート設定
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/user/detail')}
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
                {/* Health Goals Section */}
                <div className="bg-green-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-green-800 mb-6">健康目標設定</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="caloriesGoal" className="block text-sm font-medium text-gray-700 mb-2">
                        カロリー目標（kcal）
                      </label>
                      <input
                        type="number"
                        id="caloriesGoal"
                        name="caloriesGoal"
                        value={formData.caloriesGoal}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="2000"
                      />
                      {errors.caloriesGoal && <p className="text-red-500 text-sm mt-1">{errors.caloriesGoal}</p>}
                    </div>

                    <div>
                      <label htmlFor="sleepGoal" className="block text-sm font-medium text-gray-700 mb-2">
                        睡眠目標（時間）
                      </label>
                      <input
                        type="number"
                        id="sleepGoal"
                        name="sleepGoal"
                        value={formData.sleepGoal}
                        onChange={handleInputChange}
                        min="1"
                        max="24"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="8"
                      />
                      {errors.sleepGoal && <p className="text-red-500 text-sm mt-1">{errors.sleepGoal}</p>}
                    </div>

                    <div>
                      <label htmlFor="stepsGoal" className="block text-sm font-medium text-gray-700 mb-2">
                        歩数目標（歩）
                      </label>
                      <input
                        type="number"
                        id="stepsGoal"
                        name="stepsGoal"
                        value={formData.stepsGoal}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="10000"
                      />
                      {errors.stepsGoal && <p className="text-red-500 text-sm mt-1">{errors.stepsGoal}</p>}
                    </div>

                    <div>
                      <label htmlFor="distanceGoal" className="block text-sm font-medium text-gray-700 mb-2">
                        距離目標（m）
                      </label>
                      <input
                        type="number"
                        id="distanceGoal"
                        name="distanceGoal"
                        value={formData.distanceGoal}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="5000"
                      />
                      {errors.distanceGoal && <p className="text-red-500 text-sm mt-1">{errors.distanceGoal}</p>}
                    </div>
                  </div>
                </div>

                {/* Heart Rate Monitoring Section */}
                <div className="bg-red-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-red-800 mb-6">心拍監視設定</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="hrDutyCycle" className="block text-sm font-medium text-gray-700 mb-2">
                        心拍測定周期（秒）
                      </label>
                      <input
                        type="number"
                        id="hrDutyCycle"
                        name="hrDutyCycle"
                        value={formData.hrDutyCycle}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="60"
                      />
                      {errors.hrDutyCycle && <p className="text-red-500 text-sm mt-1">{errors.hrDutyCycle}</p>}
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="alertHeartRateEnabled"
                        name="alertHeartRateEnabled"
                        checked={formData.alertHeartRateEnabled}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="alertHeartRateEnabled" className="text-sm font-medium text-gray-700">
                        心拍アラートを有効にする
                      </label>
                    </div>

                    {formData.alertHeartRateEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                        <div>
                          <label htmlFor="alertHeartRateLowerThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                            心拍アラート下限（bpm）
                          </label>
                          <input
                            type="number"
                            id="alertHeartRateLowerThreshold"
                            name="alertHeartRateLowerThreshold"
                            value={formData.alertHeartRateLowerThreshold}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            placeholder="50"
                          />
                          {errors.alertHeartRateLowerThreshold && <p className="text-red-500 text-sm mt-1">{errors.alertHeartRateLowerThreshold}</p>}
                        </div>

                        <div>
                          <label htmlFor="alertHeartRateUpperThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                            心拍アラート上限（bpm）
                          </label>
                          <input
                            type="number"
                            id="alertHeartRateUpperThreshold"
                            name="alertHeartRateUpperThreshold"
                            value={formData.alertHeartRateUpperThreshold}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            placeholder="100"
                          />
                          {errors.alertHeartRateUpperThreshold && <p className="text-red-500 text-sm mt-1">{errors.alertHeartRateUpperThreshold}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Safety Alerts Section */}
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-orange-800 mb-6">安全アラート設定</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="alertSosEnabled"
                        name="alertSosEnabled"
                        checked={formData.alertSosEnabled}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="alertSosEnabled" className="text-sm font-medium text-gray-700">
                        SOSアラートを有効にする
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="alertDetectFallDownEnabled"
                        name="alertDetectFallDownEnabled"
                        checked={formData.alertDetectFallDownEnabled}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="alertDetectFallDownEnabled" className="text-sm font-medium text-gray-700">
                        転倒検知アラートを有効にする
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="alertHeatstrokeEnabled"
                        name="alertHeatstrokeEnabled"
                        checked={formData.alertHeatstrokeEnabled}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="alertHeatstrokeEnabled" className="text-sm font-medium text-gray-700">
                        熱中症アラートを有効にする
                      </label>
                    </div>

                    {formData.alertHeatstrokeEnabled && (
                      <div className="pl-8">
                        <label htmlFor="alertHeatstrokeSkinTempThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                          熱中症アラート体温閾値（℃）
                        </label>
                        <input
                          type="number"
                          id="alertHeatstrokeSkinTempThreshold"
                          name="alertHeatstrokeSkinTempThreshold"
                          value={formData.alertHeatstrokeSkinTempThreshold}
                          onChange={handleInputChange}
                          min="35"
                          max="42"
                          step="0.1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          placeholder="38.0"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
                  >
                    設定を保存
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
              <div className="space-y-8">
                {/* Health Goals Display */}
                <div className="bg-green-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-green-800 mb-6">健康目標設定</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">カロリー目標</h3>
                      <p className="text-2xl font-bold text-green-600">{settings.caloriesGoal} kcal</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">睡眠目標</h3>
                      <p className="text-2xl font-bold text-green-600">{settings.sleepGoal} 時間</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">歩数目標</h3>
                      <p className="text-2xl font-bold text-green-600">{settings.stepsGoal.toLocaleString()} 歩</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">距離目標</h3>
                      <p className="text-2xl font-bold text-green-600">{settings.distanceGoal.toLocaleString()} m</p>
                    </div>
                  </div>
                </div>

                {/* Heart Rate Monitoring Display */}
                <div className="bg-red-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-red-800 mb-6">心拍監視設定</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">測定周期</h3>
                      <p className="text-2xl font-bold text-red-600">{settings.hrDutyCycle} 秒</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">心拍アラート</h3>
                      <p className="text-lg font-bold text-red-600">{settings.alertHeartRateEnabled ? 'ON' : 'OFF'}</p>
                      {settings.alertHeartRateEnabled && (
                        <p className="text-sm text-gray-600 mt-1">
                          {settings.alertHeartRateLowerThreshold} - {settings.alertHeartRateUpperThreshold} bpm
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Safety Alerts Display */}
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-orange-800 mb-6">安全アラート設定</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">SOSアラート</h3>
                      <p className="text-lg font-bold text-orange-600">{settings.alertSosEnabled ? 'ON' : 'OFF'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">転倒検知</h3>
                      <p className="text-lg font-bold text-orange-600">{settings.alertDetectFallDownEnabled ? 'ON' : 'OFF'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">熱中症アラート</h3>
                      <p className="text-lg font-bold text-orange-600">{settings.alertHeatstrokeEnabled ? 'ON' : 'OFF'}</p>
                      {settings.alertHeatstrokeEnabled && (
                        <p className="text-sm text-gray-600 mt-1">{settings.alertHeatstrokeSkinTempThreshold}℃</p>
                      )}
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