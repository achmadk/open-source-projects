import react from "@vitejs/plugin-react-swc";
import { preserveDirective } from "rollup-preserve-directives";
import { type Plugin, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        // client side
        index: "./src/index.tsx",
      },
      name: "ReactAppwrite",
      fileName: (format, entryName) => {
        console.log(format);
        return `${entryName}.${format === "umd" ? "cjs" : "js"}`;
      },
    },
  },
  plugins: [
    preserveDirective() as Plugin,
    react(),
    dts(),
    tsconfigPaths(),
    externalizeDeps(),
  ],
});
