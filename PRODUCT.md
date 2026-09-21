# Product

## Register

brand

## Users

Cuatro públicos a la vez, y ninguno es el dueño de la página:

- **Reclutadores y empresas** evaluando a Emilio para contratarlo. Buscan trayectoria, stack y qué cambió porque estuvo él en cada puesto.
- **Clientes potenciales de Arclo Systems**. Buscan qué problemas resuelve y con qué resultados medibles.
- **Pares y comunidad técnica**. Buscan el cómo: arquitectura, decisiones, código.
- **Inversores o socios** evaluando a Arclo, o a Emilio como fundador.

Llegan en frío, casi siempre desde un enlace (LinkedIn, GitHub, una conversación). No saben quién es antes de entrar. Se quedan poco: la primera pantalla decide si siguen.

Como los cuatro importan, el copy **lidera con lo más amplio y ofrece caminos separados por intención** en vez de hablarle a uno solo. Escribir para un único público dejaría a los otros tres afuera; escribir para "todos" sin caminos no le hablaría a ninguno.

## Product Purpose

Un portafolio personal, no una landing de venta. No hace una oferta: presenta a una persona y su trabajo.

La progresión es el argumento: QA y gestión de proyectos para banca y retail (GSIT, 2022–2023) → analista programador en una plataforma multitenant (Novelteak, 2024–2025) → fundador y CEO dirigiendo arquitectura y equipo (Arclo Systems, 2025–). Con producto publicado de punta a punta: Kodi en Google Play y la plataforma de Transportes Acaya.

Éxito es que las cuatro audiencias salgan con la misma conclusión —este tipo construye y entrega— y con un camino claro hacia lo que a cada una le interesa.

Bilingüe: español en la raíz, inglés bajo `/en`.

## Brand Personality

Sobrio con firma, y editorial en la jerarquía. Contención con carácter: la base es monocroma y precisa, y hay **un** gesto memorable que es suyo, no tres compitiendo.

Voz: primera persona, frases cortas, voseo costarricense cuando se dirige al lector. Concreto antes que adjetivado: "reemplazó la hoja de cálculo con la que operaban", no "soluciones innovadoras". Sin signos de exclamación, sin superlativos, sin palabras de relleno tipo "apasionado" o "innovador".

Tres palabras: **preciso, entregado, sin ruido.**

Emocionalmente busca que lo tomen en serio, no que lo admiren.

## Anti-references

Los cuatro, rechazados explícitamente:

- **Portafolio de dev genérico.** Plantilla de Next.js, tarjetas iguales en grilla, sección "Tech stack" con logos, emojis.
- **Landing de SaaS.** Bloques de features con íconos, métrica gigante con gradiente, testimonios, precios. Cualquier tono que suene a freelance buscando cliente: "Contame tu proyecto", "Disponible para proyectos".
- **Agencia con mucho ruido.** Cursor personalizado, scroll secuestrado, precargador, animaciones por todos lados. Ya se descartó un fondo de lluvia de píxeles por ruidoso, aun al 10% de opacidad: el problema no era el contraste sino el movimiento disperso por todo el viewport.
- **CV en HTML.** Lista plana de puestos y fechas sin jerarquía ni punto de vista.

Referencias que sí: `arclosystems.com` y `holakodi.com` (ambos suyos), y el nivel de acabado de awwwards.

## Design Principles

1. **La prueba antes que la promesa.** Nombres, productos y resultados verificables reemplazan a los adjetivos. Todo lo afirmado tiene que ser enlazable o comprobable.
2. **Un solo gesto.** Un elemento memorable por página, no una colección. Si algo no aporta, se va.
3. **El movimiento se intuye, no compite.** La decoración animada se lee como textura de fondo. Movimiento coherente con una dirección única, nunca disperso.
4. **La progresión es el argumento.** El recorrido de QA a fundador dice más que cualquier titular. La estructura tiene que dejarlo ver sin explicarlo.
5. **Los cuatro públicos, un mensaje y cuatro puertas.** Se lidera con lo común y se abren caminos por intención, en vez de escribir para un promedio que no le habla a nadie.

## Accessibility & Inclusion

Mantener el nivel que el código ya tiene, y aplicarlo a todo lo nuevo:

- **WCAG AA** de contraste. Nota: `--tinta-suave` (`#6b6b70` sobre blanco) cumple AA en cuerpo de texto pero queda corto para AAA; no se persigue AAA.
- **`prefers-reduced-motion` respetado en todo.** Toda pieza animada se apaga o se pinta estática. Si un componente de terceros no lo respeta, se envuelve en una isla que lo resuelva.
- **Foco visible de autor**, no el del navegador, porque cambia de color con el tema y a veces no se ve.
- Decoración marcada `aria-hidden`; nunca lleva contenido que importe.
- Semántica real: un `h1` es un `h1` aunque lo anime un componente.
- Los dos temas (claro y oscuro) son ciudadanos de primera. Nada puede depender de uno solo.
