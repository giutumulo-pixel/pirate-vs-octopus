import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Disable filesystem cache in development to avoid ENOENT cache issues
    // and stale vendor chunk references during heavy refactors
    // Next sets a complex cache by default; turning it off improves reliability here
    // (only affects dev builds)
    if (process.env.NODE_ENV !== 'production') {
      config.cache = false;
    }
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // Alias RN async storage to a web stub to silence MetaMask SDK requirement on web
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@react-native-async-storage/async-storage": require("path").resolve(__dirname, "stubs/asyncStorageWeb.ts"),
    };
    return config;
  },
};

export default nextConfig;
