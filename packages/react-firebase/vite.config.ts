import react from "@vitejs/plugin-react-swc";
import { preserveDirective } from "rollup-preserve-directives";
import { type Plugin, defineConfig } from "vite";
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
        remoteConfig: "./src/remote-config.ts",
        storage: "./src/storage.ts",
        vertextAI: "./src/vertex-ai.ts",
        // client side (nextjs)
        nextjsIndex: "./src/nextjs.ts",
        nextjsAnalytics: "./src/analytics-next.ts",
        nextjsApp: "./src/Context-next.tsx",
        nextjsAppCheck: "./src/app-check-next.ts",
        nextjsAuth: "./src/auth-next.ts",
        nextjsDatabase: "./src/database-next.ts",
        nextjsFunctions: "./src/functions-next.ts",
        nextjsFirestore: "./src/firestore-next.ts",
        nextjsInstallations: "./src/installations-next.ts",
        nextjsMessaging: "./src/messaging-next.ts",
        nextjsRemoteConfig: "./src/remote-config-next.ts",
        nextjsPerformance: "./src/performance-next.ts",
        nextjsStorage: "./src/storage-next.ts",
        nextjsVertexAI: "./src/vertex-ai-next.ts",
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
  plugins: [preserveDirective() as Plugin, react(), dts(), externalizeDeps()],
});
