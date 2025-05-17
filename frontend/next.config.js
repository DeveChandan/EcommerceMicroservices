/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/products/:path*",
        destination: "http://localhost:8000/products/:path*"
      },
      {
        source: "/api/orders/:path*",
        destination: "http://localhost:8000/orders/:path*"
      },
      {
        source: "/api/customers/:path*",
        destination: "http://localhost:8001/customers/:path*"
      }
    ];
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
  },
};

module.exports = nextConfig;
