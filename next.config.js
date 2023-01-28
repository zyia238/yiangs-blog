/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  }
  ,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.akamai.steamstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
