// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

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
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});