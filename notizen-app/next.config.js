/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Netlify spezifische Konfiguration
  target: "serverless",
};

module.exports = nextConfig;
