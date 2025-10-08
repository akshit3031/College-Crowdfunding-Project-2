import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  build: {
    target: ["esnext"], // ✅ allow BigInt in build
    rollupOptions: {
      external: [
        "@safe-globalThis/safe-ethers-adapters",
        "@safe-globalThis/safe-core-sdk", 
        "@safe-globalThis/safe-service-client",
        "@safe-globalThis/safe-ethers-lib"
      ]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext", // ✅ allow BigInt in dev mode too
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
    include: [
      "@thirdweb-dev/react",
      "@thirdweb-dev/sdk", 
      "ethers"
    ]
  },
  resolve: {
    alias: {
      // Handle Node.js modules in browser
      stream: "stream-browserify",
      util: "util"
    }
  }
});
