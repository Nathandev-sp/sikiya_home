/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Allow all HTTPS URLs (for S3, CDN, etc.)
      {
        protocol: 'https',
        hostname: '**',
      },
      // Allow HTTP URLs (for development)
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Allow unoptimized images for external URLs
    unoptimized: false,
  },
}

module.exports = nextConfig
