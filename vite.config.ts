import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: Object.fromEntries(
      [
        ["appointments", 8081],
        ["clients", 8082],
        ["stylists", 8082],
        ["notifications", 8083],
        ["services", 8084],
        ["rates", 8084],
        ["analytics", 8085],
        ["audit", 8086],
        ["admin/kafka", 8087],
        ["admin", 8081],
      ].map(([path, port]) => [
        `/api/v1/${path}`,
        { target: `http://127.0.0.1:${port}`, changeOrigin: true },
      ]),
    ),
  },
  plugins: [basicSsl(), react(), babel({ presets: [reactCompilerPreset()] })],
});
