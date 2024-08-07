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
        exclude: [
          ...coverageConfigDefaults.exclude,
          "src/index.ts",
          "src/nextjs.ts",
          "src/types.ts",
        ],
        thresholds: {
          functions: 90,
          branches: 85,
          lines: 90,
          statements: 90,
        },
      },
    },
  }),
);
