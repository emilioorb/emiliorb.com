import { rutaDe, rutasProyecto, type Idioma } from "../../i18n/ui";

/** La ficha de un proyecto en ese idioma. */
export const rutaFicha = (slug: string, idioma: Idioma) => rutasProyecto(slug)[idioma];

/** A dónde llevan la cabecera y el cierre de una ficha: de vuelta a la serie. */
export const rutasSerie = (idioma: Idioma) => ({
  inicio: rutaDe(idioma),
  contacto: rutaDe(idioma, "#proximo"),
  proyectos: rutaDe(idioma, "#ep5-proyectos"),
  lectura: rutaDe(idioma, "#ep6-lectura"),
  libros: rutaDe(idioma, "#ep7-libros"),
});
