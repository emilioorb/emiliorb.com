import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Subtitulos } from "../episodios/Subtitulos";

export interface LibroGaleria {
  readonly slug: string;
  readonly titulo: string;
  readonly autor: string;
  /** Solo los apellidos: lo que cabe en un lomo. */
  readonly autorLomo: string;
  readonly anio: string;
  /** Ya en el idioma de la página. */
  readonly porQue: string;
  /** Lo que dice el narrador al elegirlo, ya en el idioma de la página. */
  readonly narracion: string;
  readonly portada: {
    readonly src: string;
    readonly srcset: string;
    readonly ancho: number;
    readonly alto: number;
  };
  readonly lomo: { readonly fondo: string; readonly tinta: string };
}

export interface TextosGaleria {
  readonly anterior: string;
  readonly siguiente: string;
  /** Con `{n}` y `{total}`; solo para lector de pantalla. */
  readonly posicion: string;
  /** Una línea del narrador por libro, por slug. */
  readonly narrador: Readonly<Record<string, string>>;
}

interface Props {
  libros: readonly LibroGaleria[];
  /** El `h1` de la página y el nombre de la fila para lectores de pantalla. */
  titulo: string;
  /** Con `{titulo}` donde va el nombre del libro. */
  textoElegir: string;
  textos: Omit<TextosGaleria, "narrador">;
}

// Medidas en unidades de escena (`--u`): el elegido mide 300 de alto y el CSS
// decide cuánto vale la unidad en cada pantalla. Los de la repisa son más
// chicos, con alto y grosor que varían siempre en el mismo orden.
const ALTO_ELEGIDO = 300;
const ESCALA_REPISA = 0.62;
const ALTOS = [1, 0.94, 0.97, 0.91, 0.96, 0.93] as const;
const GROSORES = [46, 52, 42, 50, 40, 48] as const;
const HUECO_ENTRE_LOMOS = 9;
const HUECO_JUNTO_AL_ELEGIDO = 30;
/** Distancia de la cámara, la misma que usa el CSS en `perspective`. */
const PERSPECTIVA = 2400;
// Girado unos grados hacia la izquierda, el elegido muestra el canto de las
// hojas a la derecha: se lee como objeto con cuerpo y no como imagen pegada.
const GIRO_ELEGIDO = -14;
/** Cuánto sale el elegido de la fila hacia el borde de la repisa. */
const SALIDA_Z = 70;
/** Un grado de más al girar los lomos hacia la cámara: ningún canto asoma. */
const GIRO_DE_MAS = 0.6;

/** Píxeles de arrastre que equivalen a pasar un libro. */
const ARRASTRE_POR_LIBRO = 64;
/** Arrastre mínimo antes de tomarlo como gesto y no como clic. */
const UMBRAL_ARRASTRE = 6;
/** Un lance rápido pasa un libro aunque el arrastre sea corto (px/ms). */
const VELOCIDAD_LANCE = 0.11;
/** Freno al arrastrar más allá del primer o del último libro. */
const FRENO_EN_BORDE = 0.3;
const FUNDIDO_MS = 220;
/** Lo que la repisa deja libre en cada punta, en unidades. */
const MARGEN_DE_REPISA = 12;
/** Antes de medir (en el servidor) se asume una escena de escritorio. */
const VISTA_INICIAL = 520;

/**
 * La caja mide siempre lo del elegido; en la repisa se achica con `scale`, que
 * se anima junto con el giro sin tocar el layout.
 */
interface Medidas {
  readonly alto: number;
  readonly ancho: number;
  readonly grosor: number;
  readonly escala: number;
}

function medidasDe(
  libro: LibroGaleria,
  indice: number,
  esElegido: boolean,
): Medidas {
  const variacion = ALTOS[indice % ALTOS.length] ?? 1;
  return {
    alto: ALTO_ELEGIDO,
    ancho: ALTO_ELEGIDO * (libro.portada.ancho / libro.portada.alto),
    grosor: GROSORES[indice % GROSORES.length] ?? 50,
    escala: esElegido ? 1 : ESCALA_REPISA * variacion,
  };
}

/** Centro horizontal de cada libro: el elegido siempre en el cero, al centro de la repisa. */
function centrosDe(medidas: readonly Medidas[], elegido: number): number[] {
  const centros: number[] = [];
  let cursor = 0;
  medidas.forEach((medida, indice) => {
    const ocupa = anchoEnFila(medida, indice === elegido);
    centros.push(cursor + ocupa / 2);
    const juntoAlElegido = indice === elegido || indice + 1 === elegido;
    cursor +=
      ocupa + (juntoAlElegido ? HUECO_JUNTO_AL_ELEGIDO : HUECO_ENTRE_LOMOS);
  });
  const origen = centros[elegido] ?? 0;
  return centros.map((centro) => centro - origen);
}

