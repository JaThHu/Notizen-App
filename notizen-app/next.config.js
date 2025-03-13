/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // ESLint-Konfiguration für Production Builds
  eslint: {
    // Warnungen im Produktions-Build ignorieren
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript-Fehler im Produktions-Build ignorieren
    ignoreBuildErrors: true,
  },
  // Build-Output-Konfiguration
  distDir: ".next",
  // Netlify-spezifische Konfiguration
  trailingSlash: true,
  // Aktiviere statische Exports für Netlify
  output: "export",
  // Deaktiviere Serverless Functions für statischen Export
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
