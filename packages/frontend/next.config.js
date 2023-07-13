/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Check: https://github.com/rainbow-me/rainbowkit/issues/1260#issuecomment-1556089782
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false, encoding: false };
    return config;
  },
};

module.exports = nextConfig;
