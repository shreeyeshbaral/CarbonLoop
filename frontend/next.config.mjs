/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double rendering in dev mode for faster speed
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'leaflet', 'react-leaflet'],
  },
};

export default nextConfig;
