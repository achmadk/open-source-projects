import { resolve } from "node:path";

import esbuildPluginTsc from "esbuild-plugin-tsc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import tsconfig from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src", "index.ts"),
      name: "inversify",
      fileName: "index",
    },
    sourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildPluginTsc()],
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
      },
    },
  },
  plugins: [
    dts({ rollupTypes: true }),
    tsconfig({ ignoreConfigErrors: true }),
    externalizeDeps(),
  ],
});
