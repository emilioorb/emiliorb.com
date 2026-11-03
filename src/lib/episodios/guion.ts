import {
  ESTUDIOS,
  INVESTIGACION,
  LIBROS,
  PRENSA,
  PROYECTOS,
  PROYECTOS_PERSONALES,
  REDES,
  TRABAJO,
  type Proyecto,
  type Puesto,
} from "../../data/contenido";
import { RUTAS_LIBROS, TEXTOS, rutasPaper, type Idioma } from "../../i18n/ui";
import { rutaFicha } from "./rutas";
import { casillasDesdeFen, urlPerfil, type ResultadoAjedrez } from "../ajedrez";
import type { Enlace, Escena, Imagen, ItemPasarela, Linea, PartidaEnEscena } from "./tipos";

/** Los hechos salen de contenido.ts; si un puesto cambia de nombre, el build se corta aquí. */
function puesto(empresa: string): Puesto {
  const encontrado = TRABAJO.find((p) => p.empresa === empresa);
  if (!encontrado) throw new Error(`No existe el puesto «${empresa}» en contenido.ts.`);
  return encontrado;
}

/** El copy de la escena repite datos del detalle; si el detalle cambia, que no queden desfasados. */
function citado(fuente: string, trozos: readonly string[]): readonly string[] {
  for (const trozo of trozos) {
    if (!fuente.includes(trozo)) {
      throw new Error(`«${trozo}» ya no aparece en contenido.ts; revise el guion de Episodios.`);
    }
  }
  return trozos;
}

const gsit = puesto("GSIT");
const novelteak = puesto("Novelteak");
const arclo = puesto("Arclo Systems");

/** El orden de la serie, que también decide qué ficha sigue a cuál. */
export const ORDEN_PROYECTOS = [
  "kodi",
  "transportes-acaya",
  "erp-arclo",
  "api-facturacion",
  "gaceta-ai",
  "t-ledger",
  "emiliorb",
] as const;

/**
 * Lo que el guion dice por su cuenta, en cada idioma. Los hechos vienen de
 * contenido.ts; aquí van las líneas del narrador y los títulos de la serie. El
 * español es el que aprobó el dueño; el inglés está escrito en inglés, no
 * traducido palabra por palabra.
 */
