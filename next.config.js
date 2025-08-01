/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/updateSettings/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/update-settings/:path*`,
      },
      {
        source: '/api/getSettings/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/get-settings/:path*`,
      },
      {
        source: '/api/getUsers/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/get-userlist/:path*`,
      },
      {
        source: '/api/getUserinfo/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/get-userinfo/:path*`,
      },
      {
        source: '/api/registUser/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/regist-user/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
