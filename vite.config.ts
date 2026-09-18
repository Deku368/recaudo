import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" hace que los assets carguen con rutas relativas.
// Es lo que permite desplegar en GitHub Pages bajo /Recaudo/ sin romper nada.
// Combinado con HashRouter, las URLs de cada productor (para el futuro QR)
// funcionan al escanearse directo, sin el error 404-al-refrescar de GH Pages.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
