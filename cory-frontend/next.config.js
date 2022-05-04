/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost","static-cdn.jtvnw.net", "https://d3aqoihi2n8ty8.cloudfront.net"],
  },
}

module.exports = nextConfig
