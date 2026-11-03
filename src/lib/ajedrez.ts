import { z } from "astro/zod";

/** Lectura de la API pública de chess.com: no pide clave y responde con CORS abierto. */

const API = "https://api.chess.com/pub/player";
const PARTIDAS_RECIENTES = 10;
const PUNTOS_HISTORIAL = 120;

// chess.com omite la clave de un ritmo en el que nunca se jugó; por eso todo es opcional.
const ritmoSchema = z.object({
  last: z.object({ rating: z.number().int() }),
  best: z.object({ rating: z.number().int() }).optional(),
  record: z.object({
    win: z.number().int().nonnegative(),
    loss: z.number().int().nonnegative(),
    draw: z.number().int().nonnegative(),
  }),
});

const statsSchema = z.object({
  chess_rapid: ritmoSchema.optional(),
  chess_blitz: ritmoSchema.optional(),
  tactics: z.object({ highest: z.object({ rating: z.number().int() }).optional() }).optional(),
});

const archivosSchema = z.object({ archives: z.array(z.string()) });

const jugadorSchema = z.object({
  username: z.string(),
  result: z.string(),
  rating: z.number().int(),
});

const mesSchema = z.object({
  games: z.array(
    z.object({
      url: z.string(),
      end_time: z.number().int(),
      time_class: z.string(),
      fen: z.string(),
      eco: z.string().optional(),
      white: jugadorSchema,
      black: jugadorSchema,
    }),
  ),
});

export type Resultado = "ganada" | "tablas" | "perdida";

/** Cómo terminó la partida, con nombre propio en vez del código de chess.com. */
export const FINALES = [
  "jaque-mate",
  "rendicion",
  "tiempo",
  "abandono",
  "acuerdo",
  "repeticion",
  "ahogado",
  "material-insuficiente",
  "cincuenta-movimientos",
  "tiempo-sin-material",
  "otro",
] as const;
export type Final = (typeof FINALES)[number];

const FINAL_POR_CODIGO: Record<string, Final> = {
  checkmated: "jaque-mate",
  resigned: "rendicion",
  timeout: "tiempo",
  abandoned: "abandono",
  agreed: "acuerdo",
  repetition: "repeticion",
  stalemate: "ahogado",
  insufficient: "material-insuficiente",
  "50move": "cincuenta-movimientos",
  timevsinsufficient: "tiempo-sin-material",
};

const RESULTADOS_TABLAS = new Set([
  "agreed",
  "repetition",
  "stalemate",
  "insufficient",
  "50move",
  "timevsinsufficient",
]);

export interface Ritmo {
  readonly actual: number;
  readonly mejor: number | null;
  readonly ganadas: number;
  readonly perdidas: number;
  readonly tablas: number;
}

export interface Partida {
  readonly url: string;
  /** Segundos Unix, como los da chess.com. */
  readonly fin: number;
  readonly resultado: Resultado;
  readonly final: Final;
  readonly jugueConBlancas: boolean;
  /** Solo la parte del tablero del FEN: la posición final. */
  readonly posicion: string;
  readonly rival: string;
  readonly ratingRival: number;
  /** Mi rating después de la partida. */
  readonly miRating: number;
  readonly esRapida: boolean;
  /** En inglés, como la nombra chess.com. */
  readonly apertura: string | null;
}

export interface PuntoRating {
  readonly fin: number;
  readonly rating: number;
}

export interface Ajedrez {
  readonly rapida: Ritmo | null;
  readonly blitz: Ritmo | null;
  readonly tacticasMax: number | null;
  /** De la más vieja a la más nueva. */
  readonly recientes: readonly Partida[];
  /** Rating de rápidas tras cada partida, de la más vieja a la más nueva. */
  readonly historial: readonly PuntoRating[];
}

/**
 * Que chess.com no responda es un caso esperado (ERR-1): la página se
 * construye y se ve igual, con el enlace al perfil en vez de las cifras.
 */
export type ResultadoAjedrez =
  | { readonly ok: true; readonly datos: Ajedrez }
  | { readonly ok: false; readonly motivo: "sin-respuesta" | "respuesta-invalida" };

type Lectura<T> = { ok: true; datos: T } | { ok: false; motivo: "sin-respuesta" | "respuesta-invalida" };

async function leer<T>(url: string, schema: z.ZodType<T>): Promise<Lectura<T>> {
  let respuesta: Response;
  try {
    respuesta = await fetch(url);
  } catch {
    // Red caída o petición abortada: es el caso "sin-respuesta" y se informa como tal.
    return { ok: false, motivo: "sin-respuesta" };
  }
  if (!respuesta.ok) return { ok: false, motivo: "sin-respuesta" };
  const leido = schema.safeParse(await respuesta.json().catch(() => null));
  return leido.success ? { ok: true, datos: leido.data } : { ok: false, motivo: "respuesta-invalida" };
}

function aRitmo(crudo: z.infer<typeof ritmoSchema> | undefined): Ritmo | null {
  if (!crudo) return null;
  return {
    actual: crudo.last.rating,
    mejor: crudo.best?.rating ?? null,
    ganadas: crudo.record.win,
    perdidas: crudo.record.loss,
    tablas: crudo.record.draw,
  };
}

