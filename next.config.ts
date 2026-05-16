/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Allows larger photos from phones
    },
  },
};

export default nextConfig;
