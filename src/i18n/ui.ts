import type { EstadoPaper } from "../data/contenido";
import type { Final } from "../lib/ajedrez";

export const IDIOMAS = ["es", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];

/** El de la raíz no lleva prefijo; el otro vive bajo `/en`. */
export const POR_DEFECTO: Idioma = "es";

export const rutaDe = (idioma: Idioma, hash = "") =>
  `${idioma === POR_DEFECTO ? "/" : "/en/"}${hash}`;

/** Cada idioma con su propio slug: "/en/investigacion" no se lee en inglés. */
export const RUTAS_INVESTIGACION: Record<Idioma, string> = {
  es: "/investigacion",
  en: "/en/research",
};

export const RUTAS_LIBROS: Record<Idioma, string> = {
  es: "/libros",
  en: "/en/books",
};

export const rutasProyecto = (slug: string): Record<Idioma, string> => ({
  es: `/proyectos/${slug}`,
  en: `/en/projects/${slug}`,
});

export const rutasPaper = (slug: string): Record<Idioma, string> => ({
  es: `${RUTAS_INVESTIGACION.es}/${slug}`,
  en: `${RUTAS_INVESTIGACION.en}/${slug}`,
});

/** La partida que muestra la serie, en palabras. */
export interface TextosAjedrez {
  readonly titulo: string;
  readonly rapida: string;
  readonly mejor: string;
  readonly victoria: string;
  readonly empate: string;
  readonly derrota: string;
  readonly contra: string;
  readonly finales: Record<Final, string>;
  readonly conBlancas: string;
  readonly conNegras: string;
  readonly verPartida: string;
  readonly perfil: string;
}

/** Los controles de la serie: cabecera, reproductor, modo cine y enlaces. */
export interface TextosSerie {
  readonly contacto: string;
  /** La etiqueta del nombre en la cabecera, que lleva al inicio de la serie. */
  readonly alInicio: string;
  /** El enlace al otro idioma: corto a la vista y completo para el lector de pantalla. */
  readonly otroIdioma: { readonly corto: string; readonly etiqueta: string };
  readonly salir: string;
  readonly nuevaPestana: string;
  /** De una página suelta a la escena de la serie que la cuenta: corto a la vista, completo para el lector de pantalla. */
  readonly volver: { readonly corto: string; readonly etiqueta: string };
  /** El menú del rótulo central: el botón cuando no hay episodio en curso (y en el teléfono) y el nombre de la lista. */
  readonly indice: { readonly corto: string; readonly etiqueta: string };
}

interface Textos {
  readonly nav: {
    projects: string;
    prensa: string;
    investigacion: string;
    libros: string;
    contact: string;
  };
  readonly meta: { titulo: string; descripcion: string };
  readonly hero: {
    rol: string;
    /** La bajada de la portada vieja; la serie cita su última frase en el episodio 3. */
    bajada: string;
  };
  readonly projects: {
    verProyecto: string;
    rol: string;
    contexto: string;
    aportes: string;
    resultados: string;
    stack: string;
    visitarSitio: string;
    verCodigo: string;
  };
  readonly prensa: { titulo: string; leer: string };
  readonly investigacion: {
    meta: { titulo: string; descripcion: string };
    titulo: string;
    bajada: string;
    estados: Record<EstadoPaper, string>;
    tituloProvisional: string;
    proyecto: string;
    tesis: string;
    aportes: string;
    destinos: string;
    volver: string;
    leer: string;
  };
  readonly libros: {
    meta: { titulo: string; descripcion: string };
    titulo: string;
    bajada: string;
    verTodos: string;
  };
  readonly ajedrez: TextosAjedrez;
  readonly contact: {
    bajada: string;
    correo: string;
    /** Lo que pasa después de escribir: sin esto el lector no sabe si vale la pena. */
    respuesta: string;
  };
  readonly serie: TextosSerie;
  readonly ubicacion: string;
}