const COPY = {
  es: {
    locale: "es-CR",
    hoy: "hoy",
    y: "y",
    por: "por",
    episodio: "Episodio",
    proyectos: "proyectos",
    personal: "Personal",
    apertura: {
      invitacion: "Baje para empezar el primer episodio.",
      cine: "Verlo en pantalla completa",
      narracion: "Emilio Rodríguez es ingeniero de software & IA, en Costa Rica. Esta es su historia, en siete episodios.",
    },
    universidad: {
      titulo: ["Primero,", "la carrera."],
      narracion: (desde: string, institucion: string) => `En ${desde} entró a la ${institucion}.`,
      linea: "La carrera corrió a la par de los tres trabajos que siguen.",
    },
    ep1: {
      titulo: ["Luego,", "la prueba."],
      narracion: "Empezó en QA. Después programó en .NET, y al final lideró proyectos para clientes de tres países.",
      sectores: "banca, comercio, turismo e industria",
      contexto: (sectores: string) => `Clientes de ${sectores}.`,
      pasos: ["Planes de prueba.", "Suites automatizadas.", "Código en .NET.", "Proyectos con Scrum."],
      lineas: [
        "Primero escribió los planes de prueba.",
        "Luego armó las suites automatizadas y el estándar de calidad que usó el equipo.",
        "Después programó unos meses en .NET.",
        "Al final fue Project Manager. Lideró proyectos con Scrum para clientes en Costa Rica, Nicaragua y Guatemala.",
      ],
    },
    ep2: {
      titulo: ["Sin", "señal."],
      narracion: "Después llegó a Novelteak, como analista programador.",
      pasos: ["Migraciones de sistemas.", "App offline-first.", "Plataforma multitenant.", "Departamentos y acceso por rol."],
      lineas: [
        "Empezó migrando sistemas y bases de datos.",
        "En el campo no siempre hay señal. La app tenía que funcionar igual.",
        "Y una plataforma donde cada departamento tiene sus datos aparte. Las dos operan en Costa Rica y Nicaragua.",
        "Se encargó de varios departamentos, de quién puede ver qué y de la documentación.",
      ],
    },
    ep3: {
      titulo: ["Sin soltar", "el código."],
      narracion: (desde: string, empresa: string) => `En ${desde} fundó ${empresa}.`,
      contexto: "Hoy dirijo la arquitectura y el equipo de Arclo Systems, sin soltar el código.",
      pasos: ["Arquitectura.", "Equipo.", "Estándares de ingeniería."],
      lineas: [
        "Dirige la arquitectura y sigue programando.",
        "Con su equipo lleva los proyectos de los requerimientos a producción.",
        "Escribió los estándares que siguen el equipo y sus agentes de IA.",
      ],
    },
    ep4: {
      titulo: ["Lo que", "construyo."],
      narracion: "Siete proyectos. Uno a la vez.",
      proyectos: {
        kodi: "Kodi ayuda a estudiar para la admisión, el MEP y la licencia. Hoy tiene más de 3000 usuarios.",
        "transportes-acaya":
          "Acaya operaba con su sistema anterior y hojas de cálculo. Hoy factura desde la plataforma más de 1500 viajes.",
        "erp-arclo": "El ERP junta lo que en Arclo vivía en tres herramientas que no se hablaban.",
        "api-facturacion": "La API de facturación resuelve una vez lo que cada proyecto rehacía con Hacienda.",
        "gaceta-ai": "Gaceta AI responde preguntas sobre La Gaceta. Cada cita la comprueba el código.",
        "t-ledger":
          "T-Ledger lleva las finanzas de una persona, una pareja o una familia, en partida doble. Cada cifra se rastrea hasta su origen.",
        emiliorb: "Y este sitio, en dos idiomas y dos temas, con las animaciones hechas a mano.",
      },
    },
    ep5: {
      titulo: ["Lo que", "investigo."],
      narracion: "A veces un proyecto le deja una pregunta. Entonces la mide.",
      paper: (proyecto: string) => `De ${proyecto} salió esta. El paper está en preparación.`,
      prensa: (medio: string, primera: boolean) =>
        primera ? `${medio} escribió sobre Kodi.` : `${medio} también contó la historia de Kodi.`,
    },
    ep6: {
      titulo: ["Lo que no", "entra en el CV."],
      narracion: "Lo que hace cuando no está construyendo.",
      empiece: (titulo: string) => `Empiece por ${titulo}`,
      libros: (titulo: string) => [
        "Lee sobre ingeniería, operación e IA. Estos son los que recomienda.",
        `Si usted lee uno, que sea ${titulo}.`,
      ],
      frase: "Juego ajedrez. Pierdo casi tanto como gano, y aprendo de las dos.",
      ajedrez: "Juega ajedrez. Pierde casi tanto como gana, y aprende de las dos.",
    },
    cierre: {
      rotulo: "Próximo episodio",
      narracion: "Hasta aquí, por ahora. Si quiere escribirle, Emilio contesta el mismo día.",
    },
  },
  en: {
    locale: "en-US",
    hoy: "present",
    y: "and",
    por: "by",
    episodio: "Episode",
    proyectos: "projects",
    personal: "Personal",
    apertura: {
      invitacion: "Scroll down to start the first episode.",
      cine: "Watch it full screen",
      narracion: "Emilio Rodríguez is a software and AI engineer in Costa Rica. This is his story, in seven episodes.",
    },
    universidad: {
      titulo: ["First,", "the degree."],
      narracion: (desde: string, institucion: string) => `In ${desde} he started at ${institucion}.`,
      linea: "The degree ran alongside the three jobs that follow.",
    },
    ep1: {
      titulo: ["Then,", "the test."],
      narracion: "He started in QA. Then he wrote .NET, and in the end he led projects for clients in three countries.",
      sectores: "banking, retail, tourism and industry",
      contexto: (sectores: string) => `Clients in ${sectores}.`,
      pasos: ["Test plans.", "Automated suites.", ".NET code.", "Scrum projects."],
      lineas: [
        "First he wrote the test plans.",
        "Then he built the automated suites and the QA standard the team went on to use.",
        "After that he spent a few months writing .NET.",
        "In the end he was the project manager. He led Scrum projects for clients in Costa Rica, Nicaragua and Guatemala.",
      ],
    },
    ep2: {
      titulo: ["No", "signal."],
      narracion: "Next came Novelteak, as a programmer analyst.",
      pasos: ["System migrations.", "An offline-first app.", "A multi-tenant platform.", "Departments and role-based access."],
      lineas: [
        "He started by migrating systems and databases.",
        "Out in the field there isn't always a signal. The app had to work anyway.",
        "And a platform where each department keeps its data apart. Both run in Costa Rica and Nicaragua.",
        "He took on several departments, who gets to see what, and the documentation.",
      ],
    },
    ep3: {
      titulo: ["Still", "writing code."],
      narracion: (desde: string, empresa: string) => `In ${desde} he founded ${empresa}.`,
      contexto: "Today I lead the architecture and the team at Arclo Systems, and I still write the code.",
      pasos: ["Architecture.", "The team.", "Engineering standards."],
      lineas: [
        "He leads the architecture and still writes code.",
        "With his team he takes projects from requirements to production.",
        "He wrote the standards his team and its AI agents work by.",
      ],
    },
    ep4: {
      titulo: ["What", "I build."],
      narracion: "Seven projects. One at a time.",
      proyectos: {
        kodi: "Kodi helps students prepare for university admission, national tests and the driving license. It has over 3,000 users.",
        "transportes-acaya":
          "Acaya ran on its old system and spreadsheets. Today it invoices over 1,500 trips from the platform.",
        "erp-arclo": "The ERP brings together what Arclo kept in three tools that didn't talk to each other.",
        "api-facturacion": "The invoicing API solves, once, what every project used to rebuild for Hacienda.",
        "gaceta-ai": "Gaceta AI answers questions about the official gazette. The code checks every citation.",
        "t-ledger":
          "T-Ledger keeps the books for a person, a couple or a family, in double entry. Every figure traces back to its source.",
        emiliorb: "And this site, in two languages and two themes, with the animations built by hand.",
      },
    },
    ep5: {
      titulo: ["What", "I research."],
      narracion: "Sometimes a project leaves him with a question. Then he measures it.",
      paper: (proyecto: string) => `This one came out of ${proyecto}. The paper is in preparation.`,
      prensa: (medio: string, primera: boolean) =>
        primera ? `${medio} wrote about Kodi.` : `${medio} told Kodi's story too.`,
    },
    ep6: {
      titulo: ["What doesn't", "fit in a CV."],
      narracion: "What he does when he isn't building.",
      empiece: (titulo: string) => `Start with ${titulo}`,
      libros: (titulo: string) => [
        "He reads about engineering, operations and AI. These are the ones he recommends.",
        `If you read only one, make it ${titulo}.`,
      ],
      frase: "I play chess. I lose almost as often as I win, and learn from both.",
      ajedrez: "He plays chess. He loses almost as often as he wins, and learns from both.",
    },
    cierre: {
      rotulo: "Next episode",
      narracion: "That's all for now. If you'd like to write to him, Emilio replies the same day.",
    },
  },
} as const satisfies Record<Idioma, unknown>;

