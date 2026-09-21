import { useEffect, useState } from "react";
import GlitterWarp from "../glitter-warp";

/** Los colores son props de JavaScript, no CSS: hay que leer el tema a mano. */
const ESTRELLA = { claro: "#0b0b0c", oscuro: "#e6edff" } as const;

const leerTema = () =>
  document.documentElement.dataset.tema === "oscuro" ? "oscuro" : "claro";

export default function FondoEstrellas() {
  const [tema, setTema] = useState<"claro" | "oscuro">("claro");
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    setTema(leerTema());

    // El botón de tema cambia `data-tema` en `<html>`; no hay evento para eso.
    const observador = new MutationObserver(() => setTema(leerTema()));
    observador.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-tema"],
    });

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setQuieto(mq.matches);
    const alCambiar = (e: MediaQueryListEvent) => setQuieto(e.matches);
    mq.addEventListener("change", alCambiar);

    return () => {
      observador.disconnect();
      mq.removeEventListener("change", alCambiar);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <GlitterWarp
        color={ESTRELLA[tema]}
        // El shader no es aditivo: el alfa sale de `brightness` y `starSize`,
        // así que se atenúa desde aquí y no hace falta opacidad en el envoltorio.
        brightness={0.5}
        starSize={0.08}
        // Sube el número y las estrellas se separan, no se multiplican.
        density={20}
        focalDepth={0.05}
        turbulence={0.1}
        speed={0.3}
        // Única palanca de `prefers-reduced-motion`: está en las deps del
        // efecto del componente, así que cambiarlo lo detiene de verdad.
        autoPlay={!quieto}
      />
    </div>
  );
}
