import {
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
} from "vitest/config";
import viteConfig from "./vite.config";

import "dotenv/config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    define: {
      firebaseConfig: JSON.stringify(process.env.FIREBASE_CONFIG),
      recaptchaSiteKey: `"${process.env.RECAPTCHA_SITE_KEY}"`,
    },
    test: {
      setupFiles: ["fake-indexeddb/auto"],
      coverage: {
        include: ["src"],
        exclude: [
          ...coverageConfigDefaults.exclude,
          "src/main.tsx",
          "src/data-connect.ts",
          "src/messaging.ts",
          "src/server.ts",
          "src/nextjs.ts",
          "src/**/index.ts",
          "src/types/*.ts",
          "src/**/*-server.ts",
          "src/**/*-next.ts",
          "src/**/*-next.tsx",
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
