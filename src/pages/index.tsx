import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const navigateToRegister = () => {
    router.push('/user/register');
  };

  const navigateToUserList = () => {
    router.push('/users');
  };

  const navigateToAlertSettings = () => {
    router.push('/user/1/setting'); 
  };

  const navigateToHospitalManagement = () => {
    router.push('/hospitals');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              見守りサービス
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            新しい利用者の登録、アラート設定、すべての情報を一元管理できます。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {/* Register User Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                 onClick={navigateToRegister}>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">利用者登録</h2>
              <p className="text-gray-600 mb-6">
                クライアントID、個人情報、住所、バイタル機器設定など、必要な情報を入力して新しい利用者を登録します。
              </p>
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={navigateToRegister}
              >
                登録開始
              </button>
            </div>
            
            {/* User List Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                 onClick={navigateToUserList}>
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">利用者管理</h2>
              <p className="text-gray-600 mb-6">
                登録されているすべての利用者を一覧表示し、検索やアラート設定の確認ができます。
              </p>
              <button 
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={navigateToUserList}
              >
                一覧表示
              </button>
            </div>

            {/* Alert Settings Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                 onClick={navigateToAlertSettings}>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19l5-5 5 5m-5-5v5m5-10a5 5 0 11-10 0 5 5 0 0110 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">アラート設定</h2>
              <p className="text-gray-600 mb-6">
                利用者の心拍数や表体温のアラート設定を管理できます。メッセージ設定も可能です。
              </p>
              <button 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                onClick={navigateToAlertSettings}
              >
                設定管理
              </button>
            </div>

            {/* Hospital Management Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                 onClick={navigateToHospitalManagement}>
              <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">事業所管理</h2>
              <p className="text-gray-600 mb-6">
                事業所の登録・編集・削除を行い、利用者の所属先を管理できます。
              </p>
              <button 
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                onClick={navigateToHospitalManagement}
              >
                管理画面
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