const periodo = (p: Puesto, idioma: Idioma) => `${p.desde}–${p.hasta ?? COPY[idioma].hoy}`;

/** Cada línea lleva un id estable: los subtítulos no anuncian dos veces la misma. */
const lineas = (idioma: Idioma, id: string, textos: readonly string[]): readonly Linea[] =>
  textos.map((texto, i) => ({ id: `${idioma === "es" ? "" : "en-"}${id}-${i}`, texto }));

/** La tarjeta de un episodio: el número arriba y, en la cabecera, el título sin su punto. */
const tarjeta = (idioma: Idioma, episodio: number, titulo: readonly string[]) => ({
  rotulo: `${COPY[idioma].episodio} ${episodio}`,
  cabecera: `${COPY[idioma].episodio} ${episodio} · ${titulo.join(" ").replace(/\.$/, "")}`,
  titulo,
});

const MI_SITIO = "https://emiliorb.com";

export function proyecto(slug: string, idioma: Idioma): { proyecto: Proyecto; grupo: string } {
  const deArclo = PROYECTOS.find((p) => p.slug === slug);
  if (deArclo) return { proyecto: deArclo, grupo: arclo.empresa };
  const personal = PROYECTOS_PERSONALES.find((p) => p.slug === slug);
  if (personal) return { proyecto: personal, grupo: COPY[idioma].personal };
  throw new Error(`No existe el proyecto «${slug}» en contenido.ts.`);
}

/** Sitio y código: lo que la ficha enlaza hacia afuera. */
export function enlacesExternos(p: Proyecto, idioma: Idioma): readonly Enlace[] {
  const t = TEXTOS[idioma];
  const enlaces: Enlace[] = [];
  // El sitio de este mismo portafolio no se enlaza desde dentro de él.
  if (p.href && !p.href.startsWith(MI_SITIO)) enlaces.push({ texto: t.projects.visitarSitio, href: p.href, externo: true });
  if (p.repo) enlaces.push({ texto: t.projects.verCodigo, href: p.repo, externo: true });
  return enlaces;
}

