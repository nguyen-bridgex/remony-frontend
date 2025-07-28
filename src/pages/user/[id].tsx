import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '../../types/user';
import { getUser } from '../../api/users';

const UserDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchUser(parseInt(id));
    }
  }, [id]);

  const fetchUser = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUser(userId);
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.message || 'ユーザーの取得に失敗しました');
      }
    } catch (error) {
      setError('ユーザーの取得中にエラーが発生しました');
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  const formatGender = (gender: number) => {
    return gender === 1 ? '男性' : '女性';
  };

  const formatAlertStatus = (enabled?: number) => {
    return enabled === 1 ? '有効' : '無効';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">ユーザー情報を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">エラー</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 text-center">ユーザーが見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-gray-600">ユーザーID: {user.id}</p>
            </div>
            <div className="space-x-3">
              <button 
                onClick={() => router.push(`/user/${user.id}/setting`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                設定画面
              </button>
              <button 
                onClick={() => router.back()}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                戻る
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LINE ID</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.line_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">クライアントID</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.client_id}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatGender(user.gender)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">生年月日</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatDate(user.birthday)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">体重</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.weight} kg</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">身長</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.height} cm</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">デバイス情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ゲートウェイID</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.gateway_id || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UID</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.uid || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">デバイスID</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.device_id || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">アラート設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">心拍数アラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.heart_rate_alert_enabled)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">皮膚温度アラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.skin_temp_alert_enabled)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">歩数アラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.step_alert_enabled)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">距離アラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.distance_alert_enabled)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">睡眠アラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.sleep_alert_enabled)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BMRカロリーアラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.bmr_cals_alert_enabled)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">活動カロリーアラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.act_cals_alert_enabled)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">太陽光発電アラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.solar_gen_alert_enabled)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">熱発電アラート</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatAlertStatus(user.thermal_gen_alert_enabled)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage; 