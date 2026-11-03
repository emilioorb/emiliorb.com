import type { Idioma } from "../../i18n/ui";

/**
 * El guion de «Episodios» como datos. Agregar un episodio es agregar escenas a
 * la lista de `guion.ts`; un tipo de escena nuevo pide además su dibujo
 * (`Escenas.tsx`) y su coreografía (`coreografias.ts`), y nada más.
 */


/** Una línea del narrador; el id evita anunciar dos veces la misma. */
export interface Linea {
  readonly id: string;
  readonly texto: string;
}

interface Comun {
  readonly id: string;
  /** Recorrido de scroll de la escena, en `svh`. Por encima de 100 es tiempo fijada. */
  readonly largo: number;
  /** `invertido`: tinta de fondo, como las tarjetas de título del anime. */
  readonly tono: "claro" | "invertido";
  /** Una línea por tiempo de la escena; la mayoría tiene una sola. */
  readonly narracion: readonly Linea[];
}

export interface EscenaApertura extends Comun {
  readonly tipo: "apertura";
  readonly nombre: string;
  readonly rol: string;
  readonly invitacion: string;
  /** El botón que pone la serie en pantalla completa. */
  readonly cine: string;
}

export interface EscenaTitulo extends Comun {
  readonly tipo: "titulo";
  /** Lo que va sobre el título: «Episodio 1», «Proyecto 01 / 07». */
  readonly rotulo: string;
  /** Lo que dice la cabecera de la serie desde esta tarjeta en adelante. */
  readonly cabecera: string;
  /** En renglones: el corte de línea es parte del diseño de la tarjeta. */
  readonly titulo: readonly string[];
  readonly pie: string;
}

export interface Paso {
  readonly texto: string;
  /** El último paso es la idea de la escena y se dibuja más grande. */
  readonly remate: boolean;
}

export interface EscenaEtapa extends Comun {
  readonly tipo: "etapa";
  readonly empresa: string;
  readonly periodo: string;
  /** Puede ir vacía: no todas las etapas se cuentan por países. */
  readonly lugares: readonly string[];
  readonly contexto: string;
  readonly pasos: readonly Paso[];
}

export interface Enlace {
  readonly texto: string;
  readonly href: string;
  /** Sale del sitio: abre en otra pestaña y lo dice. */
  readonly externo: boolean;
}

export interface Imagen {
  readonly src: string;
  readonly ancho: number;
  readonly alto: number;
  readonly alt: string;
}

/** Una cosa que pasa por la pasarela: un proyecto, un paper, una nota de prensa. */
export interface ItemPasarela {
  readonly id: string;
  readonly rotulo: string;
  readonly titulo: string;
  /** El idioma del título cuando no es el de la página (los papers van en inglés). */
  readonly idiomaTitulo: Idioma | null;
  readonly linea: string | null;
  readonly meta: string | null;
  readonly enlaces: readonly Enlace[];
}

/** Varias cosas, una a la vez: cada una ocupa la pantalla en su tiempo. */
export interface EscenaPasarela extends Comun {
  readonly tipo: "pasarela";
  readonly encabezado: string;
  readonly items: readonly ItemPasarela[];
}

export interface LibroEnEstante {
  readonly slug: string;
  readonly titulo: string;
  readonly autor: string;
  readonly anio: string;
  readonly portada: Imagen;
}

export interface EscenaEstante extends Comun {
  readonly tipo: "estante";
  readonly encabezado: string;
  readonly libros: readonly LibroEnEstante[];
  /** El primero de la lista, que es por donde recomiendo empezar. */
  readonly destacado: { readonly rotulo: string; readonly porQue: string };
  readonly enlace: Enlace;
}

/** Una partida reciente, resuelta en el build: el cliente no consulta chess.com. */
export interface PartidaEnEscena {
  /** Las 64 casillas ya vistas desde mi lado, con la letra FEN o `null`. */
  readonly casillas: readonly (string | null)[];
  readonly resumen: string;
  readonly enlace: Enlace;
}

export interface EscenaAjedrez extends Comun {
  readonly tipo: "ajedrez";
  readonly encabezado: string;
  readonly frase: string;
  readonly partida: PartidaEnEscena | null;
  /** «Rápidas 1234 · Mejor 1300», o `null` si chess.com no respondió. */
  readonly cifras: string | null;
  readonly perfil: Enlace;
}

/** «Próximo episodio»: el cierre y el contacto. */
export interface EscenaCierre extends Comun {
  readonly tipo: "cierre";
  readonly rotulo: string;
  readonly pregunta: string;
  readonly correo: string;
  readonly respuesta: string;
  readonly redes: readonly Enlace[];
}

/** Una sola idea en texto grande, con sus enlaces si los tiene: el resumen, el problema. */
export interface EscenaSintesis extends Comun {
  readonly tipo: "sintesis";
  readonly rotulo: string;
  readonly texto: string;
  readonly enlaces: readonly Enlace[];
}

/** Los resultados uno tras otro, y debajo con qué se hizo. */
export interface EscenaBalance extends Comun {
  readonly tipo: "balance";
  readonly rotulo: string;
  readonly resultados: readonly string[];
  readonly rotuloStack: string;
  readonly stack: readonly string[];
}

/** El final de una ficha: el proyecto que sigue y la vuelta a la serie. */
export interface EscenaSalida extends Comun {
  readonly tipo: "salida";
  readonly rotulo: string;
  readonly siguiente: { readonly antetitulo: string; readonly nombre: string; readonly href: string };
  readonly volver: Enlace;
}

export type Escena =
  | EscenaApertura
  | EscenaTitulo
  | EscenaEtapa
  | EscenaPasarela
  | EscenaEstante
  | EscenaAjedrez
  | EscenaCierre
  | EscenaSintesis
  | EscenaBalance
  | EscenaSalida;

/**
 * Quién pone las palabras del narrador. Hoy es el guion fijo; más adelante
 * puede ser un modelo que además responda preguntas, sin que los subtítulos
 * cambien: ellos solo muestran la `Linea` que reciben.
 */
export interface FuenteNarrador {
  /** `tiempo` es el índice del tiempo dentro de la escena. */
  linea(escena: Escena, tiempo: number): Linea | null;
}
