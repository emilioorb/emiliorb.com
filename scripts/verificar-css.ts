/** Falla si Lightning CSS (el minificador de Vite) borra un translate/rotate/scale. */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { transform } from "lightningcss";

const SUELTAS = /(?<![\w-])(translate|rotate|scale)\s*:/g;

function cssDe(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) return cssDe(ruta);
    return entrada.name.endsWith(".css") ? [ruta] : [];
  });
}

const contar = (css: string): number =>
  (css.replace(/\/\*[\s\S]*?\*\//g, "").match(SUELTAS) ?? []).length;

let fallas = 0;
for (const archivo of cssDe(process.argv[2] ?? "src")) {
  const fuente = readFileSync(archivo, "utf8");
  const antes = contar(fuente);
  if (antes === 0) continue;
  // errorRecovery: @theme y @apply de Tailwind no son CSS estándar.
  const { code } = transform({ filename: archivo, code: Buffer.from(fuente), minify: true, errorRecovery: true });
  const despues = contar(code.toString());
  if (despues < antes) {
    fallas++;
    console.error(
      `${archivo}: ${antes - despues} de ${antes} translate/rotate/scale desaparecen al minificar. ` +
        "Póngalas en una regla sin `transform`, o expréselas dentro del `transform`.",
    );
  }
}

if (fallas) process.exit(1);
console.log("CSS: ninguna transformación suelta se pierde al minificar.");
