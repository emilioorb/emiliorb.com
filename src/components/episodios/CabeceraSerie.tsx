import type { TextosSerie } from "../../i18n/ui";
import type { Escena } from "../../lib/episodios/tipos";

interface Props {
  /** «Episodio 2 · Sin señal», el nombre de una página, o `null` en la apertura. */
  rotulo: string | null;
  /** El tono de la escena activa: sobre una tarjeta invertida, la cabecera se invierte con ella. */
  tono: Escena["tono"];
  rutas: RutasSerie;
  textos: TextosSerie;
  /** En las páginas de lectura el texto pasa por debajo: la cabecera lleva fondo. */
  conFondo?: boolean;
}

export interface RutasSerie {
  /** La portada en este idioma; en la portada misma, el ancla de la apertura. */
  readonly inicio: string;
  readonly contacto: string;
  /** Esta misma página en el otro idioma. */
  readonly otroIdioma: string;
}

/**
 * La cabecera de la serie: su nombre, el episodio en curso, el otro idioma y
 * el contacto. Siempre a la vista; solo el modo cine la apaga. Esconderla según
 * la dirección del scroll se sentía al azar con el scroll suavizado.
 */
export function CabeceraSerie({ rotulo, tono, rutas, textos, conFondo = false }: Props) {
  const { corto, etiqueta } = textos.otroIdioma;
  const codigo = corto.toLowerCase();
  return (
    <header className="cabecera-serie" data-tono={tono} data-con-fondo={conFondo || undefined}>
      {/* En la apertura el nombre ya está en grande y todavía no empezó ningún
          episodio. Los huecos mantienen la fila en su lugar. */}
      {rotulo ? (
        <a className="cabecera-serie__nombre" href={rutas.inicio} aria-label={textos.alInicio}>
          Emilio Rodríguez
        </a>
      ) : (
        <span aria-hidden="true" />
      )}
      <p className="cabecera-serie__episodio">{rotulo}</p>
      <div className="cabecera-serie__derecha">
        <a className="cabecera-serie__idioma" href={rutas.otroIdioma} hrefLang={codigo} lang={codigo} aria-label={etiqueta}>
          {corto}
        </a>
        <a className="cabecera-serie__contacto" href={rutas.contacto}>
          {textos.contacto}
        </a>
      </div>
    </header>
  );
}
