/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.NODE_ENV === 'production'
      ? 'https://your-production-api-url.com' // Replace with your actual production URL
      : 'http://localhost:8000',
  },
};

export default nextConfig;
