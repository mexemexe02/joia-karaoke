/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // For Docker/Coolify deployment
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
}

module.exports = nextConfig


