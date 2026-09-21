const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // chartist 0.11's UMD wrapper breaks under webpack's AMD branch; use its CommonJS branch instead
    config.module.rules.unshift({
      include: path.resolve(__dirname, 'node_modules/chartist'),
      parser: { amd: false },
    });
    return config;
  },
};

module.exports = nextConfig;
