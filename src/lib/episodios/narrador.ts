import type { FuenteNarrador } from "./tipos";

/**
 * El narrador de hoy: lee el guion. Vive aparte de `guion.ts` para que la isla
 * no arrastre contenido.ts al cliente; un modelo implementaría esta misma
 * interfaz.
 */
export const narradorDeGuion: FuenteNarrador = {
  linea(escena, tiempo) {
    const { narracion } = escena;
    return narracion[Math.min(Math.max(tiempo, 0), narracion.length - 1)] ?? null;
  },
};
