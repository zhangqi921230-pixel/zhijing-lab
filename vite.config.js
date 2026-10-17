import { communityPlugin } from "./server/community.mjs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const addons = [
  "three/addons/controls/OrbitControls.js",
  "three/addons/environments/RoomEnvironment.js",
  "three/addons/geometries/RoundedBoxGeometry.js",
  "three/addons/utils/BufferGeometryUtils.js",
];
export default defineConfig({
  base: "./",
  plugins: [react(), communityPlugin()],
  server: {
    fs: {
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
        "**/data/**",
        "**/*.sqlite*",
      ],
    },
  },
  optimizeDeps: { include: ["react", "react-dom/client", "three", ...addons] },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          "three-addons": addons,
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
