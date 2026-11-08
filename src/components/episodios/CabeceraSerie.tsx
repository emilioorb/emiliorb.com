import type { TextosSerie } from "../../i18n/ui";
import { useRef } from "react";
import type { EntradaIndice, Escena } from "../../lib/episodios/tipos";

interface Props {
  /** «Episodio 2 · Sin señal», el nombre de una página, o `null` en la apertura. */
  rotulo: string | null;
  /** El tono de la escena activa: sobre una tarjeta invertida, la cabecera se invierte con ella. */
  tono: Escena["tono"];
  rutas: RutasSerie;
  /** Los episodios del menú que abre el rótulo. */
  indice: readonly EntradaIndice[];
  /** El id de la tarjeta del episodio en curso, si la escena está dentro de uno. */
  actual?: string;
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
  /**
   * En una página suelta, la escena de la serie que la cuenta. El nombre lleva
   * al inicio de todo; esto devuelve a donde estaba el visitante.
   */
  readonly volver?: string;
}

/**
 * La cabecera de la serie: su nombre, el episodio en curso, el otro idioma y
 * el contacto. Siempre a la vista; solo el modo cine la apaga. Esconderla según
 * la dirección del scroll se sentía al azar con el scroll suavizado.
 */
export function CabeceraSerie({ rotulo, tono, rutas, indice, actual, textos, conFondo = false }: Props) {
  const { corto, etiqueta } = textos.otroIdioma;
  const codigo = corto.toLowerCase();
  const menu = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  // Un ancla de la misma página no cierra el popover; y si ya es la de la URL,
  // tampoco hay hashchange: se avisa a mano para que la serie aterrice igual.
  const alElegir = (evento: React.MouseEvent<HTMLAnchorElement>) => {
    menu.current?.hidePopover();
    const destino = new URL(evento.currentTarget.href);
    if (destino.pathname === location.pathname && destino.hash === location.hash) {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };

  // Las flechas recorren la lista, como en un menú del sistema.
  const alTeclear = (evento: React.KeyboardEvent<HTMLDivElement>) => {
    const paso = evento.key === "ArrowDown" ? 1 : evento.key === "ArrowUp" ? -1 : 0;
    if (!paso) return;
    evento.preventDefault();
    const enlaces = Array.from(evento.currentTarget.querySelectorAll<HTMLAnchorElement>("a"));
    const i = enlaces.indexOf(document.activeElement as HTMLAnchorElement);
    enlaces.at((i + paso) % enlaces.length)?.focus();
  };

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
      {/* El rótulo del episodio es también el menú: no suma nada a la fila. */}
      <button ref={boton} type="button" className="cabecera-serie__episodio" popoverTarget="indice-serie">
        <span className="cabecera-serie__rotulo">{rotulo ?? textos.indice.corto}</span>
        <span className="cabecera-serie__corto">{textos.indice.corto}</span>
        {/* SVG y no «▾»: Geist no trae el glifo y caía en un punto de otra fuente. */}
        <svg className="cabecera-serie__flecha" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        ref={menu}
        id="indice-serie"
        className="cabecera-serie__indice"
        popover="auto"
        onKeyDown={alTeclear}
        // Antes de pintarse: se ubica bajo el centro del rótulo, donde esté hoy.
        onBeforeToggle={(evento) => {
          const rotuloEn = boton.current?.getBoundingClientRect();
          if (evento.newState === "open" && rotuloEn) {
            evento.currentTarget.style.setProperty("--indice-x", `${rotuloEn.left + rotuloEn.width / 2}px`);
          }
        }}
        onToggle={(evento) => {
          if (evento.newState === "open") evento.currentTarget.querySelector<HTMLAnchorElement>("[aria-current]")?.focus();
        }}
      >
        <nav aria-label={textos.indice.etiqueta}>
          <ol>
            {indice.map((entrada) => (
              <li key={entrada.id}>
                <a
                  href={entrada.href}
                  aria-current={entrada.id === actual ? "step" : undefined}
                  onClick={alElegir}
                >
                  <span className="cabecera-serie__numero">{entrada.numero}</span>
                  {entrada.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="cabecera-serie__derecha">
        {rutas.volver && (
          <a className="cabecera-serie__volver" href={rutas.volver} aria-label={textos.volver.etiqueta}>
            <span aria-hidden="true">← </span>
            {textos.volver.corto}
          </a>
        )}
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
