import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // tambahkan hostname backend kamu
  },
};

export default nextConfig;
