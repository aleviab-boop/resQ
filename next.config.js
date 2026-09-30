/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'myjiostatic.cdn.jio.com' },
      { protocol: 'https', hostname: 'cdn.pixelbin.io' },
      { protocol: 'https', hostname: 'www.resqservices.in' },
    ],
  },
}

module.exports = nextConfig