/** Lo que la escena de ajedrez necesita de chess.com, ya resuelto en el build. */
export function partidaDe(
  resultado: ResultadoAjedrez,
  idioma: Idioma,
): { partida: PartidaEnEscena | null; cifras: string | null } {
  if (!resultado.ok) return { partida: null, cifras: null };
  const ta = TEXTOS[idioma].ajedrez;
  const { rapida, recientes } = resultado.datos;
  const cifras = rapida
    ? [`${ta.rapida} ${rapida.actual}`, rapida.mejor ? `${ta.mejor} ${rapida.mejor}` : null]
        .filter((parte) => parte !== null)
        .join(" · ")
    : null;

  const ultima = recientes.at(-1);
  const casillas = ultima ? casillasDesdeFen(ultima.posicion) : null;
  if (!ultima || !casillas) return { partida: null, cifras };
  const titulo = { ganada: ta.victoria, tablas: ta.empate, perdida: ta.derrota }[ultima.resultado];
  return {
    cifras,
    partida: {
      casillas: ultima.jugueConBlancas ? casillas : casillas.toReversed(),
      resumen: `${titulo} ${ta.contra} ${ultima.rival} (${ultima.ratingRival}), ${COPY[idioma].por} ${ta.finales[ultima.final]}. ${
        ultima.jugueConBlancas ? ta.conBlancas : ta.conNegras
      }.`,
      enlace: { texto: ta.verPartida, href: ultima.url, externo: true },
    },
  };
}

interface Entrada {
  readonly idioma: Idioma;
  /** Las portadas ya optimizadas por `getImage`, por slug de libro. */
  readonly portadas: ReadonlyMap<string, Imagen>;
  readonly ajedrez: ReturnType<typeof partidaDe>;
  readonly usuarioChess: string;
}

