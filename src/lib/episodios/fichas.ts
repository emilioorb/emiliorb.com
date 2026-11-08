import { TEXTOS, type Idioma } from "../../i18n/ui";
import { ORDEN_PROYECTOS, enlacesExternos, proyecto } from "./guion";
import { rutaFicha, rutasSerie } from "./rutas";
import type { Escena, ItemPasarela, Linea } from "./tipos";

interface Aporte {
  /**
   * Lo que va en grande: el comienzo literal del aporte de contenido.ts, para
   * que quepa en una línea sin decir nada que el aporte no diga. Debajo va el
   * resto del aporte, así nada se repite y nada se pierde.
   */
  readonly corto: string;
  readonly narracion: string;
}

/** Lo que el narrador dice en cada escena de una ficha. En tercera persona y corto. */
interface GuionFicha {
  readonly resumen: string;
  readonly problema: string;
  readonly aportes: readonly Aporte[];
  /** Una por resultado, en el mismo orden; vacía si el proyecto no tiene. */
  readonly resultados: readonly string[];
}

const GUIONES: Readonly<Record<string, Readonly<Record<Idioma, GuionFicha>>>> = {
  kodi: {
    es: {
      resumen: "La usan más de 3000 personas.",
      problema: "Sirve para la admisión universitaria, el MEP y la licencia del COSEVI.",
      aportes: [
        { corto: "La llevé del diseño a producción", narracion: "La API, la app y el panel: los tres los llevó a producción." },
        {
          corto: "Integré los pagos de Google Play y App Store",
          narracion: "Un reenvío de la tienda nunca registra dos veces la misma orden.",
        },
        { corto: "Mantengo unos 6600 casos de prueba de backend", narracion: "Unos 6600 casos de prueba corren en GitHub Actions." },
      ],
      resultados: ["En Android y en iOS.", "Y la prensa escribió sobre ella."],
    },
    en: {
      resumen: "Over 3,000 people use it.",
      problema: "It's for university admission, the national tests and the COSEVI driving license.",
      aportes: [
        { corto: "I took it from design to production", narracion: "The API, the app and the admin panel: he shipped all three." },
        {
          corto: "I integrated Google Play and App Store payments",
          narracion: "A redelivered store event never records the same order twice.",
        },
        { corto: "I maintain about 6,600 backend test cases", narracion: "About 6,600 test cases run on GitHub Actions." },
      ],
      resultados: ["On Android and iOS.", "And the press wrote about it."],
    },
  },
  "transportes-acaya": {
    es: {
      resumen: "Hoy factura desde ahí más de 1500 viajes.",
      problema: "Acaya facturaba a mano, sobre hojas de cálculo que nadie podía editar a la vez.",
      aportes: [
        {
          corto: "Levanté los requerimientos y construí la plataforma",
          narracion: "Un viaje pasa por cuatro estados, con tarifas por cliente y tres roles.",
        },
        {
          corto: "Integré la factura electrónica de Hacienda v4.4",
          narracion: "Cada comprobante sale en XML, firmado con el certificado digital.",
        },
        { corto: "Automaticé reportes en Excel y PDF", narracion: "Cada cambio de estado del viaje avisa en tiempo real." },
      ],
      resultados: ["Más de 1500 viajes, gestionados y facturados desde ahí."],
    },
    en: {
      resumen: "They now invoice over 1,500 trips from it.",
      problema: "Acaya invoiced by hand, on spreadsheets nobody could edit at the same time.",
      aportes: [
        {
          corto: "I gathered the requirements and built the platform",
          narracion: "A trip moves through four states, with per-client fares and three roles.",
        },
        {
          corto: "I integrated Costa Rica's e-invoicing (Hacienda v4.4)",
          narracion: "Every receipt goes out as XML, signed with the digital certificate.",
        },
        { corto: "I automated Excel and PDF reports", narracion: "Every change in a trip's status sends a notice in real time." },
      ],
      resultados: ["Over 1,500 trips, managed and invoiced from it."],
    },
  },
  "erp-arclo": {
    es: {
      resumen: "CRM, proyectos y contabilidad, en un solo sistema.",
      problema: "Arclo llevaba su operación en tres herramientas que no se hablaban.",
      aportes: [
        { corto: "Desarrollé sus 11 módulos de CRM, proyectos y finanzas", narracion: "Once módulos, un solo sistema." },
        {
          corto: "Modelé la contabilidad de partida doble en colones y dólares",
          narracion: "Una bitácora encadenada por hash impide editar o borrar un registro.",
        },
        {
          corto: "Agregué un servidor MCP con OAuth 2.1",
          narracion: "Por ahí, los agentes de IA leen los estándares de Arclo.",
        },
        {
          corto: "Versioné el esquema en 16 migraciones con rollback probado",
          narracion: "Y 213 archivos de pruebas, de la unidad al flujo completo.",
        },
      ],
      resultados: [
        "Cada cliente va del primer contacto a las entregas sin salir del sistema.",
        "La rentabilidad de cada proyecto sale de la misma contabilidad.",
      ],
    },
    en: {
      resumen: "CRM, projects and accounting, in one system.",
      problema: "Arclo ran its operations on three tools that didn't talk to each other.",
      aportes: [
        { corto: "I built its 11 CRM, project and finance modules", narracion: "Eleven modules, one system." },
        {
          corto: "I modeled double-entry accounting in colones and dollars",
          narracion: "A hash-chained log keeps any record from being edited or deleted.",
        },
        { corto: "I added an MCP server with OAuth 2.1", narracion: "Through it, AI agents read Arclo's standards." },
        {
          corto: "I versioned the schema in 16 migrations with tested rollback",
          narracion: "And 213 test files, from unit tests to the full flow.",
        },
      ],
      resultados: [
        "Every client goes from first contact to delivery without leaving the system.",
        "Each project's profitability comes out of the same books.",
      ],
    },
  },
  "api-facturacion": {
    es: {
      resumen: "Emite, firma y valida la factura de Hacienda.",
      problema: "Cada proyecto de Arclo rehacía su propia integración con Hacienda.",
      aportes: [
        {
          corto: "Escribí un núcleo propio con las reglas de Hacienda",
          narracion: "Las reglas de Hacienda viven en un núcleo propio, sin SDKs de terceros.",
        },
        {
          corto: "Genero la clave de 50 caracteres y el consecutivo",
          narracion: "Una sola API emite para varias empresas y recibe lo de sus proveedores.",
        },
        { corto: "Si Hacienda no responde, una cola reintenta", narracion: "Si Hacienda no responde, una cola vuelve a intentar." },
        { corto: "La llave .p12 y su PIN viven solo en memoria", narracion: "La llave nunca toca el disco." },
        {
          corto: "La firma, los montos y el IVA los calcula código determinista",
          narracion: "La firma, los montos y el IVA los calcula código determinista.",
        },
        {
          corto: "Con los XML emitidos y recibidos armo el borrador del formulario D-150",
          narracion: "Cada inconsistencia queda marcada antes de declarar.",
        },
        { corto: "Cuando Hacienda publica anexos nuevos", narracion: "Cada regla nueva la aprueba una persona." },
      ],
      resultados: ["Su primer usuario es el ERP de Arclo, que ya no depende de un proveedor externo."],
    },
    en: {
      resumen: "It issues, signs and validates Costa Rica's e-invoices.",
      problema: "Every Arclo project kept rebuilding its own Hacienda integration.",
      aportes: [
        {
          corto: "I wrote an in-house core with Hacienda's rules",
          narracion: "Hacienda's rules live in a core of its own, with no third-party SDKs.",
        },
        {
          corto: "I generate the 50-character key and sequence number",
          narracion: "One API issues for several companies and takes in their suppliers' invoices.",
        },
        { corto: "If Hacienda doesn't respond, a queue retries", narracion: "When Hacienda doesn't answer, a queue tries again." },
        { corto: "The .p12 key and its PIN live only in memory", narracion: "The key never touches the disk." },
        {
          corto: "Signing, amounts and VAT run on deterministic code",
          narracion: "AI stays outside the code that signs and does the math.",
        },
        {
          corto: "From issued and received XML, I draft the D-150 VAT return box by box",
          narracion: "Every inconsistency is flagged before the return is filed.",
        },
        { corto: "When Hacienda publishes new annexes", narracion: "A person approves every new rule." },
      ],
      resultados: ["Its first user is Arclo's ERP, which no longer depends on an outside provider."],
    },
  },
  rige: {
    es: {
      resumen: "A La Gaceta se le pregunta en lenguaje simple.",
      problema: "La Gaceta publica unas 400 publicaciones por día hábil, y casi nadie la lee.",
      aportes: [
        {
          corto: "Cada día descarga la edición y sus Alcances",
          narracion: "Antes de guardar nada, quita los datos de personas privadas.",
        },
        {
          corto: "Búsqueda híbrida, con vectores en pgvector y full-text en español",
          narracion: "Responde con la versión vigente de cada norma.",
        },
        { corto: "Cada cita se comprueba carácter por carácter", narracion: "Si no hay evidencia, responde «no lo sé»." },
        {
          corto: "Claude Sonnet genera y Claude Haiku clasifica por tema",
          narracion: "Cada llamada al modelo registra su costo, con un tope diario.",
        },
        { corto: "Alertas por tema por WhatsApp, Telegram o correo", narracion: "Cada alerta sale una sola vez." },
        { corto: "Evals propias desde el día uno", narracion: "Una técnica entra solo si mejora una métrica." },
      ],
      resultados: ["En el índice no hay datos de personas privadas.", "Y es la base de su paper."],
    },
    en: {
      resumen: "You ask the official gazette in plain language.",
      problema: "The gazette prints about 400 notices every business day, and almost nobody reads it.",
      aportes: [
        {
          corto: "Every day it downloads the edition and its supplements",
          narracion: "Before storing anything, it strips out private individuals' data.",
        },
        {
          corto: "Hybrid search, with pgvector embeddings and Spanish full-text",
          narracion: "It answers with the version of each regulation in force.",
        },
        { corto: "Every citation is checked character by character", narracion: "Without evidence, it says “I don't know.”" },
        {
          corto: "Claude Sonnet generates and Claude Haiku classifies by topic",
          narracion: "Every model call logs its cost, under a daily cap.",
        },
        { corto: "Topic alerts by WhatsApp, Telegram or email", narracion: "Each alert goes out only once." },
        { corto: "In-house evals from day one", narracion: "A technique ships only if it moves a metric." },
      ],
      resultados: ["No private individuals' data in the index.", "And it backs his paper."],
    },
  },
  "t-ledger": {
    es: {
      resumen: "Usted anota un movimiento, y el libro escribe el asiento.",
      problema: "Una lista de gastos no dice cuándo termina de pagar una deuda.",
      aportes: [
        {
          corto: "Cada movimiento genera su asiento balanceado",
          narracion: "Un error se corrige con un asiento de reversa, nunca editando.",
        },
        {
          corto: "Para decidir, modela deudas con amortización e interés compuesto",
          narracion: "Deudas, metas, inversiones y el flujo de caja que viene.",
        },
        {
          corto: "Lleva el mayor, el balance de comprobación",
          narracion: "El patrimonio sale en una moneda, con el tipo de cambio del BCCR.",
        },
        {
          corto: "Cada persona comparte sus libros por invitación",
          narracion: "Cada libro queda aislado en dos capas: la consulta y el rol.",
        },
        {
          corto: "Medí transacciones serializables",
          narracion: "Lo midió primero: 27 de 120 escrituras agotaban los reintentos.",
        },
        {
          corto: "La bitácora de auditoría se escribe en la misma transacción que el cambio",
          narracion: "La bitácora se escribe en la misma transacción que el cambio.",
        },
        {
          corto: "Construí 13 módulos en NestJS sobre PostgreSQL",
          narracion: "Unos 1140 casos de prueba cubren los dos lados.",
        },
      ],
      resultados: ["Está en producción, y el código es público.", "Seis decisiones de arquitectura, escritas."],
    },
    en: {
      resumen: "You record one movement, and the ledger writes the entry.",
      problema: "A list of expenses can't tell you when a debt will be paid off.",
      aportes: [
        {
          corto: "Every movement creates its balanced journal entry",
          narracion: "A mistake is fixed with a reversing entry, never by editing.",
        },
        {
          corto: "To help decide, it models debts with amortization and compound interest",
          narracion: "Debts, goals, investments and the cash flow ahead.",
        },
        {
          corto: "It keeps the general ledger",
          narracion: "Net worth comes out in one currency, at the central bank's rate.",
        },
        {
          corto: "Each person shares their ledgers by invitation",
          narracion: "Each ledger is isolated in two layers: the query and the role.",
        },
        {
          corto: "I measured serializable transactions",
          narracion: "He measured first: 27 of 120 writes ran out of retries.",
        },
        {
          corto: "The audit log is written in the same transaction as the change",
          narracion: "No change goes untracked.",
        },
        {
          corto: "I built 13 NestJS modules on PostgreSQL",
          narracion: "About 1,140 test cases cover both sides.",
        },
      ],
      resultados: ["It's in production, and the code is public.", "Six architecture decisions, written down."],
    },
  },
  emiliorb: {
    es: {
      resumen: "Este mismo sitio.",
      problema: "Su sitio personal, en español y en inglés.",
      aportes: [
        { corto: "Enrutado por idioma", narracion: "Cada página sabe cuál es su versión en el otro idioma." },
        { corto: "Tema claro y oscuro", narracion: "Las animaciones solo cargan donde hacen falta." },
        {
          corto: "Mis estadísticas de ajedrez en vivo desde la API de chess.com",
          narracion: "El ajedrez llega en vivo, validado antes de mostrarse.",
        },
      ],
      resultados: [],
    },
    en: {
      resumen: "This very site.",
      problema: "His personal site, in Spanish and English.",
      aportes: [
        { corto: "Per-language routing", narracion: "Every page knows its version in the other language." },
        { corto: "Light and dark themes", narracion: "The animations load only where they're needed." },
        {
          corto: "My live chess stats from the chess.com API",
          narracion: "The chess numbers arrive live, checked before they're shown.",
        },
      ],
      resultados: [],
    },
  },
};

