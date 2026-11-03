import { getImage } from "astro:assets";
import type { Idioma } from "../../i18n/ui";
import { LIBROS, USUARIO_CHESS } from "../../data/contenido";
import { traerAjedrez } from "../ajedrez";
import { construirGuion, partidaDe } from "./guion";
import type { Escena, Imagen } from "./tipos";

// Al doble del ancho mayor en que se dibujan, para pantallas densas.
const ANCHO_PORTADA = 320;

const ALT_PORTADA: Record<Idioma, (titulo: string, autor: string) => string> = {
  es: (titulo, autor) => `Portada de ${titulo}, de ${autor}`,
  en: (titulo, autor) => `Cover of ${titulo}, by ${autor}`,
};

/**
 * El guion con lo que solo se resuelve en el servidor: las portadas
 * optimizadas y la partida de chess.com. La página y el endpoint del
 * narrador lo arman igual, así las líneas grabadas son las que se ven.
 */
export async function cargarGuion(idioma: Idioma): Promise<readonly Escena[]> {
  const portadas = new Map<string, Imagen>(
    await Promise.all(
      LIBROS.map(async (libro): Promise<[string, Imagen]> => {
        const imagen = await getImage({ src: libro.portada, width: ANCHO_PORTADA, format: "webp" });
        return [
          libro.slug,
          {
            src: imagen.src,
            ancho: ANCHO_PORTADA,
            alto: Math.round((ANCHO_PORTADA * libro.portada.height) / libro.portada.width),
            alt: ALT_PORTADA[idioma](libro.titulo, libro.autor),
          },
        ];
      }),
    ),
  );

  // Dos meses y no uno: al empezar el mes, el actual puede no tener partidas.
  const ajedrez = await traerAjedrez(USUARIO_CHESS, { meses: 2 });
  if (!ajedrez.ok) console.warn(`[episodios] chess.com: ${ajedrez.motivo}; la escena sale sin tablero.`);

  return construirGuion({ idioma, portadas, ajedrez: partidaDe(ajedrez, idioma), usuarioChess: USUARIO_CHESS });
}
