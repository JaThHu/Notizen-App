/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Netlify spezifische Konfiguration
  output: "standalone",
  // ESLint-Konfiguration für Production Builds
  eslint: {
    // Warnungen im Produktions-Build ignorieren
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript-Fehler im Produktions-Build ignorieren
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
