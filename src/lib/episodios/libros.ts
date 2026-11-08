import { LIBROS, enIdioma } from "../../data/contenido";
import { TEXTOS, rutaDe, type Idioma } from "../../i18n/ui";
import { rutasSerie } from "./rutas";
import type { Escena, Imagen, Linea } from "./tipos";

/**
 * La librería contada como la serie: su tarjeta, un libro por escena en el
 * orden en que los recomiendo, y la salida de vuelta a la serie.
 */
const COPY = {
  es: {
    rotulo: "Libros",
    titulo: ["Lo que", "recomiendo leer."],
    narracion: (n: number) => `${n} libros, en el orden en que los recomienda.`,
    libro: "Libro",
    fin: "Fin de los libros",
    siguiente: "Sigue en la serie",
    volver: "Volver a la serie",
    sigue: (nombre: string) => `En la serie sigue el ${nombre.toLowerCase()}.`,
  },
  en: {
    rotulo: "Books",
    titulo: ["What I", "recommend reading."],
    narracion: (n: number) => `${n} books, in the order he recommends them.`,
    libro: "Book",
    fin: "End of the books",
    siguiente: "Next in the series",
    volver: "Back to the series",
    sigue: (nombre: string) => `Next in the series: ${nombre.toLowerCase()}.`,
  },
} as const satisfies Record<Idioma, unknown>;

/**
 * Lo que digo yo de cada libro, por slug: para quién es o cuándo leerlo. En la
 * librería el narrador habla en primera persona, porque la recomendación es
 * mía; la idea del libro la dice la escena y aquí no se repite.
 */
const NARRADOR: Record<Idioma, Readonly<Record<string, string>>> = {
  es: {
    "the-goal": "Si va a leer uno solo, empiece por este. Se lee como una novela, porque lo es.",
    "the-phoenix-project": "Se lo recomiendo si trabaja en un equipo de software: va a reconocer a más de un personaje.",
    "fundamentals-of-software-architecture": "Léalo cuando le toque decidir cómo se parte un sistema y no solo cómo se escribe.",
    "a-philosophy-of-software-design": "Léalo pronto: es corto y lo va a aplicar en el código de mañana.",
    "designing-data-intensive-applications": "Después de Fundamentals, este baja a donde de verdad se rompen los sistemas: los datos.",
    "software-engineering-at-google": "Se lo recomiendo si dirige un equipo: le pone nombre a problemas que ya tiene.",
    "crisis-engineering": "Téngalo a mano antes de que un proyecto se ponga en rojo, no después.",
    "the-infinity-machine": "Si trabaja con IA, le muestra de dónde viene una parte de lo que usa hoy.",
    "ai-for-good": "Léalo cuando la conversación sobre IA se le vuelva abstracta.",
    "ai-engineering": "De todo lo que hay sobre IA aplicada, es el que yo tendría en el escritorio.",
    "learning-domain-driven-design": "Léalo antes de partir un sistema grande en módulos, no después.",
    "effective-typescript": "Si escribe TypeScript todos los días, este se paga en una semana.",
    "web-application-security": "Para cuando su aplicación ya tiene usuarios y vale la pena atacarla.",
    "how-great-ideas-happen": "Lo dejo para el final: después de todos los demás, ayuda a elegir qué construir.",
  },
  en: {
    "the-goal": "If you only read one, start here. It reads like a novel, because it is one.",
    "the-phoenix-project": "Read it if you work on a software team: you'll recognize more than one character.",
    "fundamentals-of-software-architecture": "Read it when you have to decide how a system is split up, not just how it's written.",
    "a-philosophy-of-software-design": "Read it early: it's short and you'll apply it to tomorrow's code.",
    "designing-data-intensive-applications": "After Fundamentals, this goes down to where systems actually break: the data.",
    "software-engineering-at-google": "Read it if you lead a team: it puts names to problems you already have.",
    "crisis-engineering": "Keep it close before a project goes red, not after.",
    "the-infinity-machine": "If you work with AI, it shows where part of what you use today came from.",
    "ai-for-good": "Read it when the conversation about AI starts to feel abstract.",
    "ai-engineering": "Of everything on applied AI, it's the one I'd keep on my desk.",
    "learning-domain-driven-design": "Read it before you split a large system into modules, not after.",
    "effective-typescript": "If you write TypeScript every day, this one pays for itself in a week.",
    "web-application-security": "For when your app has users and is worth attacking.",
    "how-great-ideas-happen": "I leave it for last: after all the others, it helps you choose what to build.",
  },
};

const lineas = (idioma: Idioma, id: string, textos: readonly string[]): readonly Linea[] =>
  textos.map((texto, i) => ({ id: `${idioma === "es" ? "" : "en-"}libros-${id}-${i}`, texto }));

/** Un libro nuevo en contenido.ts sin su línea corta el build: no sale mudo. */
function narracionDe(idioma: Idioma, slug: string): string {
  const linea = NARRADOR[idioma][slug];
  if (!linea) throw new Error(`Falta la línea del narrador para «${slug}» en libros.ts.`);
  return linea;
}

interface Entrada {
  readonly idioma: Idioma;
  /** Las portadas ya optimizadas por `getImage`, por slug de libro. */
  readonly portadas: ReadonlyMap<string, Imagen>;
}

export function construirLibros({ idioma, portadas }: Entrada): readonly Escena[] {
  const c = COPY[idioma];
  const t = TEXTOS[idioma];
  const total = String(LIBROS.length).padStart(2, "0");

  return [
    {
      tipo: "titulo",
      id: "titulo",
      largo: 140,
      tono: "invertido",
      rotulo: c.rotulo,
      cabecera: t.libros.titulo,
      titulo: c.titulo,
      pie: t.libros.bajada,
      narracion: lineas(idioma, "titulo", [c.narracion(LIBROS.length)]),
    },
    ...LIBROS.map((libro, i): Escena => {
      const portada = portadas.get(libro.slug);
      if (!portada) throw new Error(`Falta la portada de «${libro.titulo}».`);
      return {
        tipo: "libro",
        id: libro.slug,
        largo: 140,
        tono: "claro",
        rotulo: `${c.libro} ${String(i + 1).padStart(2, "0")} / ${total}`,
        titulo: libro.titulo,
        autor: libro.autor,
        anio: libro.anio,
        porQue: enIdioma(libro.porQue, idioma),
        portada,
        narracion: lineas(idioma, libro.slug, [narracionDe(idioma, libro.slug)]),
      };
    }),
    {
      tipo: "salida",
      id: "salida",
      largo: 150,
      tono: "invertido",
      rotulo: c.fin,
      // En la serie, después de los libros viene el ajedrez.
      siguiente: { antetitulo: c.siguiente, nombre: t.ajedrez.titulo, href: rutaDe(idioma, "#ep7-ajedrez") },
      volver: { texto: c.volver, href: rutasSerie(idioma).libros, externo: false },
      narracion: lineas(idioma, "salida", [c.sigue(t.ajedrez.titulo)]),
    },
  ];
}
