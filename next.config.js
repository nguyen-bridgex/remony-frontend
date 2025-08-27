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
        source: '/api/updateUserinfo/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/update-userinfo/:path*`,
      },
      {
        source: '/api/getHospitalList/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/get-hospital-list/:path*`,
      },
      {
        source: '/api/addUserToHospital/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/hospital/add-user/:path*`,
      },
      {
        source: '/api/addHospital/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/hospital/new/:path*`,
      },
      {
        source: '/api/editHospital/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/hospital/edit/:path*`,
      },
      {
        source: '/api/removeHospital/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/hospital/remove/:path*`,
      },
      {
        source: '/api/removeUserFromHospital/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/hospital/remove-user/:path*`,
      },
      {
        source: '/api/registUser/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/regist-user/:path*`,
      },
      {
        source: '/api/deleteUser/:path*',
        destination: `${process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000'}/delete-user/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
