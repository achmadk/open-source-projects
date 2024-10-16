import { resolve } from "node:path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import tsconfig from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import esbuildPluginTsc from "esbuild-plugin-tsc";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src", "index.tsx"),
      name: "inversifyHooks",
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
    react({ tsDecorators: true }),
    dts({ rollupTypes: true }),
    tsconfig({ ignoreConfigErrors: true }),
    externalizeDeps(),
  ],
});
