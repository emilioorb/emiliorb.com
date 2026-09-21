import { useEffect, useRef, useState } from "react";
import TextPath from "../text-path";

/** Ancho medio de glifo en ems para Geist en mayúsculas. Solo sirve para
    estimar cuántas vueltas caben; el componente mide el texto de verdad. */
const ANCHO_GLIFO = 0.538;
const SEGMENTO = 180;

/** Onda suave con comandos `T`, como el preset del componente. Se pasa un
    segmento del ancho para que el texto salga por el borde y no se corte. */
function onda(ancho: number, alto: number) {
  const y = alto / 2;
  let d = `M0,${y} Q${SEGMENTO / 2},${y - alto / 4} ${SEGMENTO},${y}`;
  for (let x = SEGMENTO * 2; x <= ancho + SEGMENTO; x += SEGMENTO) {
    d += ` T${x},${y}`;
  }
  return d;
}

interface Props {
  frase: string;
}

export default function CintaTexto({ frase }: Props) {
  const caja = useRef<HTMLDivElement>(null);
  const [medida, setMedida] = useState<{ w: number; h: number } | null>(null);
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setQuieto(mq.matches);
    const alCambiar = (e: MediaQueryListEvent) => setQuieto(e.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const observador = new ResizeObserver(([entrada]) => {
      const { width, height } = entrada.contentRect;
      setMedida({ w: Math.round(width), h: Math.round(height) });
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // El componente se mueve sin opción de pausa: aquí es pura decoración, así
  // que con reduced-motion no se monta en vez de moverse igual.
  const visible = !quieto && medida !== null && medida.w > 0;

  // El viewBox se deriva de la caja: si no coincide la proporción, el SVG lo
  // encaja centrado (`xMidYMid meet`) y deja aire a los lados.
  let contenido = null;
  if (visible) {
    const { w, h } = medida;
    // El camino no mide lo que la caja: se pasa un segmento por la derecha.
    const largo = (w + SEGMENTO) * 1.05;
    const porVuelta = frase.length * ANCHO_GLIFO * (h * 0.31);
    const vueltas = Math.max(1, Math.round(largo / porVuelta));
    // Un pelo de más: si el texto no desborda el camino, el bucle abre hueco.
    const cuerpo = (largo * 1.08) / (vueltas * frase.length * ANCHO_GLIFO);

    contenido = (
      <TextPath
        text={frase.repeat(vueltas)}
        path={onda(w, h)}
        viewBox={`0 0 ${w} ${h}`}
        duration={30}
        fontSize={`${Math.round(cuerpo)}px`}
      />
    );
  }

  return (
    <div className="w-full py-2 text-borde sm:py-4" aria-hidden="true">
      <div ref={caja} className="h-24 w-full sm:h-32">
        {contenido}
      </div>
    </div>
  );
}