/** Lo que la ficha dice por su cuenta, fuera del guion de cada proyecto. */
const COPY = {
  es: {
    proyecto: "Proyecto",
    sinResultados: "Con esto está hecho.",
    fin: "Fin de la ficha",
    siguiente: "Siguiente proyecto",
    volver: "Volver a la serie",
    sigue: (nombre: string) => `Lo que sigue es ${nombre}.`,
  },
  en: {
    proyecto: "Project",
    sinResultados: "This is what it's built with.",
    fin: "End of the project",
    siguiente: "Next project",
    volver: "Back to the series",
    sigue: (nombre: string) => `Next up: ${nombre}.`,
  },
} as const satisfies Record<Idioma, unknown>;

const dosCifras = (n: number) => String(n).padStart(2, "0");

/** Las españolas conservan los ids con que están grabadas; las inglesas llevan prefijo. */
const lineas = (idioma: Idioma, id: string, textos: readonly string[]): readonly Linea[] =>
  textos.map((texto, i) => ({ id: `${idioma === "es" ? "" : "en-"}ficha-${id}-${i}`, texto }));

const conMayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** El trozo en grande es una frase: empieza con mayúscula y cierra con punto. */
function enPantalla(corto: string): string {
  const frase = conMayuscula(corto);
  return /[.»”)]$/.test(frase) ? frase : `${frase}.`;
}

