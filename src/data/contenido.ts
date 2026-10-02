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
    anio: "2026",
    detalle: {
      es: "Producto propio, en desarrollo. Damos detalles cuando salga.",
      en: "Our own product, in development. We will share details when it ships.",
    },
    stack: ["React Native", "NestJS", "PostgreSQL"],
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
  hasta: "2025",
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