const anchoEnFila = (medida: Medidas, esElegido: boolean) =>
  esElegido ? medida.ancho : medida.grosor * medida.escala;

const enUnidades = (valor: number) => `calc(${valor.toFixed(2)} * var(--u))`;
const enRadianes = (grados: number) => (grados * Math.PI) / 180;

function transformacionDe(
  medida: Medidas,
  centro: number,
  esElegido: boolean,
): string {
  if (esElegido) {
    const z = SALIDA_Z - medida.grosor / 2;
    return `translate3d(${enUnidades(centro)}, 0, ${enUnidades(z)}) rotateY(${GIRO_ELEGIDO}deg) ${escalaDe(1)}`;
  }
  // Cada lomo mira justo a la cámara: así no asoma ni la tapa (a la izquierda)
  // ni la contratapa (a la derecha) entre lomos.
  const haciaLaCamara =
    (Math.atan(Math.abs(centro) / PERSPECTIVA) * 180) / Math.PI + GIRO_DE_MAS;
  const giro = 90 + (centro < 0 ? haciaLaCamara : -haciaLaCamara);
  // Al girar, el lomo se aleja del centro de la caja: se compensa para que
  // caiga en su lugar de la fila y en el plano de los demás.
  const mitad = (medida.ancho * medida.escala) / 2;
  const x = centro + mitad * Math.cos(enRadianes(giro));
  const z = -mitad * Math.sin(enRadianes(giro));
  return `translate3d(${enUnidades(x)}, 0, ${enUnidades(z)}) rotateY(${giro.toFixed(2)}deg) ${escalaDe(medida.escala)}`;
}

// `scale3d` y no `scale`: `scale()` es 2D y deja el eje Z intacto. El grosor
// del lomo vive en el Z de la caja (gira 90° después de escalarse), así que
// con `scale()` el lomo conservaba su grosor entero mientras la fila lo
// espaciaba achicado, y los lomos vecinos se pisaban.
const escalaDe = (escala: number) => {
  const valor = escala.toFixed(3);
  return `scale3d(${valor}, ${valor}, ${valor})`;
};

function suscribirMovimiento(avisar: () => void) {
  const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}

