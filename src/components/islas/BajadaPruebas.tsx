import { useEffect, useState } from "react";
import BlurHighlight from "../blur-highlight";

interface Props {
  texto: string;
  pruebas: readonly string[];
}

const CLASE = "mt-6 max-w-xl text-lg leading-relaxed text-tinta-suave";
const RESALTE = "font-medium text-tinta";

export default function BajadaPruebas({ texto, pruebas }: Props) {
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setQuieto(mq.matches);
    const alCambiar = (e: MediaQueryListEvent) => setQuieto(e.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  // A diferencia del titular, este componente no mira `prefers-reduced-motion`.
  // Aquí hay copy, no decoración: sin animación se pinta igual, no se omite.
  if (quieto) {
    const partes = texto.split(new RegExp(`(${pruebas.join("|")})`, "g"));
    return (
      <p className={CLASE}>
        {partes.map((parte, i) =>
          pruebas.includes(parte) ? (
            <strong key={i} className={RESALTE}>
              {parte}
            </strong>
          ) : (
            parte
          ),
        )}
      </p>
    );
  }

  return (
    <BlurHighlight
      highlightedBits={[...pruebas]}
      // Sin marcador: el resalte es solo peso y tinta. El fondo de fábrica
      // (verde lima) o uno gris se leen como selección de texto.
      highlightColor="transparent"
      highlightClassName={RESALTE}
      className={CLASE}
    >
      {texto}
    </BlurHighlight>
  );
}
