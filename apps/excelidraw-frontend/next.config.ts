/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true }, // optional for speed
  experimental: {
    turbo: true, // ✅ use Rust compiler for fast rebuilds
  },
  typescript: {
    ignoreBuildErrors: true, // optional if type-check slows reloads
  },
};

export default nextConfig;
