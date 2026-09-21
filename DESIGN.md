# Design

Sistema visual real, extraído del código (`src/styles/global.css` y los componentes). Los ratios de contraste están calculados, no estimados.

## Theme

Doble tema de primera clase: claro por defecto, oscuro por preferencia del sistema o por el botón. El atributo `data-tema` se escribe en `<html>` **antes del primer pintado**, con un script inline sin diferir, porque si no la página parpadea en claro antes de pasar a oscuro.

Ninguna pieza puede depender de un solo tema. Los componentes WebGL leen el tema a mano con un `MutationObserver` sobre `data-tema`, porque reciben colores como props de JavaScript y no por CSS.

## Color

Monocromo estricto. Sin acento, sin color de marca, sin gradientes. La jerarquía la cargan entera el contraste y el peso tipográfico.

Los tokens viven como variables CSS en `:root` y se exponen a Tailwind v4 por `@theme`.

| Token | Claro | Oscuro | Rol |
|---|---|---|---|
| `--fondo` | `#ffffff` | `#0b0b0c` | Fondo de página |
| `--tinta` | `#0b0b0c` | `#f4f4f5` | Texto principal, botón sólido |
| `--tinta-suave` | `#6b6b70` | `#8d8d94` | Texto secundario, etiquetas, fechas |
| `--borde` | `#e6e6e8` | `#232326` | Divisorias, subrayados, decoración fantasma |

Contraste medido contra el fondo de cada tema:

| Par | Claro | Oscuro | Nivel |
|---|---|---|---|
| `tinta` | 19.67:1 | 17.90:1 | AA + AAA |
| `tinta-suave` | 5.30:1 | 5.97:1 | AA (no llega a AAA) |
| `borde` | 1.25:1 | 1.26:1 | No aplica: nunca lleva texto |

`--borde` es deliberadamente invisible: es el nivel "fantasma", para divisorias y para decoración que se intuye sin competir. **Nunca se usa para texto legible.**

Nota de deuda: el sistema usa `#ffffff` y `#0b0b0c` puros. La práctica preferida sería tintarlos levemente hacia un matiz y trabajar en OKLCH. Es una decisión heredada, no un descuido; cambiarla toca todo el sitio.

## Typography

**Geist Variable** (`@fontsource-variable/geist`), servida desde el proyecto, no desde Google: sin petición a terceros y sin salto de tipografía al cargar. Rango 100–900.

La familia es una neo-grotesca casi idéntica en métricas a Inter, que es lo que reemplazó. **La diferencia se consigue usando el rango de pesos, no las formas.**

| Nivel | Tamaño | Peso | Tracking | Color |
|---|---|---|---|---|
| `h1` | `clamp(2.25rem, 7vw, 4.5rem)` | 500 | `-0.03em` | `tinta`, con el planteo en `tinta-suave` |
| Etiqueta de sección | `text-xs` | 500 | `0.12em`, versales | `tinta-suave` |
| Bajada | `text-lg`, `leading-relaxed` | 400 | — | `tinta-suave` |
| Prueba dentro de la bajada | `text-lg` | **500** | — | `tinta` |
| Cuerpo | `text-sm`, `leading-relaxed` | 400 | — | `tinta-suave` |
| Fechas y stack | `text-sm` / `text-xs`, `tabular-nums` | 400 | — | `tinta-suave` |

Regla aprendida de las referencias propias (`arclosystems.com`, `holakodi.com`): **ambas usan un solo peso (500) en el `h1` y contrastan por color.** El contraste de peso vive fuera del titular: etiquetas, pruebas de la bajada, botones.

Ancho de línea de cuerpo acotado a `max-w-xl`.

## Layout

- Contenedor de sección: `mx-auto max-w-3xl px-6 py-20 sm:py-28`
- Cabecera fija: `--alto-cabecera: 80px`
- Anclas: `scroll-margin-top: 6rem` en todo `[id]`, porque si no aterrizan debajo de la cabecera fija
- Padding de sección disponible como `--pad-seccion: clamp(20px, 3vw, 40px)`

Las piezas a sangre completa (la cinta de texto ondulada) van **fuera** del contenedor, directo en el slot del layout.

Listas separadas por divisorias de 1px (`divide-y divide-borde`, `border-y border-borde`), no por tarjetas. No hay tarjetas en el sistema, y es a propósito.

## Motion

Una sola curva de salida para toda la página:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
```

- Estado de presión en cualquier pulsable: `scale(0.97)` en `:active`, 140 ms
- Transiciones de color en enlaces: 200 ms
- Scroll suave con Lenis
- Decoración animada (fondo, cinta) a `client:idle` o `client:visible`: se intuye, no compite

**`prefers-reduced-motion` se respeta en todo.** Los componentes de terceros que no lo miran se envuelven en una isla que resuelve el caso: la decoración no se monta, el contenido se pinta estático.

## Components

| Pieza | Nota |
|---|---|
| Fondo (`glitter-warp`) | Campo de estrellas WebGL a pantalla completa, `-z-10`. Color por tema. No es aditivo, así que funciona sobre blanco y sobre negro. |
| Cinta de texto (`text-path`) | Banda ondulada a sangre entre secciones, en `--borde`. El `viewBox` se deriva de la caja medida: si no coincide la proporción, el SVG encaja y centra, y deja aire a los lados. |
| Titular (`3d-letter-swap`) | Volteo por letra. Respeta `reduced-motion` de fábrica. |
| Bajada (`blur-highlight`) | Resalta las pruebas. **No** respeta `reduced-motion`: lleva guard propio. |
| Enlace | `underline decoration-borde underline-offset-4`, a `decoration-tinta` en hover |
| Botón sólido | `rounded-full bg-tinta px-5 py-2.5 text-sm font-medium text-fondo` |

Los componentes de React Bits se instalan planos en `src/components/` y las islas que los envuelven viven en `src/components/islas/`. Son archivos propios: se editan cuando hace falta (ya se corrigieron el espaciado entre palabras de `3d-letter-swap` y los imports de tipos de ambos).

## Accessibility

- Foco de autor, no el del navegador: `outline: 2px solid var(--tinta)`, `outline-offset: 3px`. El del navegador cambia de color con el tema y a veces no se ve.
- Toda decoración lleva `aria-hidden="true"`.
- La semántica no se negocia por animar: un `h1` sigue siendo `h1` aunque un componente lo anime.
- Contraste objetivo AA. AAA no se persigue: exigiría cambiar `tinta-suave`.
