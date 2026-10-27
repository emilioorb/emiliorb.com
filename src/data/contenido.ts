import type { Idioma } from "../i18n/ui";

interface Bilingue {
  readonly es: string;
  readonly en: string;
}

export interface Puesto {
  readonly empresa: string;
  /** `null` cuando la empresa no tiene sitio. */
  readonly href: string | null;
  readonly cargo: Bilingue;
  readonly desde: string;
  /** `null` mientras siga vigente. */
  readonly hasta: string | null;
  readonly detalle: Bilingue;
  readonly stack: readonly string[];
}

export interface Proyecto {
  readonly nombre: string;
  readonly href: string | null;
  readonly anio: string;
  readonly detalle: Bilingue;
  readonly stack: readonly string[];
}

/**
 * Redactado con verbos en primera persona y resultados, no con fases del ciclo
 * de vida: "participé en todas las etapas" lo puede escribir cualquiera y no
 * dice qué cambió porque estuviste vos.
 */
export const TRABAJO: readonly Puesto[] = [
  {
    empresa: "Arclo Systems",
    href: "https://arclosystems.com",
    cargo: { es: "Fundador & CEO", en: "Founder & CEO" },
    desde: "2025",
    hasta: null,
    detalle: {
      es: "Dirijo la arquitectura técnica y el equipo. Con ellos llevamos Kodi del primer diseño a producción y construimos la plataforma de Transportes Acaya, que reemplazó la hoja de cálculo con la que operaban.",
      en: "I lead the technical architecture and the team. Together we took Kodi from first design to production and built the Transportes Acaya platform that replaced the spreadsheet they ran on.",
    },
    stack: ["Next.js", "NestJS", "React Native", "PostgreSQL", "Prisma"],
  },
  {
    empresa: "Novelteak",
    href: "https://www.novelteak.com",
    cargo: { es: "Analista programador", en: "Programmer Analyst" },
    desde: "2024",
    hasta: "2025",
    detalle: {
      es: "Formé parte del equipo que construyó la app offline-first con la que las cuadrillas llevan el trabajo de campo sin señal, y la plataforma multitenant. Me ocupé de los módulos por área, del control de acceso por rol y de la documentación técnica. Las dos operan en Costa Rica y Nicaragua.",
      en: "I was part of the team that built the offline-first app crews use to run field work with no signal, and the multi-tenant platform. I handled the per-area modules, role-based access control and the technical documentation. Both run in Costa Rica and Nicaragua.",
    },
    stack: ["Ionic", "Angular", "Express", "SQL Server"],
  },
  {
    empresa: "GSIT",
    href: null,
    cargo: { es: "Project Manager & QA", en: "Project Manager & QA" },
    desde: "2022",
    hasta: "2023",
    detalle: {
      es: "Lideré proyectos con Scrum para clientes de banca, comercio, turismo e industria en Costa Rica, Nicaragua y Guatemala. Armé los planes de prueba, las suites automatizadas y el estándar de calidad que después usó el equipo.",
      en: "I led Scrum projects for banking, retail, tourism and industry clients across Costa Rica, Nicaragua and Guatemala. I built the test plans, the automated suites and the QA standard the team used afterwards.",
    },
    stack: ["Scrum", "QA", "Automatización"],
  },
];

/**
 * Del más reciente al más viejo. Ordenado acá y no a mano, para que agregar
 * uno nuevo no obligue a acordarse de moverlo de sitio. El `sort` de JS es
 * estable, así que los empates conservan el orden de la lista.
 */
export const PROYECTOS: readonly Proyecto[] = [
  {
    nombre: "Kodi",
    href: "https://holakodi.com",
    anio: "2026",
    detalle: {
      es: "App de preparación para admisión universitaria, pruebas nacionales y licencias del COSEVI. Diseño, desarrollo, infraestructura y publicación.",
      en: "Prep app for university admission, national tests and COSEVI licenses. Design, development, infrastructure and release.",
    },
    stack: ["React Native", "NestJS", "PostgreSQL"],
  },
  {
    nombre: "Transportes Acaya",
    href: "https://acaya.app",
    anio: "2025",
    detalle: {
      es: "Operaban sobre una hoja de cálculo que nadie podía editar a la vez. Hoy es el sistema con el que facturan: cada viaje tiene estado y tarifa calculada, las liquidaciones a terceros y las órdenes de compra salen del mismo lugar, y cada usuario ve según su rol. Más de 1500 viajes gestionados.",
      en: "They ran on a spreadsheet nobody could edit at the same time. Now it is the system they invoice from: every trip has a status and a calculated fare, third-party settlements and purchase orders come out of the same place, and each user sees what their role allows. Over 1,500 trips managed.",
    },
    stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma"],
  },
  {
    nombre: "MiBrete",
    // Sin enlace hasta que salga.
    href: null,
    anio: "2027",
    detalle: {
      es: "Producto propio, en desarrollo. Damos detalles cuando salga.",
      en: "Our own product, in development. We will share details when it ships.",
    },
    stack: ["React Native", "NestJS", "PostgreSQL"],
  },
  {
    nombre: "Tiquetico",
    // Sin enlace hasta que salga.
    href: null,
    anio: "2027",
    detalle: {
      es: "Producto propio, en desarrollo. Damos detalles cuando salga.",
      en: "Our own product, in development. We will share details when it ships.",
    },
    stack: ["Expo", "React", "NestJS", "PostgreSQL", "IA"],
  },
  {
    nombre: "ERP de Arclo Systems",
    // Interno, con login y 2FA.
    href: null,
    anio: "2026",
    detalle: {
      es: "Arclo llevaba el CRM, los proyectos y la contabilidad en tres herramientas. Ahora cada cliente va del lead a la cotización, el contrato y las entregas quincenales en un solo sistema, y sigue su avance desde un portal propio. Todo cae en contabilidad de partida doble en colones y dólares, con la rentabilidad de cada proyecto. Tiene roles por módulo, 2FA y auditoría, y un servidor MCP con OAuth 2.1 que expone los estándares de Arclo a agentes de IA.",
      en: "Arclo kept its CRM, projects and accounting in three separate tools. Now every client moves from lead to quote, contract and biweekly deliveries in one system, and follows their progress from their own portal. Everything lands in double-entry accounting in colones and dollars, with each project's profitability. It has per-module roles, 2FA and audit logs, and an MCP server with OAuth 2.1 that exposes Arclo's standards to AI agents.",
    },
    stack: ["React", "NestJS", "PostgreSQL", "Prisma", "MCP"],
  },
].sort((a, b) => Number(b.anio) - Number(a.anio));

