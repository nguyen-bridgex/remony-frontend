import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const navigateToRegister = () => {
    router.push('/user/register');
  };

  const navigateToDetail = () => {
    router.push('/user/detail');
  };

  const navigateToSettings = () => {
    router.push('/user/settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Remony
            </span>
            <br />
            ユーザー管理システム
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            美しく直感的なインターフェースでユーザーを管理しましょう。
            新しいユーザーの作成、詳細情報の確認、すべての情報を一元管理できます。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Register User Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                 onClick={navigateToRegister}>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">新規ユーザー登録</h2>
              <p className="text-gray-600 mb-6">
                デバイスID、個人情報、権限設定など、必要な情報を入力して新しいユーザーアカウントを作成します。
              </p>
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={navigateToRegister}
              >
                登録開始
              </button>
            </div>
            
            {/* User Detail Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                 onClick={navigateToDetail}>
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ユーザー詳細情報</h2>
              <p className="text-gray-600 mb-6">
                ユーザーの詳細情報を確認・編集できます。個人情報、身体情報、権限管理が可能です。
              </p>
              <button 
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={navigateToDetail}
              >
                詳細表示
              </button>
            </div>

            {/* User Settings Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                 onClick={navigateToSettings}>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ユーザー設定</h2>
              <p className="text-gray-600 mb-6">
                健康目標、心拍監視、安全アラートなど、Remonyシステムの詳細設定を管理できます。
              </p>
              <button 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                onClick={navigateToSettings}
              >
                設定管理
              </button>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">機能紹介</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">入力検証</h4>
                <p className="text-gray-600 text-sm">すべての入力項目に対してリアルタイムで包括的な検証を実施</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">レスポンシブ対応</h4>
                <p className="text-gray-600 text-sm">モバイルからデスクトップまで、すべてのデバイスで完璧に動作</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">高速パフォーマンス</h4>
                <p className="text-gray-600 text-sm">スムーズなアニメーションとトランジションで最適化された高速処理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
