/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:3001/products/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'http://localhost:3001/orders/:path*',
      },
      {
        source: '/api/customers/:path*',
        destination: 'http://localhost:3002/customers/:path*',
      },
    ];
  },
};

module.exports = nextConfig;