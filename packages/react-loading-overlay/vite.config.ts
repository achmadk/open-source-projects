import { resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";
import { preserveDirective } from "rollup-preserve-directives";
import { type Plugin, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import tsconfig from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src", "index.ts"),
        nextjs: resolve(__dirname, "src", "nextjs.ts"),
      },
      name: "reactLoadingOverlay",
      fileName: (format, entryName) =>
        `${entryName}.${format === "cjs" ? "cjs" : "js"}`,
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
  plugins: [
    preserveDirective() as Plugin,
    react(),
    dts({ rollupTypes: true }),
    tsconfig(),
    externalizeDeps(),
  ],
});