/**
 * Lo que construyo por fuera de Arclo: producto propio y experimentos que
 * igual viven en producción. Mismo tipo que `PROYECTOS` y mismo orden.
 */
export const PROYECTOS_PERSONALES: readonly Proyecto[] = [
  {
    nombre: "T-Ledger",
    href: "https://t-ledger.vercel.app/",
    anio: "2026",
    detalle: {
      es: "Contabilidad de partida doble de verdad para tu libro personal, el de pareja y el de la familia. Presupuesto, deudas, metas e inversiones que cuadran, y cada cifra se rastrea hasta su origen.",
      en: "Real double-entry accounting for your personal, couple and family ledgers. Budgets, debts, goals and investments that balance, and every figure traces back to its source.",
    },
    stack: ["React", "NestJS", "PostgreSQL"],
  },
  {
    // Nombre provisional; sin enlace hasta que exista el repo.
    nombre: "Gaceta AI",
    href: null,
    anio: "2026",
    detalle: {
      es: "Preguntale a La Gaceta de Costa Rica en lenguaje natural. RAG propio que ingiere la edición del día, responde con citas literales verificadas y enlaza a la publicación original, o dice “no lo sé”. Con evals desde el día uno y sin datos de personas privadas en el índice.",
      en: "Ask Costa Rica's official gazette, La Gaceta, in plain language. A custom RAG that ingests each day's edition, answers with verified verbatim citations linking to the original notice, or says “I don't know”. Evals from day one, and no private individuals' data in the index.",
    },
    stack: ["NestJS", "PostgreSQL", "pgvector", "Claude"],
  },
  {
    nombre: "emiliorb.com",
    href: "https://emiliorb.com",
    anio: "2026",
    detalle: {
      es: "Este portafolio. Landing bilingüe con enrutado por idioma, tema claro y oscuro, y las animaciones hechas a mano.",
      en: "This portfolio. Bilingual landing with per-language routing, light and dark themes, and hand-built animations.",
    },
    stack: ["Astro", "React", "Tailwind", "GSAP"],
  },
].sort((a, b) => Number(b.anio) - Number(a.anio));

export interface Nota {
  readonly medio: string;
  /** En el idioma original de la nota: traducir un titular ajeno sería inventarlo. */
  readonly titular: string;
  readonly href: string;
  /** ISO 8601; ordena y alimenta el `<time>`. */
  readonly fecha: string;
}

export const PRENSA: readonly Nota[] = [
  {
    medio: "El Financiero",
    titular:
      "Esta app puede ayudarle en sus exámenes de admisión a universidades, de manejo y del MEP.",
    href: "https://www.elfinancierocr.com/tecnologia/esta-app-puede-ayudarle-en-sus-examenes-de/3PFRLCUYUZAAHJ3X43TXCPDHRU/story/",
    fecha: "2026-10-02",
  },
  {
    medio: "NTG Costa Rica",
    titular:
      "Talento de Tilarán crea Kodi, una aplicación que busca cambiar la forma de estudiar para los exámenes.",
    href: "https://ntgcostarica.com/talento-de-tilaran-crea-kodi-una-aplicacion-que-busca-cambiar-la-forma-de-estudiar-para-los-examenes/",
    fecha: "2026-09-30",
  },
].sort((a, b) => b.fecha.localeCompare(a.fecha));

export type EstadoPaper = "preparacion" | "preprint" | "publicado";

