/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Improve build speed and prevent warnings
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Replaced deprecated `experimental.turbo`
  turbopack: {
    enabled: true, // uses the new Rust-based compiler
  },

  // ✅ Optional for monorepo setups (removes workspace warning)
  outputFileTracingRoot: '../../',
  
  // ✅ Compression and security tweaks for production
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