function useMovimientoReducido(): boolean {
  return useSyncExternalStore(
    suscribirMovimiento,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

interface Arrastre {
  readonly puntero: number;
  readonly inicioX: number;
  readonly inicioT: number;
  desplazamiento: number;
  esGesto: boolean;
}

const TECLAS: Readonly<
  Record<string, "anterior" | "siguiente" | "primero" | "ultimo">
> = {
  ArrowLeft: "anterior",
  ArrowRight: "siguiente",
  Home: "primero",
  End: "ultimo",
};

export default function GaleriaLibros({
  libros,
  titulo,
  textoElegir,
  textos,
}: Props) {
  // Se guarda el slug y no el libro (REA-4).
  const [elegido, setElegido] = useState(libros[0]?.slug ?? "");
  const movimientoReducido = useMovimientoReducido();
  const filaRef = useRef<HTMLDivElement>(null);
  const escenaRef = useRef<HTMLDivElement>(null);
  const botonesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const arrastreRef = useRef<Arrastre | null>(null);
  const descartarClicRef = useRef(false);
  // Ancho de la escena en unidades `--u`: lo decide el CSS, hay que medirlo.
  const [vista, setVista] = useState<number | null>(null);

  useEffect(() => {
    const escena = escenaRef.current;
    if (!escena) return;
    const medir = () => {
      const unidad = Number.parseFloat(
        getComputedStyle(escena).getPropertyValue("--u"),
      );
      if (unidad > 0) setVista(escena.clientWidth / unidad);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(escena);
    return () => observador.disconnect();
  }, []);

  const posicion = Math.max(
    libros.findIndex((libro) => libro.slug === elegido),
    0,
  );
  const ultimo = libros.length - 1;

  function irA(destino: number, conFoco = false) {
    const indice = Math.min(Math.max(destino, 0), ultimo);
    const nuevo = libros[indice];
    if (!nuevo) return;
    if (conFoco) botonesRef.current[indice]?.focus({ preventScroll: true });
    if (nuevo.slug === elegido) return;
    // Sin movimiento nada gira ni se desplaza: el cambio se marca con un fundido.
    if (movimientoReducido) {
      filaRef.current?.animate([{ opacity: 0.25 }, { opacity: 1 }], {
        duration: FUNDIDO_MS,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      });
    }
    setElegido(nuevo.slug);
  }

  // La página es la librería: las flechas del teclado la recorren desde
  // cualquier lugar, salvo que se esté escribiendo o se use un atajo.
  // Se vuelve a suscribir en cada render para leer la posición vigente.
  useEffect(() => {
    const alTeclear = (evento: KeyboardEvent) => {
      const tecla = TECLAS[evento.key];
      if (!tecla || evento.altKey || evento.ctrlKey || evento.metaKey) return;
      const objetivo = evento.target;
      if (
        objetivo instanceof HTMLInputElement ||
        objetivo instanceof HTMLTextAreaElement
      )
        return;
      // Con el foco en un lomo, se avanza desde ese lomo y el foco lo sigue.
      const conFoco =
        objetivo instanceof HTMLButtonElement
          ? botonesRef.current.indexOf(objetivo)
          : -1;
      const desde = conFoco === -1 ? posicion : conFoco;
      const destinos = {
        anterior: desde - 1,
        siguiente: desde + 1,
        primero: 0,
        ultimo,
      } as const;
      evento.preventDefault();
      irA(destinos[tecla], conFoco !== -1);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  });

  const libro = libros[posicion];
  if (!libro) return null;

  const medidas = libros.map((item, indice) =>
    medidasDe(item, indice, indice === posicion),
  );
  const centros = centrosDe(medidas, posicion);
  // La repisa mide lo que la escena, y en ella entra lo que entra: los lomos
  // que no caben se apagan en vez de quedar cortados por el borde.
  const mitadRepisa = (vista ?? VISTA_INICIAL) / 2 - MARGEN_DE_REPISA;
  const estiloRepisa: CSSProperties & Record<`--${string}`, number> = {
    "--largo-repisa": mitadRepisa * 2,
  };

  function moverFila(desplazamiento: number | null) {
    const fila = filaRef.current;
    if (!fila) return;
    // Directo en el elemento y no por estado: un render por cuadro de arrastre
    // no hace falta para mover una sola transformación.
    fila.style.translate =
      desplazamiento === null ? "" : `${desplazamiento}px 0`;
    fila.dataset["arrastrando"] = String(desplazamiento !== null);
  }

  function alPresionar(evento: PointerEvent<HTMLDivElement>) {
    // Un segundo dedo no reinicia el gesto: si no, la fila salta.
    if (arrastreRef.current) return;
    if (evento.pointerType === "mouse" && evento.button !== 0) return;
    arrastreRef.current = {
      puntero: evento.pointerId,
      inicioX: evento.clientX,
      inicioT: evento.timeStamp,
      desplazamiento: 0,
      esGesto: false,
    };
  }

  function alMover(evento: PointerEvent<HTMLDivElement>) {
    const arrastre = arrastreRef.current;
    if (!arrastre || arrastre.puntero !== evento.pointerId) return;
    let desplazamiento = evento.clientX - arrastre.inicioX;
    if (!arrastre.esGesto) {
      if (Math.abs(desplazamiento) < UMBRAL_ARRASTRE) return;
      arrastre.esGesto = true;
      evento.currentTarget.setPointerCapture(evento.pointerId);
    }
    const pasaElBorde =
      (posicion === 0 && desplazamiento > 0) ||
      (posicion === ultimo && desplazamiento < 0);
    if (pasaElBorde) desplazamiento *= FRENO_EN_BORDE;
    arrastre.desplazamiento = desplazamiento;
    if (!movimientoReducido) moverFila(desplazamiento);
  }

  function alSoltar(evento: PointerEvent<HTMLDivElement>) {
    const arrastre = arrastreRef.current;
    if (!arrastre || arrastre.puntero !== evento.pointerId) return;
    arrastreRef.current = null;
    if (!arrastre.esGesto) return;
    descartarClicRef.current = true;
    moverFila(null);
    const { desplazamiento } = arrastre;
    const velocidad =
      Math.abs(desplazamiento) /
      Math.max(evento.timeStamp - arrastre.inicioT, 1);
    let pasos = Math.round(-desplazamiento / ARRASTRE_POR_LIBRO);
    if (pasos === 0 && velocidad > VELOCIDAD_LANCE)
      pasos = desplazamiento < 0 ? 1 : -1;
    irA(posicion + pasos);
  }

  function alCancelar(evento: PointerEvent<HTMLDivElement>) {
    if (arrastreRef.current?.puntero !== evento.pointerId) return;
    arrastreRef.current = null;
    moverFila(null);
  }

  // Un arrastre que termina sobre un lomo no debe elegirlo además.
  function alClicCaptura(evento: MouseEvent<HTMLDivElement>) {
    if (!descartarClicRef.current) return;
    descartarClicRef.current = false;
    evento.preventDefault();
    evento.stopPropagation();
  }

  const posicionTexto = textos.posicion
    .replace("{n}", String(posicion + 1))
    .replace("{total}", String(libros.length));

  return (
    <>
      <div className="libreria__marco">
        <h1 className="sr-only">{titulo}</h1>

        <div
          ref={escenaRef}
          className="libreria__escena"
          // Hasta medir no hay transiciones: si no, la fila se acomodaría
          // deslizándose al cargar.
          data-medida={vista !== null}
          onPointerDown={alPresionar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alCancelar}
          onClickCapture={alClicCaptura}
        >
          {/* La repisa no viaja con el arrastre: lo que se mueve son los libros. */}
          <div className="libreria__mundo">
            <div className="repisa" style={estiloRepisa} aria-hidden="true">
              <span className="repisa__tabla" />
              <span className="repisa__canto" />
            </div>
            <div ref={filaRef} className="libreria__fila">
              <ol className="libreria__libros" aria-label={titulo}>
                {libros.map((item, indice) => {
                  const medida = medidas[indice];
                  if (!medida) return null;
                  const esElegido = indice === posicion;
                  const estaFuera =
                    Math.abs(centros[indice] ?? 0) +
                      anchoEnFila(medida, esElegido) / 2 >
                    mitadRepisa;
                  const caja: CSSProperties & Record<`--${string}`, number> = {
                    "--ancho": medida.ancho,
                    "--alto": medida.alto,
                    "--grosor": medida.grosor,
                    transform: transformacionDe(
                      medida,
                      centros[indice] ?? 0,
                      esElegido,
                    ),
                  };
                  const colores: CSSProperties & Record<`--${string}`, string> =
                    {
                      "--fondo-lomo": item.lomo.fondo,
                      "--tinta-lomo": item.lomo.tinta,
                    };
                  return (
                    <li
                      key={item.slug}
                      className="libreria__ranura"
                      style={caja}
                      data-elegido={esElegido}
                      data-fuera={estaFuera}
                    >
                      <button
                        ref={(boton) => {
                          botonesRef.current[indice] = boton;
                        }}
                        type="button"
                        // Fuera de la repisa no se ve: sigue en la lista para el
                        // lector de pantalla y se llega con las flechas, no con Tab.
                        tabIndex={estaFuera ? -1 : 0}
                        aria-pressed={esElegido}
                        aria-label={textoElegir.replace(
                          "{titulo}",
                          item.titulo,
                        )}
                        onClick={() => irA(indice)}
                        className="libro3d"
                        style={colores}
                      >
                        <span className="libro3d__cara libro3d__cara--portada">
                          <img
                            src={item.portada.src}
                            srcSet={item.portada.srcset}
                            sizes="(min-width: 900px) 40vh, 60vw"
                            width={item.portada.ancho}
                            height={item.portada.alto}
                            alt=""
                            loading={indice === 0 ? "eager" : "lazy"}
                            decoding="async"
                            draggable={false}
                          />
                          <span className="libro3d__luz" />
                        </span>
                        <span className="libro3d__cara libro3d__cara--contra" />
                        <span className="libro3d__cara libro3d__cara--cantos" />
                        <span className="libro3d__cara libro3d__cara--cabeza" />
                        <span className="libro3d__cara libro3d__cara--lomo">
                          <span className="libro3d__volumen" />
                          <span lang="en" className="libro3d__titulo">
                            {item.titulo}
                          </span>
                          <span className="libro3d__autor">
                            {item.autorLomo}
                          </span>
                          <span className="libro3d__marca">{item.anio}</span>
                        </span>
                      </button>
                      <span className="libro3d__sombra" aria-hidden="true" />
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>

        <div className="libreria__ficha">
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {posicionTexto}
          </p>
          <div key={libro.slug} className="libreria__texto">
            <h2 className="libreria__titulo">
              <cite lang="en">{libro.titulo}</cite>
            </h2>
            <p className="libreria__autor">
              {libro.autor} · <span className="tabular-nums">{libro.anio}</span>
            </p>
            <p className="libreria__porque">{libro.porQue}</p>
          </div>
          <div className="libreria__flechas">
            <button
              type="button"
              className="libreria__flecha pulsable"
              aria-label={textos.anterior}
              aria-disabled={posicion === 0}
              onClick={() => irA(posicion - 1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="libreria__flecha pulsable"
              aria-label={textos.siguiente}
              aria-disabled={posicion === ultimo}
              onClick={() => irA(posicion + 1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Fuera del marco: se apoya en el pie de la escena, no en la ficha. */}
      <Subtitulos
        linea={{ id: libro.slug, texto: libro.narracion }}
        tono="claro"
      />
    </>
  );
}
