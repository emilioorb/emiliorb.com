import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import type { Escena } from "../../lib/episodios/tipos";

gsap.registerPlugin(CustomEase);
/** La misma curva que `--ease-out` en global.css: una sola curva para todo el sitio. */
const SALIDA = CustomEase.create("salida", "0.23,1,0.32,1");

/**
 * El corte seco: la escena aparece entera de golpe y lo único que se mueve son
 * las líneas de velocidad, que cruzan y se van, y un leve golpe de cámara en el
 * titular. Se arma en pausa y se reinicia en cada corte.
 */
export function crearCorte(lienzo: HTMLElement): gsap.core.Timeline {
  const lineas = lienzo.querySelectorAll<HTMLElement>(".velocidad span");
  const golpe = lienzo.querySelectorAll<HTMLElement>(".golpe");
  const corte = gsap.timeline({ paused: true });
  corte
    .fromTo(
      lineas,
      { scaleX: 0, xPercent: 0, opacity: 1 },
      { scaleX: 1, duration: 0.18, ease: SALIDA, stagger: { each: 0.008, from: "random" } },
      0,
    )
    .to(
      lineas,
      { xPercent: 170, opacity: 0, duration: 0.32, ease: SALIDA, stagger: { each: 0.008, from: "random" } },
      0.15,
    );
  if (golpe.length > 0) {
    corte.fromTo(golpe, { scale: 1.035 }, { scale: 1, duration: 0.7, ease: SALIDA, immediateRender: false }, 0);
  }
  return corte;
}

interface OpcionesFijada {
  readonly scrub: boolean | number;
  /** Avisa el tiempo (índice) en que va la escena, para el narrador. */
  readonly alCambiarTiempo: (tiempo: number) => void;
}

/** Lo que el escenario necesita de una escena con coreografía. */
export interface Fijada {
  /** Lleva el scroll al punto donde el tiempo `tiempo` ya se ve entero. */
  irA(tiempo: number): void;
  /** Ese mismo punto, en píxeles de scroll, sin moverse; `null` si todavía no se midió. */
  destino(tiempo: number): number | null;
}

/**
 * Lo que pasa mientras la escena está fijada, atado al scroll. Las escenas sin
 * coreografía no crean nada: se quedan quietas su tiempo y siguen.
 */
export function coreografiaFijada(escena: Escena, seccion: HTMLElement, opciones: OpcionesFijada): Fijada | null {
  switch (escena.tipo) {
    case "etapa":
      return coreografiaEtapa(seccion, opciones);
    case "pasarela":
      return coreografiaPasarela(seccion, opciones);
    case "estante":
      return coreografiaEstante(seccion, opciones);
    case "ajedrez":
      return coreografiaAjedrez(seccion, opciones);
    case "balance":
      return coreografiaBalance(seccion, opciones);
    case "apertura":
    case "titulo":
    case "cierre":
    case "sintesis":
    case "salida":
      return null;
  }
}

/**
 * La línea de tiempo de una escena fijada: un tiempo por unidad, de modo que
 * el progreso del scroll por la duración da el tiempo actual.
 */
function lineaFijada(
  seccion: HTMLElement,
  tiempos: number,
  { scrub, alCambiarTiempo }: OpcionesFijada,
  alTiempo?: (tiempo: number) => void,
) {
  let ultimo = -1;
  const linea = gsap.timeline({
    defaults: { ease: SALIDA },
    scrollTrigger: {
      trigger: seccion,
      start: "top top",
      end: "bottom bottom",
      scrub,
      onUpdate: (self) => {
        // La línea cambia en el instante en que su paso empieza a entrar: lo que se
        // lee y lo que aparece van juntos.
        const tiempo = Math.min(Math.floor(self.progress * linea.duration()), tiempos - 1);
        if (tiempo === ultimo) return;
        ultimo = tiempo;
        alCambiarTiempo(tiempo);
        alTiempo?.(tiempo);
      },
    },
  });
  const destino = (tiempo: number) => {
    const st = linea.scrollTrigger;
    if (!st) return null;
    const progreso = Math.min((tiempo + 0.6) / linea.duration(), 1);
    return st.start + progreso * (st.end - st.start);
  };
  const fijada: Fijada = {
    destino,
    irA(tiempo) {
      const top = destino(tiempo);
      if (top !== null) window.scrollTo({ top, behavior: "instant" });
    },
  };
  return { linea, fijada };
}

