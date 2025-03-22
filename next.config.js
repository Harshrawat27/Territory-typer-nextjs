// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Set to false for better socket.io performance
  swcMinify: true,
  // Properly configure the server for websockets
  webpack: (config) => {
    return config;
  },
  // Needed for socket.io to work properly
  async headers() {
    return [
      {
        source: '/api/socket/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  // Configure what to include in the server vs client
  experimental: {
    serverComponentsExternalPackages: ['socket.io'],
  },
};

module.exports = nextConfig;