/** Lo que sigue al trozo en grande, sin la puntuación que lo unía a él. */
function resto(aporte: string, corto: string): string | null {
  const siguiente = aporte.slice(corto.length).replace(/^[\s,;:.]+/, "");
  return siguiente ? conMayuscula(siguiente) : null;
}

function guionDe(
  slug: string,
  idioma: Idioma,
  aportes: readonly string[],
  resultados: readonly string[],
): GuionFicha {
  const guion = GUIONES[slug]?.[idioma];
  if (!guion) throw new Error(`Falta el guion de la ficha «${slug}» (${idioma}).`);
  const donde = `«${slug}» (${idioma})`;
  if (guion.aportes.length !== aportes.length) {
    throw new Error(`La ficha ${donde} tiene ${guion.aportes.length} aportes en el guion y ${aportes.length} en contenido.ts.`);
  }
  guion.aportes.forEach(({ corto }, i) => {
    if (!aportes[i]?.toLowerCase().startsWith(corto.toLowerCase())) {
      throw new Error(`El aporte ${i + 1} de ${donde} ya no empieza con «${corto}»; revise el guion de la ficha.`);
    }
  });
  if (guion.resultados.length !== resultados.length) {
    throw new Error(`La ficha ${donde} tiene ${guion.resultados.length} resultados en el guion y ${resultados.length} en contenido.ts.`);
  }
  return guion;
}

