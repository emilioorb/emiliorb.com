# emiliorb.com

Portafolio personal de Emilio Rodríguez, fundador y CEO de
[Arclo Systems](https://arclosystems.com). Landing única, bilingüe.

Astro 7 · React 19 · Tailwind v4 · TypeScript

## Arrancar

```sh
npm install
npm run dev        # http://localhost:4321
```

| Comando | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila a `./dist/` |
| `npm run preview` | Previsualiza el build |
| `npx astro check` | Chequeo de tipos |

El servidor de desarrollo también acepta modo segundo plano:
`astro dev --background`, y se maneja con `astro dev stop|status|logs`.

## Estructura

```text
src/
├── pages/
│   ├── index.astro          → /      (español)
│   └── en/index.astro       → /en    (inglés)
├── layouts/Base.astro       head, temas, SEO, JSON-LD
├── components/
│   ├── Pagina.astro         las cuatro secciones
│   ├── Encabezado.astro     cabecera fija
│   ├── Pie.astro            pie con hora local
│   ├── islas/               componentes React hidratados
│   └── *.tsx                componentes de React Bits
├── data/contenido.ts        experiencia, proyectos, estudios, redes
├── i18n/ui.ts               todos los textos, ES y EN
└── styles/global.css        tokens de color, tipografía y espaciado
```

**Todo el texto vive en `i18n/ui.ts` y `data/contenido.ts`.** No hay copy
escrito dentro de los componentes.

## Contexto de diseño

Antes de tocar diseño o copy, leer:

- **[PRODUCT.md](PRODUCT.md)** — a quién le habla, la voz, las
  anti-referencias y los principios.
- **[DESIGN.md](DESIGN.md)** — paleta con contrastes medidos, escala
  tipográfica, espaciado, motion y componentes.

Resumen: monocromo estricto, tipografía [Geist](https://vercel.com/font), un
solo gesto memorable por página, y el movimiento se intuye sin competir.

## Internacionalización

Español en la raíz y inglés bajo `/en`, con `prefixDefaultLocale: false` para
que `emiliorb.com` quede sin prefijo. Cada página lleva su canónica y las tres
alternativas `hreflang` (`es`, `en`, `x-default`).

## Temas

Claro y oscuro, por preferencia del sistema o por el botón. El atributo
`data-tema` se escribe en `<html>` **antes del primer pintado**, con un script
inline sin diferir: si se difiere, la página parpadea en claro antes de pasar
a oscuro.

Los componentes WebGL leen el tema con un `MutationObserver`, porque reciben
los colores como props de JavaScript y no por CSS.

## Accesibilidad

- Contraste AA (`tinta` a 19.67:1, `tinta-suave` a 5.30:1 en tema claro).
- `prefers-reduced-motion` respetado en todo. Los componentes de terceros que
  no lo miran van envueltos en una isla que resuelve el caso.
- Foco visible de autor, no el del navegador.
- Toda decoración con `aria-hidden`.

## React Bits

Los componentes de `@reactbits-pro` se instalan planos en `src/components/` y
las islas que los envuelven viven en `src/components/islas/`. **Son archivos
propios y están editados**: se les corrigió el espaciado entre palabras, los
imports de tipo, el `aria-hidden` de los glifos duplicados y el punto de fuga
del volteo. No sobrescribirlos reinstalando desde el registry sin revisar el
[CHANGELOG](CHANGELOG.md).

El registry se sirve por el MCP de `shadcn`; la licencia va en `.env.local`
como `REACTBITS_LICENSE_KEY`.

## Antes de publicar

- [ ] `public/og.png` de 1200×630 (las etiquetas sociales ya apuntan ahí)
- [ ] Favicon definitivo
- [ ] Repositorio git propio: hoy la carpeta no lo es

## Licencia

Todos los derechos reservados. Ver [LICENSE](./LICENSE).
