import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Используем абсолютные пути от корня домена
  server: {
    allowedHosts: true, // Разрешаем все хосты, чтобы работать через Ngrok
  },
});
