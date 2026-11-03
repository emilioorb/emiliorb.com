import type {
  Enlace,
  Escena,
  EscenaAjedrez,
  EscenaApertura,
  EscenaCierre,
  EscenaEstante,
  EscenaEtapa,
  EscenaBalance,
  EscenaPasarela,
  EscenaSalida,
  EscenaLibro,
  EscenaSintesis,
  EscenaTitulo,
} from "../../lib/episodios/tipos";
import { createContext, useContext } from "react";
import type { TextosSerie } from "../../i18n/ui";
import { BASE_PIEZA, FORMA_PIEZA } from "./piezas";

/** Los textos de la interfaz en el idioma de la página; la isla los provee. */
export const TextosEscena = createContext<TextosSerie | null>(null);

function useTextos(): TextosSerie {
  const textos = useContext(TextosEscena);
  if (!textos) throw new Error("Las escenas se dibujan dentro de <TextosEscena.Provider>.");
  return textos;
}

// Variables CSS en `style` sin forzar el tipo.
declare module "react" {
  interface CSSProperties {
    [variable: `--${string}`]: string | number;
  }
}

/** Posiciones fijas y no aleatorias: el servidor y el cliente tienen que pintar lo mismo. */
const LINEAS_VELOCIDAD = Array.from({ length: 16 }, (_, i) => ({
  top: ((i * 53 + 7) % 94) + 3,
  alto: 1 + ((i * 7) % 3),
  ancho: 30 + ((i * 29) % 60),
  izquierda: (i * 41) % 30,
}));

function Velocidad() {
  return (
    <div className="velocidad" aria-hidden="true">
      {LINEAS_VELOCIDAD.map((l, i) => (
        <span
          key={i}
          style={{ top: `${l.top}%`, height: `${l.alto}px`, width: `${l.ancho}%`, left: `${l.izquierda}%` }}
        />
      ))}
    </div>
  );
}

function Apertura({ escena }: { escena: EscenaApertura }) {
  const [nombre, ...apellidos] = escena.nombre.split(" ");
  return (
    <div className="apertura">
      <h1 className="apertura__nombre golpe">
        <span className="block">{nombre}</span>{" "}
        <span className="block apertura__apellido">{apellidos.join(" ")}</span>
      </h1>
      <p className="apertura__rol">{escena.rol}</p>
      <div className="apertura__pie">
        <p className="apertura__invitacion">
          <span className="apertura__guia" aria-hidden="true" />
          {escena.invitacion}
        </p>
        {/* La isla escucha el clic por delegación: la escena solo dibuja. */}
        <button type="button" className="apertura__cine pulsable" data-accion="cine">
          {escena.cine}
        </button>
      </div>
    </div>
  );
}

/** Un título que no cabe enorme (una palabra larga, o muchas) baja a la medida chica. */
const PALABRA_LARGA = 10;
const TITULO_LARGO_TARJETA = 16;

function Titulo({ escena }: { escena: EscenaTitulo }) {
  const texto = escena.titulo.join(" ");
  const largo =
    texto.length > TITULO_LARGO_TARJETA || texto.split(" ").some((palabra) => palabra.length > PALABRA_LARGA);
  return (
    <div className="titulo" data-largo={largo || undefined}>
      <h2 className="titulo__h">
        <span className="rotulo titulo__episodio">{escena.rotulo}</span>
        <span className="sr-only">: </span>
        <span className="titulo__texto golpe">
          {escena.titulo.map((renglon, i) => (
            <span key={i} className="block">
              {renglon}{" "}
            </span>
          ))}
        </span>
      </h2>
      <p className="titulo__pie">{escena.pie}</p>
    </div>
  );
}