export function construirGuion({ idioma, portadas, ajedrez, usuarioChess }: Entrada): readonly Escena[] {
  const t = TEXTOS[idioma];
  const c = COPY[idioma];
  const fecha = (iso: string) =>
    new Intl.DateTimeFormat(c.locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
      new Date(iso),
    );

  const proyectos = ORDEN_PROYECTOS.map((slug, i): ItemPasarela => {
    const { proyecto: p, grupo } = proyecto(slug, idioma);
    return {
      id: p.slug,
      rotulo: `${String(i + 1).padStart(2, "0")} / ${String(ORDEN_PROYECTOS.length).padStart(2, "0")} · ${grupo} · ${p.anio}`,
      titulo: p.nombre,
      idiomaTitulo: null,
      linea: p.resumen[idioma],
      meta: `${t.projects.rol}: ${p.rol[idioma]}`,
      enlaces: [
        { texto: t.projects.verProyecto, href: rutaFicha(p.slug, idioma), externo: false },
        ...enlacesExternos(p, idioma),
      ],
    };
  });
  const anios = ORDEN_PROYECTOS.map((slug) => Number(proyecto(slug, idioma).proyecto.anio));

  const paper = INVESTIGACION[0];
  const lectura: readonly { item: ItemPasarela; narracion: string }[] = [
    ...(paper
      ? [
          {
            item: {
              id: `paper-${paper.slug}`,
              rotulo: [
                t.investigacion.estados[paper.estado],
                paper.tituloProvisional ? t.investigacion.tituloProvisional : null,
              ]
                .filter((parte) => parte !== null)
                .join(" · "),
              titulo: paper.titulo,
              idiomaTitulo: "en" as const,
              linea: paper.resumen[idioma],
              meta: `${t.investigacion.proyecto}: ${paper.proyecto}`,
              enlaces: [{ texto: t.investigacion.leer, href: rutasPaper(paper.slug)[idioma], externo: false }],
            },
            narracion: c.ep5.paper(paper.proyecto),
          },
        ]
      : []),
    ...PRENSA.map((nota, i) => ({
      item: {
        id: `prensa-${i}`,
        rotulo: `${t.prensa.titulo} · ${nota.medio} · ${fecha(nota.fecha)}`,
        // El titular va en el idioma de la nota: traducirlo sería inventarlo.
        titulo: nota.titular,
        idiomaTitulo: idioma === "es" ? null : ("es" as const),
        linea: null,
        meta: null,
        enlaces: [{ texto: t.prensa.leer, href: nota.href, externo: true }],
      },
      narracion: c.ep5.prensa(nota.medio, i === 0),
    })),
  ];

  const libros = LIBROS.map((libro) => {
    const portada = portadas.get(libro.slug);
    if (!portada) throw new Error(`Falta la portada de «${libro.titulo}».`);
    return { slug: libro.slug, titulo: libro.titulo, autor: libro.autor, anio: libro.anio, portada };
  });
  const primerLibro = LIBROS[0];
  if (!primerLibro) throw new Error("No hay libros en contenido.ts.");

  const ep1 = c.ep1;
  const ep2 = c.ep2;
  const ep3 = c.ep3;

  return [
    {
      tipo: "apertura",
      id: "apertura",
      largo: 150,
      tono: "claro",
      nombre: "Emilio Rodríguez",
      rol: t.hero.rol,
      invitacion: c.apertura.invitacion,
      cine: c.apertura.cine,
      narracion: lineas(idioma, "apertura", [c.apertura.narracion]),
    },

    // Episodio 1 · Universidad
    {
      tipo: "titulo",
      id: "ep1-titulo",
      largo: 140,
      tono: "invertido",
      ...tarjeta(idioma, 1, c.universidad.titulo),
      pie: `${ESTUDIOS.institucion} · ${ESTUDIOS.desde}–${ESTUDIOS.hasta}`,
      narracion: lineas(idioma, "ep1-titulo", [c.universidad.narracion(ESTUDIOS.desde, ESTUDIOS.institucion)]),
    },
    {
      tipo: "sintesis",
      id: "ep1-carrera",
      largo: 150,
      tono: "claro",
      // En el teléfono el rótulo se parte después del grado: la institución y sus años no se separan.
      rotulo: `${ESTUDIOS.grado[idioma]} · ${ESTUDIOS.institucion.replaceAll(" ", "\u00a0")}\u00a0·\u00a0${ESTUDIOS.desde}\u2060–\u2060${ESTUDIOS.hasta}`,
      texto: ESTUDIOS.carrera[idioma],
      enlaces: [{ texto: new URL(ESTUDIOS.href).hostname, href: ESTUDIOS.href, externo: true }],
      narracion: lineas(idioma, "ep1-carrera", [c.universidad.linea]),
    },

    // Episodio 2 · GSIT
    {
      tipo: "titulo",
      id: "ep2-titulo",
      largo: 140,
      tono: "invertido",
      ...tarjeta(idioma, 2, ep1.titulo),
      pie: `${gsit.empresa} · ${periodo(gsit, idioma)} · ${gsit.cargo[idioma]}`,
      narracion: lineas(idioma, "ep2-titulo", [ep1.narracion]),
    },
    {
      tipo: "etapa",
      id: "ep2-escena",
      largo: 420,
      tono: "claro",
      empresa: gsit.empresa,
      periodo: periodo(gsit, idioma),
      lugares: citado(gsit.detalle[idioma], ["Costa Rica", "Nicaragua", "Guatemala"]),
      contexto: ep1.contexto(citado(gsit.detalle[idioma], [ep1.sectores]).join("")),
      pasos: ep1.pasos.map((texto, i) => ({ texto, remate: i === ep1.pasos.length - 1 })),
      narracion: lineas(idioma, "ep2-escena", ep1.lineas),
    },

    // Episodio 3 · Novelteak
    {
      tipo: "titulo",
      id: "ep3-titulo",
      largo: 140,
      tono: "invertido",
      ...tarjeta(idioma, 3, ep2.titulo),
      pie: `${novelteak.empresa} · ${periodo(novelteak, idioma)} · ${novelteak.cargo[idioma]}`,
      narracion: lineas(idioma, "ep3-titulo", [ep2.narracion]),
    },
    {
      tipo: "etapa",
      id: "ep3-escena",
      largo: 420,
      tono: "claro",
      empresa: novelteak.empresa,
      periodo: periodo(novelteak, idioma),
      lugares: citado(novelteak.detalle[idioma], ["Costa Rica", "Nicaragua"]),
      contexto: `${novelteak.stack.slice(0, -1).join(", ")} ${c.y} ${novelteak.stack.at(-1) ?? ""}.`,
      pasos: ep2.pasos.map((texto, i) => ({ texto, remate: i === ep2.pasos.length - 1 })),
      narracion: lineas(idioma, "ep3-escena", ep2.lineas),
    },

    // Episodio 4 · Arclo Systems
    {
      tipo: "titulo",
      id: "ep4-titulo",
      largo: 140,
      tono: "invertido",
      ...tarjeta(idioma, 4, ep3.titulo),
      pie: `${arclo.empresa} · ${periodo(arclo, idioma)} · ${arclo.cargo[idioma]}`,
      narracion: lineas(idioma, "ep4-titulo", [ep3.narracion(arclo.desde, arclo.empresa)]),
    },
    {
      tipo: "etapa",
      id: "ep4-escena",
      largo: 360,
      tono: "claro",
      empresa: arclo.empresa,
      periodo: periodo(arclo, idioma),
      lugares: [],
      contexto: citado(t.hero.bajada, [ep3.contexto]).join(""),
      pasos: ep3.pasos.map((texto, i) => ({ texto, remate: i === ep3.pasos.length - 1 })),
      narracion: lineas(idioma, "ep4-escena", ep3.lineas),
    },

    // Episodio 5 · Proyectos
    {
      tipo: "titulo",
      id: "ep5-titulo",
      largo: 140,
      tono: "invertido",
      ...tarjeta(idioma, 5, c.ep4.titulo),
      pie: `${proyectos.length} ${c.proyectos} · ${Math.min(...anios)}–${Math.max(...anios)}`,
      narracion: lineas(idioma, "ep5-titulo", [c.ep4.narracion]),
    },
    {
      tipo: "pasarela",
      id: "ep5-proyectos",
      largo: 100 + proyectos.length * 55,
      tono: "claro",
      encabezado: t.nav.projects,
      items: proyectos,
      narracion: lineas(
        idioma,
        "ep5-proyectos",
        ORDEN_PROYECTOS.map((slug) => c.ep4.proyectos[slug]),
      ),
    },

    // Episodio 6 · Investigación y prensa
    {
      tipo: "titulo",
      id: "ep6-titulo",
      largo: 140,
      tono: "invertido",
      ...tarjeta(idioma, 6, c.ep5.titulo),
      pie: `${t.nav.investigacion} · ${t.nav.prensa}`,
      narracion: lineas(idioma, "ep6-titulo", [c.ep5.narracion]),
    },
    {
      tipo: "pasarela",
      id: "ep6-lectura",
      largo: 100 + lectura.length * 60,
      tono: "claro",
      encabezado: `${t.nav.investigacion} ${c.y} ${t.nav.prensa.toLowerCase()}`,
      items: lectura.map((l) => l.item),
      narracion: lineas(
        idioma,
        "ep6-lectura",
        lectura.map((l) => l.narracion),
      ),
    },

    // Episodio 7 · Lo personal
    {
      tipo: "titulo",
      id: "ep7-titulo",
      largo: 140,
      tono: "invertido",
      ...tarjeta(idioma, 7, c.ep6.titulo),
      pie: `${t.nav.libros} · ${t.ajedrez.titulo}`,
      narracion: lineas(idioma, "ep7-titulo", [c.ep6.narracion]),
    },
    {
      tipo: "estante",
      id: "ep7-libros",
      largo: 260,
      tono: "claro",
      encabezado: t.libros.titulo,
      libros,
      destacado: { rotulo: c.ep6.empiece(primerLibro.titulo), porQue: primerLibro.porQue[idioma] },
      enlace: { texto: t.libros.verTodos, href: RUTAS_LIBROS[idioma], externo: false },
      narracion: lineas(idioma, "ep7-libros", c.ep6.libros(primerLibro.titulo)),
    },
    {
      tipo: "ajedrez",
      id: "ep7-ajedrez",
      largo: 220,
      tono: "claro",
      encabezado: t.ajedrez.titulo,
      frase: c.ep6.frase,
      partida: ajedrez.partida,
      cifras: ajedrez.cifras,
      perfil: { texto: t.ajedrez.perfil, href: urlPerfil(usuarioChess), externo: true },
      narracion: lineas(idioma, "ep7-ajedrez", [c.ep6.ajedrez]),
    },

    {
      tipo: "cierre",
      id: "proximo",
      largo: 150,
      tono: "invertido",
      rotulo: c.cierre.rotulo,
      pregunta: t.contact.bajada,
      correo: t.contact.correo,
      respuesta: t.contact.respuesta,
      redes: REDES.filter((red) => red.nombre === "LinkedIn" || red.nombre === "GitHub").map((red) => ({
        texto: red.nombre,
        href: red.href,
        externo: true,
      })),
      narracion: lineas(idioma, "proximo", [c.cierre.narracion]),
    },
  ];
}