function aResultado(codigo: string): Resultado {
  if (codigo === "win") return "ganada";
  return RESULTADOS_TABLAS.has(codigo) ? "tablas" : "perdida";
}

/** "…/openings/Sicilian-Defense-Staunton-Cochrane-Variation-2...e6" → "Sicilian Defense Staunton Cochrane Variation". */
function nombreApertura(eco: string | undefined): string | null {
  const tramo = eco?.split("/openings/")[1];
  if (!tramo) return null;
  const sinJugadas = tramo.split(/-\d/)[0] ?? tramo;
  return decodeURIComponent(sinJugadas).replaceAll("-", " ");
}

type JuegoCrudo = z.infer<typeof mesSchema>["games"][number];

function aPartida(juego: JuegoCrudo, usuario: string): Partida {
  const jugueConBlancas = juego.white.username.toLowerCase() === usuario.toLowerCase();
  const yo = jugueConBlancas ? juego.white : juego.black;
  const rival = jugueConBlancas ? juego.black : juego.white;
  const resultado = aResultado(yo.result);
  // El código que dice cómo terminó lo lleva quien no ganó.
  const codigoFinal = resultado === "ganada" ? rival.result : yo.result;
  return {
    url: juego.url,
    fin: juego.end_time,
    resultado,
    final: FINAL_POR_CODIGO[codigoFinal] ?? "otro",
    jugueConBlancas,
    posicion: juego.fen.split(" ")[0] ?? "",
    rival: rival.username,
    ratingRival: rival.rating,
    miRating: yo.rating,
    esRapida: juego.time_class === "rapid",
    apertura: nombreApertura(juego.eco),
  };
}

const PIEZAS_FEN = new Set(["K", "Q", "R", "B", "N", "P", "k", "q", "r", "b", "n", "p"]);

/**
 * Las 64 casillas desde a8 hasta h1, con la letra FEN de la pieza o `null`.
 * Devuelve `null` si la posición no es un FEN válido, para no pintar un tablero roto.
 */
export function casillasDesdeFen(posicion: string): readonly (string | null)[] | null {
  const filas = posicion.split("/");
  if (filas.length !== 8) return null;
  const casillas: (string | null)[] = [];
  for (const fila of filas) {
    let ancho = 0;
    for (const caracter of fila) {
      const vacias = Number(caracter);
      if (Number.isInteger(vacias) && vacias >= 1 && vacias <= 8) {
        casillas.push(...Array<null>(vacias).fill(null));
        ancho += vacias;
      } else if (PIEZAS_FEN.has(caracter)) {
        casillas.push(caracter);
        ancho += 1;
      } else {
        return null;
      }
    }
    if (ancho !== 8) return null;
  }
  return casillas;
}

function porFinYUrl(partidas: readonly Partida[]): Partida[] {
  const unicas = new Map(partidas.map((partida) => [partida.url, partida]));
  return [...unicas.values()].toSorted((a, b) => a.fin - b.fin);
}

function historialDe(partidas: readonly Partida[]): PuntoRating[] {
  return partidas
    .filter((partida) => partida.esRapida)
    .map((partida) => ({ fin: partida.fin, rating: partida.miRating }))
    .slice(-PUNTOS_HISTORIAL);
}

/**
 * Las partidas de los últimos `meses` archivos. Si esta parte falla, se
 * devuelve vacía: las estadísticas valen solas.
 */
async function traerPartidas(usuario: string, meses: number): Promise<Partida[]> {
  const archivos = await leer(`${API}/${usuario}/games/archives`, archivosSchema);
  if (!archivos.ok) return [];
  const lecturas = await Promise.all(
    archivos.datos.archives.slice(-meses).map((mes) => leer(mes, mesSchema)),
  );
  const partidas = lecturas.flatMap((lectura) =>
    lectura.ok ? lectura.datos.games.map((juego) => aPartida(juego, usuario)) : [],
  );
  return porFinYUrl(partidas);
}

export const urlPerfil = (usuario: string) => `https://www.chess.com/member/${usuario}`;

interface OpcionesLectura {
  /**
   * Cuántos meses de partidas leer. Se lee en el build: un mes activo pesa
   * más de 1 MB, y la serie solo necesita la última partida.
   */
  readonly meses: number;
}

export async function traerAjedrez(usuario: string, opciones: OpcionesLectura): Promise<ResultadoAjedrez> {
  const [stats, partidas] = await Promise.all([
    leer(`${API}/${usuario}/stats`, statsSchema),
    traerPartidas(usuario, opciones.meses),
  ]);
  if (!stats.ok) return stats;

  return {
    ok: true,
    datos: {
      rapida: aRitmo(stats.datos.chess_rapid),
      blitz: aRitmo(stats.datos.chess_blitz),
      tacticasMax: stats.datos.tactics?.highest?.rating ?? null,
      recientes: partidas.slice(-PARTIDAS_RECIENTES),
      historial: historialDe(partidas),
    },
  };
}
