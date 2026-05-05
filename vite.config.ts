import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom domain (beauty.justinalydia.com) serves from root. Override via
// VITE_BASE if you need to deploy under the github.io project subpath
// (e.g. VITE_BASE=/popoyo-beauty/).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/",
  server: { port: 5174, host: true },
});
