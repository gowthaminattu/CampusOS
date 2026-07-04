// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to FastAPI backend (avoids CORS issues in dev)
    proxy: {
      "/auth": "http://localhost:8000",
      "/hostel": "http://localhost:8000",
      "/lab": "http://localhost:8000",
      "/orchestrator": "http://localhost:8000",
    },
  },
});
