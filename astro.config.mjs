// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

/**
 * Cuándo cambió por última vez el contenido del portafolio, en hora de Costa Rica.
 *
 * Va declarada y NO `new Date()`: con la fecha del build las dos URLs dirían
 * "hoy" en cada despliegue aunque no se haya tocado una coma, y una señal que
 * siempre dice lo mismo es una señal que Google deja de mirar. Al editar el
 * contenido de verdad, mover esta fecha.
 */
const ULTIMA_ACTUALIZACION = new Date("2026-09-20T00:00:00-06:00");

export default defineConfig({
  site: "https://emiliorb.com",

  // Español en la raíz, inglés bajo /en. `prefixDefaultLocale: false` deja
  // emiliorb.com sin prefijo, que es la URL que la gente ya conoce.
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    react(),
    // Con `i18n` el sitemap emite los `xhtml:link` alternos de cada URL, que es
    // lo que le dice a Google que / y /en son la misma página en dos idiomas.
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es", en: "en" },
      },
      // Sin `lastmod` el sitemap no aporta nada que la propia URL no diga ya.
      serialize: (item) => ({ ...item, lastmod: ULTIMA_ACTUALIZACION.toISOString() }),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});