# Design

Sistema visual real, extraído del código (`src/styles/global.css`, `src/components/episodios/episodios.css` y los componentes). Los ratios de contraste están calculados, no estimados.

## Theme

Doble tema de primera clase, **siguiendo al sistema**: claro u oscuro según `prefers-color-scheme`, y cambia en vivo si el sistema cambia. No hay botón de tema: en la serie cada escena ya decide su tono (claro o invertido), y una elección guardada no tendría cómo deshacerse. El atributo `data-tema` se escribe en `<html>` **antes del primer pintado**, con un script inline sin diferir, porque si no la página parpadea en claro antes de pasar a oscuro.

Ninguna pieza puede depender de un solo tema.

## Color

Monocromo estricto. Sin acento, sin color de marca, sin gradientes. La jerarquía la cargan entera el contraste y el peso tipográfico.

Los tokens viven como variables CSS en `:root` y se exponen a Tailwind v4 por `@theme`.

| Token | Claro | Oscuro | Rol |
|---|---|---|---|
| `--fondo` | `#ffffff` | `#0b0b0c` | Fondo de página |
| `--tinta` | `#0b0b0c` | `#f4f4f5` | Texto principal, fondo de las tarjetas invertidas |
| `--tinta-suave` | `#6b6b70` | `#8d8d94` | Texto secundario, etiquetas, fechas |
| `--borde` | `#e6e6e8` | `#232326` | Divisorias, subrayados, decoración fantasma |
| `--tinta-suave-inv` | `#8d8d94` | `#6b6b70` | Texto secundario sobre una tarjeta invertida: el `tinta-suave` del otro tema |

Contraste medido contra el fondo de cada tema:

| Par | Claro | Oscuro | Nivel |
|---|---|---|---|
| `tinta` | 19.67:1 | 17.90:1 | AA + AAA |
| `tinta-suave` | 5.30:1 | 5.97:1 | AA (no llega a AAA) |
| `tinta-suave-inv` sobre `tinta` | 5.97:1 | 4.85:1 | AA |
| `borde` | 1.25:1 | 1.26:1 | No aplica: nunca lleva texto |

`--borde` es deliberadamente invisible: es el nivel "fantasma", para divisorias y para decoración que se intuye sin competir. **Nunca se usa para texto legible.**

**Monocromo sin excepciones:** no hay ningún color de acento en el sitio.

Nota de deuda: el sistema usa `#ffffff` y `#0b0b0c` puros. La práctica preferida sería tintarlos levemente hacia un matiz y trabajar en OKLCH. Es una decisión heredada, no un descuido; cambiarla toca todo el sitio.

## Typography

**Geist Variable** (`@fontsource-variable/geist`), servida desde el proyecto, no desde Google: sin petición a terceros y sin salto de tipografía al cargar. Rango 100–900.

**La diferencia se consigue usando el rango de pesos, no las formas.** En la serie, los tamaños se acotan por ancho y por alto (`min(vw, svh, rem)`): así una escena entra entera en una ventana baja (1366 × 650) sin cortarse.

| Nivel | Tamaño | Peso | Tracking | Color |
|---|---|---|---|---|
| Nombre en la apertura | `min(19vw, 19svh, 11.5rem)` | 500 | `-0.045em` | `tinta`, el apellido en `tinta-suave` |
| Tarjeta de título | `min(19vw, 22svh, 13.5rem)`; larga, `min(11vw, 13svh, 8rem)` | 600 | `-0.05em` | `fondo` sobre `tinta` |
| Paso de una etapa | `min(8.6vw, 7.6svh, 5rem)`; el remate en 600 | 500 | `-0.035em` | `tinta`; los anteriores al 50 % |
| Título en la pasarela | `min(8.5vw, 9.5svh, 6rem)` | 600 | `-0.04em` | `tinta` |
| Rótulo (episodio, sección) | `0.75rem`, versales | 500 | `0.14em` | `tinta-suave` |
| Subtítulo del narrador | `clamp(0.98rem, …, 1.2rem)` | 450 | — | `tinta` o `fondo`, según el tono de la escena |
| Cuerpo en páginas de lectura | `text-sm`, `leading-relaxed` | 400 | — | `tinta-suave` |

Ancho de línea de cuerpo acotado a `max-w-xl`; en escenas, entre 24ch y 46ch según la pieza.

## Layout

