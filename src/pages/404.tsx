import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Custom404 = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          router.push('/');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mx-auto h-32 w-32 text-blue-600 mb-8">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.464-.881-6.08-2.33M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {/* 404 Number */}
          <div className="text-8xl font-bold text-blue-600 mb-4">
            404
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ページが見つかりません
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>

          {/* Auto redirect countdown */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">{countdown}</span> 秒後にホームページに自動的にリダイレクトされます
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              ホームページに戻る
            </button>
            <button
              onClick={handleGoBack}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
            >
              前のページに戻る
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              問題が続く場合は、
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline ml-1">
                サポートチーム
              </a>
              にお問い合わせください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom404; 