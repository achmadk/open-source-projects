import {
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
} from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        include: ["src"],
        exclude: [...coverageConfigDefaults.exclude],
        thresholds: {
          functions: 90,
          branches: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  }),
);
