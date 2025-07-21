import { useEffect } from 'react';
import { useRouter } from 'next/router';

const UserDetailRedirect = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // ユーザー詳細画面はアラート設定画面に統合されたため、リダイレクト
      router.replace(`/user/${id}/setting`);
    }
  }, [id, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4 text-center">アラート設定画面に移動しています...</p>
      </div>
    </div>
  );
};

export default UserDetailRedirect; 