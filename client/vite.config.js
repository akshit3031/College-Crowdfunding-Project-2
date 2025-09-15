import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  build: {
    target: ["esnext"], // ✅ allow BigInt in build
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext", // ✅ allow BigInt in dev mode too
    },
  },
});