/** La ficha de un proyecto como una serie corta: las mismas escenas y el mismo escenario que la portada. */
export function construirFicha(slug: string, idioma: Idioma): readonly Escena[] {
  const t = TEXTOS[idioma];
  const c = COPY[idioma];
  const { proyecto: p, grupo } = proyecto(slug, idioma);
  const aportes = p.aportes.map((a) => a[idioma]);
  const resultados = p.resultados.map((r) => r[idioma]);
  const guion = guionDe(slug, idioma, aportes, resultados);

  const posicion = ORDEN_PROYECTOS.findIndex((enOrden) => enOrden === slug);
  const siguienteSlug = ORDEN_PROYECTOS[(posicion + 1) % ORDEN_PROYECTOS.length];
  if (posicion < 0 || !siguienteSlug) throw new Error(`«${slug}» no está en el orden de la serie.`);
  const siguiente = proyecto(siguienteSlug, idioma).proyecto;

  const pasos = aportes.map((aporte, i): ItemPasarela => {
    const corto = guion.aportes[i]?.corto ?? aporte;
    return {
      id: `aporte-${i}`,
      rotulo: `${dosCifras(i + 1)} / ${dosCifras(aportes.length)}`,
      titulo: enPantalla(corto),
      idiomaTitulo: null,
      linea: resto(aporte, corto),
      meta: null,
      enlaces: [],
    };
  });

  return [
    {
      tipo: "titulo",
      id: "titulo",
      largo: 150,
      tono: "invertido",
      rotulo: `${c.proyecto} ${dosCifras(posicion + 1)} / ${dosCifras(ORDEN_PROYECTOS.length)}`,
      cabecera: `${c.proyecto} · ${p.nombre}`,
      titulo: [p.nombre],
      pie: `${p.anio} · ${grupo} · ${p.rol[idioma]}`,
      // El rol tal cual está en contenido.ts: si cambia allá, la línea cambia con él.
      narracion: lineas(idioma, `${slug}-titulo`, [`${p.nombre}. ${p.rol[idioma]}.`]),
    },
    {
      tipo: "sintesis",
      id: "resumen",
      largo: 160,
      tono: "claro",
      rotulo: `${grupo} · ${p.anio}`,
      texto: p.resumen[idioma],
      enlaces: enlacesExternos(p, idioma),
      narracion: lineas(idioma, `${slug}-resumen`, [guion.resumen]),
    },
    {
      tipo: "sintesis",
      id: "problema",
      largo: 170,
      tono: "claro",
      rotulo: t.projects.contexto,
      texto: p.contexto[idioma],
      enlaces: [],
      narracion: lineas(idioma, `${slug}-problema`, [guion.problema]),
    },
    {
      tipo: "pasarela",
      id: "aportes",
      largo: 100 + pasos.length * 55,
      tono: "claro",
      encabezado: t.projects.aportes,
      items: pasos,
      narracion: lineas(
        idioma,
        `${slug}-aportes`,
        guion.aportes.map((a) => a.narracion),
      ),
    },
    {
      tipo: "balance",
      id: "resultados",
      largo: 140 + Math.max(resultados.length, 1) * 60,
      tono: "claro",
      rotulo: t.projects.resultados,
      resultados,
      rotuloStack: t.projects.stack,
      stack: p.stack,
      narracion: lineas(
        idioma,
        `${slug}-resultados`,
        guion.resultados.length > 0 ? guion.resultados : [c.sinResultados],
      ),
    },
    {
      tipo: "salida",
      id: "salida",
      largo: 150,
      tono: "invertido",
      rotulo: c.fin,
      siguiente: { antetitulo: c.siguiente, nombre: siguiente.nombre, href: rutaFicha(siguiente.slug, idioma) },
      volver: { texto: c.volver, href: rutasSerie(idioma).proyectos, externo: false },
      narracion: lineas(idioma, `${slug}-salida`, [c.sigue(siguiente.nombre)]),
    },
  ];
}
