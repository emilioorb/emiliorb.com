import { Fragment, useEffect, useRef, useState } from "react";
import type { Escena, Linea } from "../../lib/episodios/tipos";

/**
 * Ritmo de la máquina de escribir: 26 ms por letra son unas 38 por segundo, un poco
 * más rápido que la lectura, para que el texto nunca haga esperar a quien lee.
 */
const MS_POR_LETRA = 26;

interface Props {
  linea: Linea | null;
  /** El de la escena en pantalla: sobre una tarjeta invertida, el subtítulo se invierte. */
  tono: Escena["tono"];
}

/**
 * Los subtítulos del narrador. Lo visible va oculto al lector de pantalla y
 * el anuncio va aparte, una sola vez por línea: subir y bajar por la misma
 * escena no repite lo que ya se dijo.
 */
export function Subtitulos({ linea, tono }: Props) {
  const anunciadas = useRef(new Set<string>());
  const [anuncio, setAnuncio] = useState("");

  useEffect(() => {
    if (!linea || anunciadas.current.has(linea.id)) return;
    anunciadas.current.add(linea.id);
    setAnuncio(linea.texto);
  }, [linea]);

  return (
    <>
      <div className="subtitulos" data-tono={tono} aria-hidden="true">
        {linea && (
          <p key={linea.id} className="subtitulos__linea">
            <Escrito texto={linea.texto} />
          </p>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
    </>
  );
}

/**
 * La línea se escribe letra por letra. Todas las letras ocupan su lugar desde el
 * inicio y solo cambian de opacidad: el texto no salta de renglón mientras aparece.
 * Cada palabra va entera en un `span` para que el corte de línea caiga entre palabras.
 */
function Escrito({ texto }: { texto: string }) {
  let indice = 0;
  const palabras = texto.split(" ");
  return palabras.map((palabra, p) => {
    const inicio = indice;
    indice += palabra.length + 1;
    // El espacio va fuera del `span` de la palabra: dentro, con `nowrap`, el renglón
    // no tenía dónde cortarse y la línea se salía de la caja.
    return (
      <Fragment key={`${p}-${palabra}`}>
        <span className="subtitulos__palabra">
          {[...palabra].map((letra, l) => (
            <span key={`${l}-${letra}`} className="subtitulos__letra" style={{ animationDelay: `${(inicio + l) * MS_POR_LETRA}ms` }}>
              {letra}
            </span>
          ))}
        </span>
        {p < palabras.length - 1 ? " " : null}
      </Fragment>
    );
  });
}
