import { getImage } from "astro:assets";
import type { Idioma } from "../../i18n/ui";
import { LIBROS, USUARIO_CHESS } from "../../data/contenido";
import { traerAjedrez } from "../ajedrez";
import { construirGuion, partidaDe } from "./guion";
import { construirLibros } from "./libros";
import type { Escena, Imagen } from "./tipos";

// Al doble del ancho mayor en que se dibujan en el estante, para pantallas densas.
const ANCHO_PORTADA = 320;

const ALT_PORTADA: Record<Idioma, (titulo: string, autor: string) => string> = {
  es: (titulo, autor) => `Portada de ${titulo}, de ${autor}`,
  en: (titulo, autor) => `Cover of ${titulo}, by ${autor}`,
};

/** Las portadas optimizadas, por slug. Sin `ancho`, al tamaño original. */
async function portadasDe(idioma: Idioma, ancho?: number): Promise<ReadonlyMap<string, Imagen>> {
  return new Map<string, Imagen>(
    await Promise.all(
      LIBROS.map(async (libro): Promise<[string, Imagen]> => {
        const final = ancho ?? libro.portada.width;
        const imagen = await getImage({ src: libro.portada, width: final, format: "webp" });
        return [
          libro.slug,
          {
            src: imagen.src,
            ancho: final,
            alto: Math.round((final * libro.portada.height) / libro.portada.width),
            alt: ALT_PORTADA[idioma](libro.titulo, libro.autor),
          },
        ];
      }),
    ),
  );
}

/**
 * El guion con lo que solo se resuelve en el servidor: las portadas
 * optimizadas y la partida de chess.com.
 */
export async function cargarGuion(idioma: Idioma): Promise<readonly Escena[]> {
  const portadas = await portadasDe(idioma, ANCHO_PORTADA);

  // Dos meses y no uno: al empezar el mes, el actual puede no tener partidas.
  const ajedrez = await traerAjedrez(USUARIO_CHESS, { meses: 2 });
  if (!ajedrez.ok) console.warn(`[episodios] chess.com: ${ajedrez.motivo}; la escena sale sin tablero.`);

  return construirGuion({ idioma, portadas, ajedrez: partidaDe(ajedrez, idioma), usuarioChess: USUARIO_CHESS });
}

/**
 * La librería. Cada portada ocupa media pantalla: va al tamaño original
 * (~330 px), que es lo más grande que existe.
 */
export async function cargarLibros(idioma: Idioma): Promise<readonly Escena[]> {
  return construirLibros({ idioma, portadas: await portadasDe(idioma) });
}