/** Cada paso entra en su propio tiempo y el anterior se apaga sin desaparecer. */
function coreografiaEtapa(seccion: HTMLElement, opciones: OpcionesFijada): Fijada {
  const pasos = gsap.utils.toArray<HTMLElement>(".paso", seccion);
  const { linea, fijada } = lineaFijada(seccion, pasos.length, opciones);

  pasos.forEach((paso, i) => {
    const texto = paso.querySelector(".paso__texto");
    const num = paso.querySelector(".paso__num");
    const raya = paso.querySelector(".paso__raya");
    linea.from(texto, { yPercent: 45, opacity: 0, duration: 0.55 }, i);
    linea.from(num, { opacity: 0, duration: 0.3 }, i + 0.1);
    linea.from(raya, { scaleX: 0, duration: 0.7 }, i + 0.12);
    const anterior = pasos[i - 1];
    // 0.5 y no menos: a ese tamaño el paso apagado sigue pasando AA de texto grande.
    if (anterior) linea.to(anterior, { opacity: 0.5, duration: 0.4 }, i);
  });
  // Un respiro al final: el remate se queda solo antes del corte.
  linea.to({}, { duration: 0.6 });
  return fijada;
}

/**
 * Una cosa a la vez en el mismo lugar: la que sale sube y se va, la que entra
 * sube desde abajo. El primero ya está en pantalla cuando llega el corte.
 */
function coreografiaPasarela(seccion: HTMLElement, opciones: OpcionesFijada): Fijada {
  const items = gsap.utils.toArray<HTMLElement>(".item", seccion);
  const barra = seccion.querySelector(".pasarela__barra");
  // Las que no se ven no reciben clics: están apiladas encima de la visible.
  const marcar = (actual: number) => items.forEach((item, i) => item.toggleAttribute("data-actual", i === actual));
  marcar(0);
  const { linea, fijada } = lineaFijada(seccion, items.length, opciones, marcar);

  items.forEach((item, i) => {
    if (i === 0) return;
    const anterior = items[i - 1];
    if (anterior) linea.to(anterior, { opacity: 0, y: -32, duration: 0.3 }, i - 0.05);
    linea.fromTo(item, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, i + 0.1);
    if (barra) linea.to(barra, { scaleX: (i + 1) / items.length, duration: 0.4 }, i + 0.1);
  });
  linea.to({}, { duration: 0.6 });
  return fijada;
}

/** Los libros llegan en fila; después, todos se apagan menos el primero. */
function coreografiaEstante(seccion: HTMLElement, opciones: OpcionesFijada): Fijada {
  const libros = gsap.utils.toArray<HTMLElement>(".libro", seccion);
  const destacado = seccion.querySelector(".estante__destacado");
  const { linea, fijada } = lineaFijada(seccion, 2, opciones);
  linea.from(libros, { opacity: 0, y: 36, duration: 0.5, stagger: 0.07 }, 0);
  linea.to(
    libros.filter((libro) => !libro.hasAttribute("data-primero")),
    { opacity: 0.3, duration: 0.35 },
    1,
  );
  if (destacado) linea.from(destacado, { opacity: 0, y: 24, duration: 0.45 }, 1.05);
  linea.to({}, { duration: 0.6 });
  return fijada;
}

/** Las piezas caen en su casilla, y el texto llega detrás. */
function coreografiaAjedrez(seccion: HTMLElement, opciones: OpcionesFijada): Fijada {
  const piezas = gsap.utils.toArray<SVGElement>(".pieza", seccion);
  const texto = seccion.querySelector(".ajedrez-escena__texto");
  const { linea, fijada } = lineaFijada(seccion, 1, opciones);
  if (piezas.length > 0) {
    linea.from(piezas, { opacity: 0, y: -14, duration: 0.35, stagger: { each: 0.012, from: "random" } }, 0);
  }
  if (texto) linea.from(texto, { opacity: 0, y: 24, duration: 0.5 }, 0.15);
  linea.to({}, { duration: 0.5 });
  return fijada;
}

/** Los resultados entran uno por tiempo, como los pasos; el stack llega con el último. */
function coreografiaBalance(seccion: HTMLElement, opciones: OpcionesFijada): Fijada {
  const resultados = gsap.utils.toArray<HTMLElement>(".resultado", seccion);
  const stack = seccion.querySelector(".balance__stack");
  const tiempos = Math.max(resultados.length, 1);
  const { linea, fijada } = lineaFijada(seccion, tiempos, opciones);
  resultados.forEach((resultado, i) => {
    linea.from(resultado.querySelector(".resultado__texto"), { yPercent: 30, opacity: 0, duration: 0.55 }, i);
    linea.from(resultado.querySelector(".resultado__raya"), { scaleX: 0, duration: 0.7 }, i + 0.12);
    const anterior = resultados[i - 1];
    if (anterior) linea.to(anterior, { opacity: 0.5, duration: 0.4 }, i);
  });
  if (stack) linea.from(stack, { opacity: 0, y: 24, duration: 0.5 }, tiempos - 1 + 0.2);
  linea.to({}, { duration: 0.6 });
  return fijada;
}
