import type Lenis from "lenis";

/** Scroll compartido entre ScrollSuave (crea Lenis) y la serie (lo pilota). */

export const FRENO = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

let lenis: Lenis | null = null;
let latidoPropio: { detener: () => void; reanudar: () => void } | null = null;
// En un scrollTo programático Lenis no guarda el destino en `targetScroll`.
let rumbo: number | null = null;
let rumboPorLenis = false;

export function registrarLenis(instancia: Lenis, latido: { detener: () => void; reanudar: () => void }) {
  lenis = instancia;
  latidoPropio = latido;
  // Solo la rueda anula el paso pedido; cada touchmove también llega aquí.
  instancia.on("virtual-scroll", ({ event }) => {
    if (event.type === "wheel") rumbo = null;
  });
}

export const hayLenis = () => lenis !== null;

/** Mueve Lenis con el reloj de GSAP: un solo bucle por frame. Devuelve cómo soltarlo. */
export function adoptarLenis(
  ticker: { add: (f: (tiempo: number) => void) => void; remove: (f: (tiempo: number) => void) => void },
  alDesplazar: () => void,
): () => void {
  const instancia = lenis;
  if (!instancia) return () => undefined;
  latidoPropio?.detener();
  const avanzar = (tiempo: number) => instancia.raf(tiempo * 1000);
  instancia.on("scroll", alDesplazar);
  ticker.add(avanzar);
  return () => {
    ticker.remove(avanzar);
    instancia.off("scroll", alDesplazar);
    latidoPropio?.reanudar();
  };
}

/** Desde dónde contar el próximo paso: el destino del que está en viaje, si hay uno. */
export function posicionDePartida(): number {
  // Con Lenis quieto el destino quedó colgado (un paso que no se movió no avisa).
  if (rumbo !== null && rumboPorLenis && lenis?.isScrolling === false) rumbo = null;
  if (rumbo !== null) return rumbo;
  if (lenis?.isScrolling === "smooth") return lenis.targetScroll;
  return window.scrollY;
}

/** El dedo va por el scroll nativo: Lenis detiene su animación en cada touchmove. */
export function desplazarA(destino: number, { conDedo = false }: { conDedo?: boolean } = {}) {
  rumbo = destino;
  const llegar = () => {
    if (rumbo === destino) rumbo = null;
  };
  rumboPorLenis = lenis !== null && !conDedo;
  if (lenis && !conDedo) {
    lenis.scrollTo(destino, { duration: 0.7, easing: FRENO, onComplete: llegar });
    return;
  }
  window.scrollTo({ top: destino, behavior: "smooth" });
  window.addEventListener("scrollend", llegar, { once: true });
}
