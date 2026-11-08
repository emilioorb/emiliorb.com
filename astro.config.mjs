// @ts-check
import { defineConfig, fontProviders } from "astro/config";
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
const ULTIMA_ACTUALIZACION = new Date("2026-11-02T00:00:00-06:00");

const SITIO = "https://emiliorb.com";

/** Los slugs de cada sección en los dos idiomas, como en `src/i18n/ui.ts`. */
const SECCIONES = [
  { es: "/proyectos/", en: "/en/projects/" },
  { es: "/investigacion/", en: "/en/research/" },
  { es: "/libros/", en: "/en/books/" },
];

/**
 * La misma página en español y en inglés, o `null` si no tiene par.
 * @param {string} ruta
 * @returns {{ es: string; en: string } | null}
 */
function parDeIdiomas(ruta) {
  if (ruta === "/" || ruta === "/en/") return { es: "/", en: "/en/" };
  for (const seccion of SECCIONES) {
    if (ruta.startsWith(seccion.es)) return { es: ruta, en: seccion.en + ruta.slice(seccion.es.length) };
    if (ruta.startsWith(seccion.en)) return { es: seccion.es + ruta.slice(seccion.en.length), en: ruta };
  }
  return null;
}

export default defineConfig({
  site: SITIO,

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

  // Rutas que existieron y pueden estar enlazadas desde afuera. La vista previa
  // de la serie pasó a ser el sitio; «Sobre mí» es hoy el episodio 6.
  redirects: {
    "/nuevo": "/",
    "/nuevo/proyectos/[slug]": "/proyectos/[slug]",
    "/sobre-mi": "/#ep6-titulo",
    "/en/about": "/en/#ep6-titulo",
  },

  // Geist servida desde el paquete, con precarga en el <head> y un respaldo con
  // las métricas ajustadas a ella. Con `swap` el título grande se pintaba en la
  // fuente del sistema y se ensanchaba al llegar Geist; con `optional`, si no
  // llega antes del primer pintado, esa visita se queda con el respaldo y la
  // siguiente ya la tiene en caché: nunca hay cambio a la vista.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-geist",
      fallbacks: ["sans-serif"],
      display: "optional",
      options: {
        variants: [
          {
            src: ["@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"],
            weight: "100 900",
            style: "normal",
          },
        ],
      },
    },
  ],

  integrations: [
    react(),
    // Cada URL lleva sus `xhtml:link` alternos, que le dicen a Google que las
    // dos son la misma página en dos idiomas. El `i18n` del sitemap solo empareja
    // rutas con el mismo slug (/ y /en/); /libros y /en/books no lo tienen.
    sitemap({
      // Sin `lastmod` el sitemap no aporta nada que la propia URL no diga ya.
      serialize: (item) => {
        const pares = parDeIdiomas(new URL(item.url).pathname);
        return {
          ...item,
          lastmod: ULTIMA_ACTUALIZACION.toISOString(),
          links: pares
            ? [
                { lang: "es", url: new URL(pares.es, SITIO).href },
                { lang: "en", url: new URL(pares.en, SITIO).href },
              ]
            : [],
        };
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});