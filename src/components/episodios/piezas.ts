// Piezas propias en SVG y no glifos Unicode: los glifos dependen de la fuente
// del sistema y cambian de forma (y hasta de color) entre Windows, iOS y Android.
export const BASE_PIEZA = "M10 33h20v3H10z";
export const FORMA_PIEZA: Record<string, { cuerpo: string; detalle?: string }> = {
  p: { cuerpo: "M20 8a5 5 0 1 1 0 10a5 5 0 1 1 0-10zM15 33c0-6 3-10 4-14h2c1 4 4 8 4 14z" },
  r: { cuerpo: "M12 33l2-3V18l-2-2V9h4v3h2.5V9h3v3H24V9h4v7l-2 2v12l2 3z", detalle: "M14 18h12" },
  n: {
    cuerpo: "M13 33h15c0-8-1-14-3-18c-2-5-6-8-10-8l-1 3c-3 1-6 5-6 9c0 2 2 3 4 2c2-1 4-2 5-2c-2 4-4 8-4 14z",
    detalle: "M15.5 12.5h.01",
  },
  b: {
    cuerpo: "M20 7c4 4 7 8 7 12s-3 6-7 6s-7-2-7-6s3-8 7-12zM16 25h8v3h-8zM15 28h10l3 5H12z",
    detalle: "M22.5 12l-4.5 6",
  },
  q: { cuerpo: "M11 31l1-16l5 8l3-12l3 12l5-8l1 16z", detalle: "M11 27h18" },
  k: { cuerpo: "M19 4h2v4h3v2h-3v5h-2v-5h-3V8h3zM12 31c-1-8 2-14 8-14s9 6 8 14z", detalle: "M12.5 27h15" },
};
