/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Netlify spezifische Konfiguration
  output: "standalone",
};

module.exports = nextConfig;
