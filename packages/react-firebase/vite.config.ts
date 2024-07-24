import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        // client side
        index: "./src/index.ts",
        analytics: "./src/analytics.ts",
        app: "./src/app.ts",
        appCheck: "./src/app-check.ts",
        auth: "./src/auth.ts",
        database: "./src/database.ts",
        functions: "./src/functions.ts",
        firestore: "./src/firestore.ts",
        installations: "./src/installations.ts",
        messaging: "./src/messaging.ts",
        performance: "./src/performance.ts",
        vertextAI: "./src/vertex-ai.ts",
        // server side
        serverIndex: "./src/server.ts",
        serverAnalytics: "./src/analytics-server.ts",
        serverApp: "./src/app-server.ts",
        serverAppCheck: "./src/app-check-server.ts",
        serverAuth: "./src/auth-server.ts",
        serverDatabase: "./src/database-server.ts",
        serverFunctions: "./src/functions-server.ts",
        serverFirestore: "./src/firestore-server.ts",
        serverInstallations: "./src/installations-server.ts",
        serverMessaging: "./src/messaging-server.ts",
        serverPerformance: "./src/performance-server.ts",
        serverVertexAI: "./src/vertex-ai-server.ts",
      },
      name: "ReactFirebase",
      fileName: (format, entryName) =>
        `${entryName}.${format === "cjs" ? "cjs" : "js"}`,
    },
  },
  plugins: [react(), dts(), externalizeDeps()],
});
