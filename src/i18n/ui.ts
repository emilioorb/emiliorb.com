export const IDIOMAS = ["es", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];

/** El de la raíz no lleva prefijo; el otro vive bajo `/en`. */
export const POR_DEFECTO: Idioma = "es";

export const rutaDe = (idioma: Idioma, hash = "") =>
  `${idioma === POR_DEFECTO ? "/" : "/en/"}${hash}`;

interface Textos {
  readonly nav: { inicio: string; work: string; projects: string; contact: string };
  readonly meta: { titulo: string; descripcion: string };
  readonly hero: {
    rol: string;
    /** El titular va en dos pesos: el primer trozo apagado, el segundo pleno. */
    titular: { suave: string; fuerte: string };
    bajada: string;
    /** Trozos de la bajada que se resaltan; tienen que aparecer literales. */
    pruebas: readonly string[];
    cta: { principal: string; secundario: string };
  };
  readonly work: { titulo: string; presente: string; estudios: string };
  readonly projects: { titulo: string; visitar: string; masPronto: string };
  readonly personales: { titulo: string };
  readonly contact: {
    titulo: string;
    bajada: string;
    correo: string;
    escribir: string;
    /** Lo que pasa después de escribir: sin esto el lector no sabe si vale la pena. */
    respuesta: string;
  };
  readonly tema: { claro: string; oscuro: string; cerrar: string };
  /** Frase de la cinta ondulada. Va en versales y se repite en bucle. */
  readonly cinta: string;
  readonly idioma: string;
  readonly redes: string;
  readonly ubicacion: string;
  readonly otroIdioma: string;
}

export const TEXTOS: Record<Idioma, Textos> = {
  es: {
    nav: { inicio: "Inicio", work: "Experiencia", projects: "Proyectos", contact: "Contacto" },
    meta: {
      titulo: "Emilio Rodríguez — Software a medida desde Costa Rica",
      descripcion:
        "Construyo software a medida, automatizaciones y agentes de IA. Fundador de Arclo Systems, con proyectos en Costa Rica, Nicaragua y Guatemala.",
    },
    hero: {
      rol: "Fundador & CEO · Arclo Systems",
      titular: {
        suave: "Construyo software",
        fuerte: "que otros usan a diario.",
      },
      bajada:
        "Empecé liderando proyectos y calidad en tres países. En Novelteak, una app offline-first para trabajo de campo y una plataforma multitenant. Hoy dirijo la arquitectura y el equipo de Arclo Systems, sin soltar el código.",
      pruebas: ["offline-first", "multitenant"],
      cta: {
        principal: "Ver mi trabajo",
        secundario: "Escribime",
      },
    },
    work: {
      titulo: "Experiencia",
      presente: "Actualidad",
      estudios: "Formación",
    },
    projects: {
      titulo: "Proyectos Arclo Systems",
      visitar: "Visitar",
      masPronto:
        "Estamos construyendo otros proyectos, propios y para clientes, que pronto salen a la luz.",
    },
    personales: { titulo: "Proyectos personales" },
    contact: {
      titulo: "Contacto",
      bajada: "¿En qué andás?",
      correo: "emiliorb@arclosystems.com",
      escribir: "Escribime",
      respuesta: "Te contesto en el día.",
    },
    tema: {
      claro: "Cambiar a modo claro",
      oscuro: "Cambiar a modo oscuro",
      cerrar: "Cerrar",
    },
    cinta: "ARQUITECTURA · CÓDIGO · PRODUCTO · ENTREGA · ",
    idioma: "Idioma",
    redes: "Redes",
    ubicacion: "San José, Costa Rica",
    otroIdioma: "English",
  },
  en: {
    nav: { inicio: "Home", work: "Work", projects: "Projects", contact: "Contact" },
    meta: {
      titulo: "Emilio Rodríguez — Custom software from Costa Rica",
      descripcion:
        "I build custom software, automations and AI agents. Founder of Arclo Systems, with work across Costa Rica, Nicaragua and Guatemala.",
    },
    hero: {
      rol: "Founder & CEO · Arclo Systems",
      titular: {
        suave: "I build software",
        fuerte: "other people use daily.",
      },
      bajada:
        "I started leading projects and QA across three countries. At Novelteak, an offline-first app for field work and a multi-tenant platform. Today I lead the architecture and the team at Arclo Systems, and I still write the code.",
      pruebas: ["offline-first", "multi-tenant"],
      cta: {
        principal: "See my work",
        secundario: "Write to me",
      },
    },
    work: {
      titulo: "Work",
      presente: "Present",
      estudios: "Education",
    },
    projects: {
      titulo: "Arclo Systems Projects",
      visitar: "Visit",
      masPronto:
        "We are building other projects, our own and for clients, coming out soon.",
    },
    personales: { titulo: "Personal projects" },
    contact: {
      titulo: "Contact",
      bajada: "What are you working on?",
      correo: "emiliorb@arclosystems.com",
      escribir: "Write to me",
      respuesta: "I get back to you the same day.",
    },
    tema: {
      claro: "Switch to light mode",
      oscuro: "Switch to dark mode",
      cerrar: "Close",
    },
    cinta: "ARCHITECTURE · CODE · PRODUCT · DELIVERY · ",
    idioma: "Language",
    redes: "Social",
    ubicacion: "San José, Costa Rica",
    otroIdioma: "Español",
  },
};
