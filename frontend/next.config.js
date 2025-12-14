/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  experimental: {
    serverComponentsExternalPackages: []
  },
  env: {
    PORT: '8080'
  }
}

module.exports = nextConfig