export const TEXTOS: Record<Idioma, Textos> = {
  es: {
    nav: { projects: "Proyectos", prensa: "Prensa", investigacion: "Investigación", libros: "Libros", contact: "Contacto" },
    meta: {
      titulo: "Emilio Rodríguez — Software a medida desde Costa Rica",
      descripcion:
        "Software & AI Engineer en Costa Rica y fundador de Arclo Systems. Construí la plataforma desde la que Transportes Acaya factura más de 1500 viajes y Kodi, una app con más de 3000 usuarios.",
    },
    hero: {
      rol: "Software & AI Engineer · Fundador de Arclo Systems",
      bajada:
        "Empecé en QA, pasé por el código en .NET y terminé liderando proyectos para clientes de tres países. En Novelteak, una app offline-first para trabajo de campo y una plataforma multitenant. Hoy dirijo la arquitectura y el equipo de Arclo Systems, sin soltar el código.",
    },
    projects: {
      verProyecto: "Ver el proyecto",
      rol: "Mi rol",
      contexto: "El problema",
      aportes: "Qué hice",
      resultados: "Resultados",
      stack: "Stack",
      visitarSitio: "Visitar el sitio",
      verCodigo: "Ver el código",
    },
    prensa: { titulo: "En la prensa", leer: "Leer la nota" },
    investigacion: {
      meta: {
        titulo: "Investigación — Emilio Rodríguez",
        descripcion:
          "Papers que salen de mis proyectos: qué hipótesis ponen a prueba, qué aportan y dónde se publican.",
      },
      titulo: "Investigación",
      bajada:
        "Algunos proyectos dejan preguntas que vale la pena medir. Acá van los papers que salen de ellos, con su estado real.",
      estados: { preparacion: "En preparación", preprint: "Preprint", publicado: "Publicado" },
      tituloProvisional: "Título de trabajo",
      proyecto: "Proyecto",
      tesis: "Hipótesis",
      aportes: "Aportes",
      destinos: "Dónde se publicaría",
      volver: "Toda la investigación",
      leer: "Ver el paper",
    },
    libros: {
      meta: {
        titulo: "Libros que recomiendo — Emilio Rodríguez",
        descripcion: "Los libros que recomiendo sobre ingeniería, operación e IA: los que más me han servido para construir y dirigir.",
      },
      titulo: "Libros que recomiendo",
      bajada: "Los que más me han servido para construir y dirigir.",
      verTodos: "Ver todos los libros",
    },
    ajedrez: {
      titulo: "Ajedrez",
      rapida: "Rápidas",
      mejor: "Mejor",
      victoria: "Victoria",
      empate: "Tablas",
      derrota: "Derrota",
      contra: "contra",
      finales: {
        "jaque-mate": "jaque mate",
        rendicion: "rendición",
        tiempo: "tiempo",
        abandono: "abandono",
        acuerdo: "acuerdo",
        repeticion: "repetición",
        ahogado: "ahogado",
        "material-insuficiente": "material insuficiente",
        "cincuenta-movimientos": "regla de 50 movimientos",
        "tiempo-sin-material": "tiempo sin material para ganar",
        otro: "otro final",
      },
      conBlancas: "Con blancas",
      conNegras: "Con negras",
      verPartida: "Ver la partida en chess.com",
      perfil: "Mi perfil en chess.com",
    },
    contact: {
      bajada: "¿En qué está trabajando?",
      correo: "emiliorb@arclosystems.com",
      respuesta: "Le respondo el mismo día.",
    },
    serie: {
      contacto: "Contacto",
      alInicio: "Emilio Rodríguez, volver al inicio de la serie",
      otroIdioma: { corto: "EN", etiqueta: "English version" },
      salir: "Salir",
      nuevaPestana: "(abre en otra pestaña)",
      volver: { corto: "Volver", etiqueta: "Volver a la serie" },
      indice: { corto: "Episodios", etiqueta: "Episodios de la serie" },
    },
    ubicacion: "San José, Costa Rica",
  },
  en: {
    nav: { projects: "Projects", prensa: "Press", investigacion: "Research", libros: "Books", contact: "Contact" },
    meta: {
      titulo: "Emilio Rodríguez — Custom software from Costa Rica",
      descripcion:
        "Software & AI Engineer in Costa Rica and founder of Arclo Systems. I built the platform Transportes Acaya invoices over 1,500 trips from, and Kodi, an app with over 3,000 users.",
    },
    hero: {
      rol: "Software & AI Engineer · Founder of Arclo Systems",
      bajada:
        "I started in QA, moved on to .NET code and ended up leading projects for clients in three countries. At Novelteak, an offline-first app for field work and a multi-tenant platform. Today I lead the architecture and the team at Arclo Systems, and I still write the code.",
    },
    projects: {
      verProyecto: "View the project",
      rol: "My role",
      contexto: "The problem",
      aportes: "What I did",
      resultados: "Results",
      stack: "Stack",
      visitarSitio: "Visit the site",
      verCodigo: "View the code",
    },
    prensa: { titulo: "In the press", leer: "Read the article" },
    investigacion: {
      meta: {
        titulo: "Research — Emilio Rodríguez",
        descripcion:
          "Papers that come out of my projects: the hypothesis each one tests, what it contributes and where it is published.",
      },
      titulo: "Research",
      bajada:
        "Some projects raise questions worth measuring. These are the papers that come out of them, with their actual status.",
      estados: { preparacion: "In preparation", preprint: "Preprint", publicado: "Published" },
      tituloProvisional: "Working title",
      proyecto: "Project",
      tesis: "Hypothesis",
      aportes: "Contributions",
      destinos: "Where it would be published",
      volver: "All research",
      leer: "View the paper",
    },
    libros: {
      meta: {
        titulo: "Books I recommend — Emilio Rodríguez",
        descripcion: "The books I recommend on engineering, operations and AI: the ones that have helped me most to build and lead.",
      },
      titulo: "Books I recommend",
      bajada: "The ones that have helped me most to build and lead.",
      verTodos: "See all the books",
    },
    ajedrez: {
      titulo: "Chess",
      rapida: "Rapid",
      mejor: "Best",
      victoria: "Win",
      empate: "Draw",
      derrota: "Loss",
      contra: "vs",
      finales: {
        "jaque-mate": "checkmate",
        rendicion: "resignation",
        tiempo: "time",
        abandono: "abandonment",
        acuerdo: "agreement",
        repeticion: "repetition",
        ahogado: "stalemate",
        "material-insuficiente": "insufficient material",
        "cincuenta-movimientos": "50-move rule",
        "tiempo-sin-material": "timeout vs insufficient material",
        otro: "other",
      },
      conBlancas: "With white",
      conNegras: "With black",
      verPartida: "View the game on chess.com",
      perfil: "My chess.com profile",
    },
    contact: {
      bajada: "What are you working on?",
      correo: "emiliorb@arclosystems.com",
      respuesta: "I get back to you the same day.",
    },
    serie: {
      contacto: "Contact",
      alInicio: "Emilio Rodríguez, back to the start of the series",
      otroIdioma: { corto: "ES", etiqueta: "Versión en español" },
      salir: "Exit",
      nuevaPestana: "(opens in a new tab)",
      volver: { corto: "Back", etiqueta: "Back to the series" },
      indice: { corto: "Episodes", etiqueta: "Episodes of the series" },
    },
    ubicacion: "San José, Costa Rica",
  },
};
