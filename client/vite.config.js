
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import stdLibBrowser from "vite-plugin-node-stdlib-browser"

export default defineConfig({
  plugins: [react(), stdLibBrowser()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  resolve: {
    alias: {
      process: "process/browser",
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext", // ✅ allow BigInt in dev
    },
  },
  build: {
    target: "esnext", // ✅ allow BigInt in build
  },
})
