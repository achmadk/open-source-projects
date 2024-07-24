import {
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
} from "vitest/config";
import viteConfig from "./vite.config";

import "dotenv/config";

console.log(process.env.RECAPTCHA_SITE_KEY);

export default mergeConfig(
  viteConfig,
  defineConfig({
    define: {
      firebaseConfig: process.env.FIREBASE_CONFIG,
      recaptchaSiteKey: `"${process.env.RECAPTCHA_SITE_KEY}"`,
    },
    test: {
      setupFiles: ["fake-indexeddb/auto"],
      coverage: {
        include: ["src"],
        exclude: [
          ...coverageConfigDefaults.exclude,
          "src/main.tsx",
          "src/server.ts",
          "src/**/index.ts",
          "src/**/*-server.ts",
          "src/ServerContext.tsx",
          "src/UnitTestProvider.tsx",
        ],
        thresholds: {
          functions: 85,
          branches: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  }),
);