export interface Paper {
  readonly slug: string;
  /** Va en inglés en los dos idiomas: es el idioma en que se escribe el paper. */
  readonly titulo: string;
  /** Una línea para la lista; el detalle va en su propia página. */
  readonly resumen: Bilingue;
  readonly tituloProvisional: boolean;
  readonly proyecto: string;
  readonly estado: EstadoPaper;
  readonly tesis: Bilingue;
  readonly aportes: readonly Bilingue[];
  /** En orden de preferencia. */
  readonly destinos: readonly Bilingue[];
  readonly calendario: Bilingue;
}

/**
 * Solo lo que el plan del paper sostiene hoy: mientras no haya resultados
 * medidos, la tesis se presenta como hipótesis y nada figura como enviado.
 * El más reciente va primero: la portada muestra los primeros.
 */
export const INVESTIGACION: readonly Paper[] = [
  {
    slug: "gaceta-ai",
    titulo: "Reliability by engineering: a RAG over Costa Rica's official gazette",
    resumen: {
      es: "Cuánta confiabilidad de un RAG jurídico sale de decisiones de ingeniería verificables y no de una recuperación más sofisticada.",
      en: "How much of a legal RAG's reliability comes from verifiable engineering decisions rather than more sophisticated retrieval.",
    },
    tituloProvisional: true,
    proyecto: "Gaceta AI",
    estado: "preparacion",
    tesis: {
      es: "En un RAG sobre un diario oficial, la mayor parte de la confiabilidad sale de decisiones de ingeniería verificables y no de técnicas de recuperación más sofisticadas: segmentar por publicación, comprobar las citas por código y filtrar los datos personales antes de indexar. Se mide con una ablación sobre un conjunto de referencia nuevo, y los resultados pueden desmentirla.",
      en: "In a RAG over an official gazette, most of the reliability comes from verifiable engineering decisions rather than more sophisticated retrieval: chunking by notice, checking citations in code and filtering personal data before indexing. It is measured with an ablation over a new benchmark, and the results may refute it.",
    },
    aportes: [
      {
        es: "Un conjunto de referencia abierto de preguntas sobre normativa costarricense, con respuesta y cita verificable (Gaceta, fecha y página).",
        en: "An open benchmark of questions on Costa Rican regulation, each with an answer and a verifiable citation (gazette, date and page).",
      },
      {
        es: "Una ablación de recuperación sobre un corpus jurídico en español: vectores, búsqueda híbrida, BM25, reranker y grafo de normas.",
        en: "A retrieval ablation over a Spanish legal corpus: vectors, hybrid search, BM25, a reranker and a graph of regulations.",
      },
      {
        es: "Verificación de citas por código: cuántas citas inventa el generador y cuánto cuesta eliminarlas.",
        en: "Citation checking in code: how many citations the generator invents and what it costs to remove them.",
      },
      {
        es: "Privacidad antes de indexar en un diario oficial que publica datos personales.",
        en: "Privacy before indexing in an official gazette that publishes personal data.",
      },
      {
        es: "Inyección de instrucciones desde el corpus: las publicaciones pagadas como vector de ataque.",
        en: "Prompt injection from the corpus: paid notices as an attack vector.",
      },
      {
        es: "Comparación con asistentes generales con búsqueda web, en la misma tarea y con las mismas métricas.",
        en: "A comparison with general-purpose assistants with web search, on the same task and metrics.",
      },
    ],
    destinos: [
      { es: "Preprint en arXiv (cs.CL y cs.IR)", en: "arXiv preprint (cs.CL and cs.IR)" },
      { es: "Workshop NLLP 2027, junto a EMNLP", en: "NLLP 2027 workshop, co-located with EMNLP" },
      {
        es: "ACL Rolling Review como artículo de recurso, si los resultados lo sostienen",
        en: "ACL Rolling Review as a resource paper, if the results hold up",
      },
    ],
    calendario: {
      es: "Se escribe en inglés cuando estén medidos los resultados de las fases 1 y 2.",
      en: "Written in English once the results of phases 1 and 2 are measured.",
    },
  },
];

export interface Estudio {
  readonly institucion: string;
  readonly href: string;
  readonly titulo: Bilingue;
  readonly desde: string;
  readonly hasta: string;
}

/**
 * Va al pie de Experiencia y no en una sección propia: con un solo título,
 * darle encabezado y divisoria lo pondría al mismo nivel visual que tres
 * puestos y dos productos publicados, y no pesa lo mismo.
 */
export const ESTUDIOS: Estudio = {
  institucion: "Universidad Invenio",
  href: "https://invenio.ac.cr",
  titulo: {
    es: "Licenciatura en Tecnologías de Información y Comunicación Empresariales",
    en: "Licentiate degree, Enterprise Information and Communication Technologies",
  },
  desde: "2022",
  hasta: "2026",
};

export interface Red {
  readonly nombre: string;
  readonly href: string;
}

export const REDES: readonly Red[] = [
  { nombre: "GitHub", href: "https://github.com/emilioorb" },
  { nombre: "LinkedIn", href: "https://www.linkedin.com/in/emiliojrb/" },
  { nombre: "X", href: "https://x.com/_emiliojrb" },
];

export const enIdioma = (texto: Bilingue, idioma: Idioma) => texto[idioma];