function Etapa({ escena }: { escena: EscenaEtapa }) {
  return (
    <div className="etapa">
      <div className="etapa__cabeza">
        <h3 className="rotulo etapa__meta">
          {escena.empresa} <span aria-hidden="true">·</span> {escena.periodo}
        </h3>
        {escena.lugares.length > 0 && <p className="etapa__lugares">{escena.lugares.join(" · ")}</p>}
        <p className="etapa__contexto">{escena.contexto}</p>
      </div>
      <ol className="etapa__pasos">
        {escena.pasos.map((paso, i) => (
          <li key={paso.texto} className="paso" data-tiempo data-remate={paso.remate || undefined}>
            <span className="paso__num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="paso__texto">{paso.texto}</span>
            <span className="paso__raya" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}

function Vinculo({ enlace }: { enlace: Enlace }) {
  const { nuevaPestana } = useTextos();
  return enlace.externo ? (
    <a className="vinculo" href={enlace.href} target="_blank" rel="noopener noreferrer">
      <span className="vinculo__texto">{enlace.texto}</span>
      <span aria-hidden="true">↗</span>
      <span className="sr-only"> {nuevaPestana}</span>
    </a>
  ) : (
    <a className="vinculo" href={enlace.href}>
      <span className="vinculo__texto">{enlace.texto}</span>
      <span aria-hidden="true">→</span>
    </a>
  );
}

/** Más de esto y el título pasa a la medida chica: los titulares de prensa no caben enormes. */
const TITULO_LARGO = 42;

function Pasarela({ escena }: { escena: EscenaPasarela }) {
  return (
    <div className="pasarela">
      <div className="pasarela__cabeza">
        <h3 className="rotulo">{escena.encabezado}</h3>
        <span className="pasarela__avance" aria-hidden="true">
          <span className="pasarela__barra" style={{ "--partes": escena.items.length }} />
        </span>
      </div>
      <ol className="pasarela__items">
        {escena.items.map((item) => (
          <li key={item.id} className="item" data-tiempo data-largo={item.titulo.length > TITULO_LARGO || undefined}>
            <p className="rotulo item__rotulo">{item.rotulo}</p>
            <h4 className="item__titulo" lang={item.idiomaTitulo ?? undefined}>
              {item.titulo}
            </h4>
            {item.linea && <p className="item__linea">{item.linea}</p>}
            {item.meta && <p className="item__meta">{item.meta}</p>}
            <p className="item__enlaces">
              {item.enlaces.map((enlace) => (
                <Vinculo key={enlace.href} enlace={enlace} />
              ))}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Estante({ escena }: { escena: EscenaEstante }) {
  return (
    <div className="estante">
      <div className="estante__cabeza">
        <h3 className="rotulo">{escena.encabezado}</h3>
        <Vinculo enlace={escena.enlace} />
      </div>
      <ol className="estante__libros" data-tiempo>
        {escena.libros.map((libro, i) => (
          <li key={libro.slug} className="libro" data-primero={i === 0 || undefined}>
            <img
              src={libro.portada.src}
              width={libro.portada.ancho}
              height={libro.portada.alto}
              alt={libro.portada.alt}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ol>
      <div className="estante__destacado" data-tiempo>
        <p className="rotulo">{escena.destacado.rotulo}</p>
        <p className="estante__porque">{escena.destacado.porQue}</p>
      </div>
    </div>
  );
}

function Pieza({ fen }: { fen: string }) {
  const forma = FORMA_PIEZA[fen.toLowerCase()];
  if (!forma) return null;
  const color = fen === fen.toUpperCase() ? "blanca" : "negra";
  return (
    <svg viewBox="5 3 30 34" className={`pieza pieza--${color}`}>
      <path d={forma.cuerpo + BASE_PIEZA} />
      {forma.detalle && <path d={forma.detalle} className="pieza__detalle" />}
    </svg>
  );
}

function Ajedrez({ escena }: { escena: EscenaAjedrez }) {
  const { partida } = escena;
  return (
    <div className="ajedrez-escena" data-con-tablero={partida ? true : undefined}>
      {partida && (
        <div className="tablero" aria-hidden="true">
          {partida.casillas.map((pieza, i) => (
            <span key={i} className="casilla" data-clara={(Math.floor(i / 8) + (i % 8)) % 2 === 0 || undefined}>
              {pieza && <Pieza fen={pieza} />}
            </span>
          ))}
        </div>
      )}
      <div className="ajedrez-escena__texto">
        <h3 className="rotulo">{escena.encabezado}</h3>
        <p className="ajedrez-escena__frase">{escena.frase}</p>
        {partida && <p className="ajedrez-escena__resumen">{partida.resumen}</p>}
        {escena.cifras && <p className="ajedrez-escena__cifras">{escena.cifras}</p>}
        <p className="item__enlaces">
          {partida && <Vinculo enlace={partida.enlace} />}
          <Vinculo enlace={escena.perfil} />
        </p>
      </div>
    </div>
  );
}

function Cierre({ escena }: { escena: EscenaCierre }) {
  return (
    <div className="cierre">
      <p className="rotulo">{escena.rotulo}</p>
      <h2 className="cierre__pregunta golpe">{escena.pregunta}</h2>
      <p className="cierre__correo">
        <a href={`mailto:${escena.correo}`}>{escena.correo}</a>
      </p>
      <p className="cierre__respuesta">{escena.respuesta}</p>
      <p className="item__enlaces">
        {escena.redes.map((red) => (
          <Vinculo key={red.href} enlace={red} />
        ))}
      </p>
    </div>
  );
}

/** Más de esto y el texto pasa a la medida chica: el problema suele ser un párrafo. */
const SINTESIS_LARGA = 140;

/** Una palabra de una o dos letras («y», «de», «en») no se queda sola al final de una línea: viaja con la siguiente. */
const atarCortas = (texto: string) => texto.replace(/(^|\s)(\p{L}{1,2}) /gu, "$1$2\u00a0");

function Sintesis({ escena }: { escena: EscenaSintesis }) {
  return (
    <div className="sintesis" data-largo={escena.texto.length > SINTESIS_LARGA || undefined}>
      <h3 className="rotulo">{escena.rotulo}</h3>
      <p className="sintesis__texto">{atarCortas(escena.texto)}</p>
      {escena.enlaces.length > 0 && (
        <p className="item__enlaces">
          {escena.enlaces.map((enlace) => (
            <Vinculo key={enlace.href} enlace={enlace} />
          ))}
        </p>
      )}
    </div>
  );
}

function Balance({ escena }: { escena: EscenaBalance }) {
  const hayResultados = escena.resultados.length > 0;
  return (
    <div className="balance" data-solo-stack={hayResultados ? undefined : true}>
      {hayResultados && (
        <>
          <h3 className="rotulo">{escena.rotulo}</h3>
          <ol className="balance__resultados">
            {escena.resultados.map((resultado) => (
              <li key={resultado} className="resultado" data-tiempo>
                <span className="resultado__texto">{resultado}</span>
                <span className="resultado__raya" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </>
      )}
      <div className="balance__stack" data-tiempo={hayResultados ? undefined : true}>
        {hayResultados ? (
          <p className="rotulo">{escena.rotuloStack}</p>
        ) : (
          <h3 className="rotulo">{escena.rotuloStack}</h3>
        )}
        <ul className="balance__lista">
          {escena.stack.map((pieza) => (
            <li key={pieza}>{pieza}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Salida({ escena }: { escena: EscenaSalida }) {
  return (
    <div className="salida">
      <p className="rotulo">{escena.rotulo}</p>
      <p className="salida__antetitulo">{escena.siguiente.antetitulo}</p>
      <h2 className="salida__siguiente golpe">
        <a href={escena.siguiente.href}>
          <span className="vinculo__texto">{escena.siguiente.nombre}</span>
          <span aria-hidden="true"> →</span>
        </a>
      </h2>
      <p className="item__enlaces">
        <Vinculo enlace={escena.volver} />
      </p>
    </div>
  );
}

function Libro({ escena }: { escena: EscenaLibro }) {
  return (
    <div className="libro-escena">
      <img
        className="libro-escena__portada"
        src={escena.portada.src}
        width={escena.portada.ancho}
        height={escena.portada.alto}
        alt={escena.portada.alt}
        decoding="async"
      />
      <div className="libro-escena__texto">
        <p className="rotulo">{escena.rotulo}</p>
        <h2 className="libro-escena__titulo" lang="en">
          {escena.titulo}
        </h2>
        <p className="libro-escena__autor">
          {escena.autor} · {escena.anio}
        </p>
        <p className="libro-escena__porque">{escena.porQue}</p>
      </div>
    </div>
  );
}

function Dibujo({ escena }: { escena: Escena }) {
  switch (escena.tipo) {
    case "apertura":
      return <Apertura escena={escena} />;
    case "titulo":
      return <Titulo escena={escena} />;
    case "etapa":
      return <Etapa escena={escena} />;
    case "pasarela":
      return <Pasarela escena={escena} />;
    case "estante":
      return <Estante escena={escena} />;
    case "ajedrez":
      return <Ajedrez escena={escena} />;
    case "cierre":
      return <Cierre escena={escena} />;
    case "sintesis":
      return <Sintesis escena={escena} />;
    case "balance":
      return <Balance escena={escena} />;
    case "salida":
      return <Salida escena={escena} />;
    case "libro":
      return <Libro escena={escena} />;
    default: {
      const sinCubrir: never = escena;
      return sinCubrir;
    }
  }
}

export function EscenaEnPantalla({ escena, orden }: { escena: Escena; orden: number }) {
  return (
    <section
      id={escena.id}
      className="escena"
      data-tipo={escena.tipo}
      data-tono={escena.tono}
      style={{ "--largo": escena.largo, "--orden": orden }}
    >
      <div className="escena__lienzo">
        <Velocidad />
        <div className="escena__contenido">
          <Dibujo escena={escena} />
        </div>
      </div>
    </section>
  );
}
