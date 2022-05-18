/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost','www.kuriyamacory.com'],
  },
  basePath: '/himitukichi',
}

module.exports = nextConfig
