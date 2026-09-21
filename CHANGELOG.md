# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado según [SemVer](https://semver.org/lang/es/).

## [0.1.0] — 2026-09-20

Primera versión completa de la landing. Antes existía la estructura; esta
versión cierra copy, diseño, tipografía y SEO.

### Añadido

- **Contexto de diseño del proyecto**: `PRODUCT.md` (register `brand`, los
  cuatro públicos, principios y anti-referencias) y `DESIGN.md` (tokens,
  contrastes medidos, tipografía, motion y componentes).
- **Fondo de campo de estrellas** (`glitter-warp`), con color por tema y
  respeto de `prefers-reduced-motion`. Reemplaza a `pixel-rain`.
- **Cinta de texto ondulada a sangre completa** (`text-path`) entre el hero y
  Experiencia. El `viewBox` se deriva de la caja medida, así que no deja aire
  a los lados en ningún ancho.
- **Volteo 3D por letra en el titular** (`3d-letter-swap`).
- **Resalte de las pruebas en la bajada** (`blur-highlight`), sin fondo: solo
  peso y tinta.
- **Sección de contacto con tres puertas por intención**: correo como acción
  principal, LinkedIn y GitHub como enlaces. Incluye expectativa de respuesta.
- **X** (`@_emiliojrb`) sumado a las redes.
- **MiBrete** como proyecto en desarrollo.
- **SEO**: sitemap con alternos `xhtml:link` por idioma, `robots.txt`,
  Open Graph completo, Twitter Card y JSON-LD `Person` con `sameAs`.

### Cambiado

- **Tipografía de Inter a Geist** (`@fontsource-variable/geist`), servida
  desde el proyecto.
- **Copy del hero reescrito**: el titular pasó a dos líneas con contraste por
  color, y la bajada de 61 a 38 palabras, con la trayectoria completa en vez
  de solo los productos propios.
- **Encabezados de sección** de etiqueta de 12px en gris a encabezados reales
  de 28px en tinta. El antetítulo del hero conserva el tratamiento de etiqueta.
- **Ritmo vertical**: espaciado fluido con `clamp()` y asimétrico, para que el
  vacío pertenezca a la sección que empieza. El intervalo que agrupa (48px)
  ahora supera al interno (40px), que estaba invertido.
- **Columna de `max-w-3xl` a `max-w-4xl`**, con la prosa acotada aparte para
  que no se estire.
- **Datos de experiencia corregidos**: los clientes de GSIT no eran solo
  "banca y retail" sino banca, comercio, turismo e industria en tres países;
  Novelteak suma la app offline-first de trabajo de campo, los dos países y
  `Ionic` en el stack; Acaya describe el sistema de facturación real y suma
  "+1500 viajes gestionados".
- **Atribución honesta por puesto**: lo hecho en equipo dice "con el equipo".
- **Títulos y descripciones** diferenciados por idioma y aprovechando el
  espacio del SERP (53/50 y 141/131 caracteres, antes 27 idénticos y 89/76).

### Corregido

- **`text-path` dejaba aire a los lados** en pantallas anchas: el `viewBox`
  por defecto se encaja centrado (`xMidYMid meet`), y con una caja más
  apaisada sobraban 240px por lado a 1920px.
- **`3d-letter-swap` separaba las palabras**: pintaba cada espacio como un
  bloque de `1ch`, que en Geist mide 68px contra los 23.6px del espacio real.
- **`3d-letter-swap` no ocultaba al lector de pantalla** las caras duplicadas
  de cada letra, así que el titular se leía dos veces, la segunda deletreada.
- **El titular se descuadraba al girar**: el `perspective` estaba en la línea
  entera, así que el punto de fuga caía en su centro. Movido a la
  transformación de cada letra.
- **La cinta reservaba 224px en blanco** hasta que el lector bajaba hasta
  ella, por hidratar con `client:visible` estando casi en el pliegue.
- **El texto accesible del `h1` salía pegado** ("softwareque"): los dos
  renglones son bloques y el lector los concatenaba sin espacio.
- **Desalineación de 4px** entre la cabecera y el contenido en móvil, por usar
  el token `--pad-seccion` con mínimo de 20px contra el `px-6` de las
  secciones.
- **Imports de tipo** en los componentes del registry, incompatibles con el
  `verbatimModuleSyntax` del proyecto.
- **La cinta salía en español en la página en inglés**: la frase estaba
  escrita dentro de `CintaTexto.tsx`. Ahora vive en `i18n/ui.ts` como campo
  obligatorio de `Textos`, así que falta de traducción rompe el `check`.

### Eliminado

- Bloque de cifras del hero (años, empresas, productos).
- `pixel-rain.tsx` y el helper `aniosDeCarrera()`, huérfanos tras los cambios.
- `text-center` en el cierre de Proyectos, única línea centrada de la página.

### Pendiente

- `public/og.png` de 1200×630 y favicon definitivo.
- El proyecto no tiene repositorio git propio.