- **El escenario.** Cada escena es una `section` de `largo` svh con un lienzo `position: sticky` de 100svh. La siguiente se monta encima con un solape de 100svh, así una se suelta en el mismo instante en que la otra la tapa: el corte seco. Solo existe con movimiento (`html[data-episodios="escenario"]`, puesto antes del primer pintado); sin él, las escenas van una debajo de otra.
- **Zonas reservadas.** Arriba, la cabecera (`--alto-cabecera: 80px`); abajo, el subtítulo (`--zona-subtitulos`, 11rem debajo de 1024px). Ninguna escena pone contenido ahí.
- **Anclas.** `scroll-margin-top: 6rem` en todo `[id]` por la cabecera fija; las escenas usan `-2px` para aterrizar ya pasado el corte. Las anclas de la portada anterior (`#work`, `#projects`, `#contact`…) caen en la escena equivalente.
- Padding de sección: `--pad-seccion: clamp(24px, 3vw, 40px)`.
- Sin barra de desplazamiento en las páginas de la serie (`html[data-sin-barra]`): se marca antes del primer pintado, así el ancho no cambia.

Listas separadas por divisorias de 1px, no por tarjetas. No hay tarjetas en el sistema, y es a propósito.

## Motion

Una sola curva de salida para todo el sitio, también en GSAP (`CustomEase` «salida»):

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
```

- **Cortes secos.** La escena aparece entera de golpe. Lo único que se mueve son las líneas de velocidad (~0,45 s, en la dirección del scroll) y un golpe de cámara leve en el titular (escala 1,035 → 1).
- **Scrub.** Lo que pasa dentro de una escena fijada va atado al scroll: los pasos entran uno por tiempo y el anterior baja al 50 %. Con Lenis el scrub va directo; sin él (táctil), 0,4 s de suavizado.
- **Teclado por momentos.** ↑/↓ y Re Pág/Av Pág pasan un momento por pulsación: una línea, un paso o una escena. Dejar la tecla apretada no encadena saltos. No hay avance automático.
- **Subtítulos.** Se escriben letra por letra (26 ms por letra); todas las letras ocupan su lugar desde el inicio, así el renglón no salta. El espacio va fuera del `span` de cada palabra.
- **Grano de película**, quieto, al 9 %: textura, no movimiento (`--grano`).
- Estado de presión en cualquier pulsable: `scale(0.97)` en `:active`, 140 ms.

**`prefers-reduced-motion` se respeta en todo.** Sin escenario, sin pin ni scrub, sin líneas de velocidad: las escenas se leen en orden y el subtítulo lleva placa, porque el contenido pasa por debajo.

## Sound

El sitio no suena: sin música, sin voz y sin efectos. El narrador vive solo en los subtítulos.

## Components

| Pieza | Nota |
|---|---|
| Tarjeta de título | Invertida (tinta de fondo): «Episodio N» o «Proyecto 04 / 07», el título enorme en dos renglones y un pie con empresa, período y cargo. |
| Etapa | Una idea por escena: contexto arriba y pasos que entran uno por tiempo; el último es el remate. |
| Pasarela | Varias cosas, una a la vez, apiladas en la misma celda; las que no se ven no reciben clics. Proyectos, investigación y prensa, y «Qué hice» en las fichas. |
| Síntesis, balance y salida | Las escenas de una ficha: el resumen o el problema en grande; los resultados y el stack; el siguiente proyecto y la vuelta a la serie. |
| Cabecera de la serie | Nombre, rótulo del episodio en curso, otro idioma y Contacto. Siempre a la vista; sigue el tono de la escena y solo el modo cine la apaga. En las páginas de lectura lleva fondo. |
| Narrador y subtítulos | Una línea por momento, en tercera persona. Lo visible va oculto al lector de pantalla; el anuncio va aparte, una sola vez por línea. |
| Modo cine | Pantalla completa; la interfaz se apaga mientras el visitante no mueve el mouse. Esc o «Salir» lo cierran. |
| Enlace | Subrayado en `currentColor` al 35 %, pleno en hover; la flecha (→ o ↗) queda fuera del subrayado. Alto táctil de 44px. |

## Accessibility

- Foco de autor, no el del navegador: `outline: 2px solid var(--tinta)`, `outline-offset: 3px`.
- Si el foco de teclado cae en una escena o un tiempo que no está en pantalla, el scroll lo va a buscar.
- Toda decoración lleva `aria-hidden="true"`.
- La semántica no se negocia por animar: un `h1` sigue siendo `h1` aunque un componente lo anime.
- Contraste objetivo AA. AAA no se persigue: exigiría cambiar `tinta-suave`.
