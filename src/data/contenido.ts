import type { ImageMetadata } from "astro";
import type { Idioma } from "../i18n/ui";
import portadaTheGoal from "../assets/libros/the-goal.jpg";
import portadaPhoenixProject from "../assets/libros/the-phoenix-project.jpg";
import portadaFundamentalsArchitecture from "../assets/libros/fundamentals-of-software-architecture.jpg";
import portadaPhilosophyDesign from "../assets/libros/a-philosophy-of-software-design.jpg";
import portadaDataIntensive from "../assets/libros/designing-data-intensive-applications.jpg";
import portadaEngineeringGoogle from "../assets/libros/software-engineering-at-google.jpg";
import portadaAiEngineering from "../assets/libros/ai-engineering.jpg";
import portadaBuildLlm from "../assets/libros/build-a-large-language-model.jpg";
import portadaCrisisEngineering from "../assets/libros/crisis-engineering.jpg";
import portadaInfinityMachine from "../assets/libros/the-infinity-machine.jpg";
import portadaAiForGood from "../assets/libros/ai-for-good.jpg";
import portadaGreatIdeas from "../assets/libros/how-great-ideas-happen.jpg";

interface Bilingue {
  readonly es: string;
  readonly en: string;
}

export interface Puesto {
  readonly empresa: string;
  /** `null` cuando la empresa no tiene sitio. */
  readonly href: string | null;
  readonly cargo: Bilingue;
  readonly desde: string;
  /** `null` mientras siga vigente. */
  readonly hasta: string | null;
  readonly detalle: Bilingue;
  readonly stack: readonly string[];
}

export interface Proyecto {
  readonly slug: string;
  readonly nombre: string;
  /** El producto en vivo; `null` si es interno o no salió. */
  readonly href: string | null;
  readonly repo: string | null;
  readonly anio: string;
  /** Para la portada; el caso completo va en su página. */
  readonly resumen: Bilingue;
  readonly rol: Bilingue;
  readonly contexto: Bilingue;
  readonly aportes: readonly Bilingue[];
  readonly resultados: readonly Bilingue[];
  readonly stack: readonly string[];
}

/**
 * Redactado con verbos en primera persona y resultados, no con fases del ciclo
 * de vida: "participé en todas las etapas" lo puede escribir cualquiera y no
 * dice qué cambió porque estuvo usted.
 */
export const TRABAJO: readonly Puesto[] = [
  {
    empresa: "Arclo Systems",
    href: "https://arclosystems.com",
    cargo: { es: "Fundador & CEO", en: "Founder & CEO" },
    desde: "2025",
    hasta: null,
    detalle: {
      es: "Dirijo la arquitectura técnica y el equipo. Con ellos llevamos Kodi del primer diseño a producción y construimos la plataforma de Transportes Acaya, que reemplazó el sistema y las hojas de cálculo con los que operaban. Escribí los estándares de ingeniería con los que trabajan el equipo y nuestros agentes de IA.",
      en: "I lead the technical architecture and the team. Together we took Kodi from first design to production and built the Transportes Acaya platform that replaced the system and spreadsheets they ran on. I wrote the engineering standards the team and our AI agents work by.",
    },
    stack: ["Next.js", "NestJS", "React Native", "PostgreSQL", "Prisma"],
  },
  {
    empresa: "Novelteak",
    href: "https://www.novelteak.com",
    cargo: { es: "Analista programador", en: "Programmer Analyst" },
    desde: "2024",
    hasta: "2025",
    detalle: {
      es: "Formé parte del equipo que construyó la app offline-first con la que las cuadrillas llevan el trabajo de campo sin señal, y la plataforma multitenant. Me ocupé de los módulos por área, del control de acceso por rol y de la documentación técnica. Las dos operan en Costa Rica y Nicaragua.",
      en: "I was part of the team that built the offline-first app crews use to run field work with no signal, and the multi-tenant platform. I handled the per-area modules, role-based access control and the technical documentation. Both run in Costa Rica and Nicaragua.",
    },
    stack: ["Ionic", "Angular", "Express", "SQL Server"],
  },
  {
    empresa: "GSIT",
    href: null,
    cargo: { es: "QA, .NET Developer & Project Manager", en: "QA, .NET Developer & Project Manager" },
    desde: "2022",
    hasta: "2024",
    detalle: {
      es: "Empecé en QA: armé los planes de prueba, las suites automatizadas y el estándar de calidad que después usó el equipo. Luego programé unos meses en .NET. Al final, como Project Manager, lideré proyectos con Scrum para clientes de banca, comercio, turismo e industria en Costa Rica, Nicaragua y Guatemala.",
      en: "I started in QA: I built the test plans, the automated suites and the QA standard the team used afterwards. Then I spent a few months as a .NET developer. Finally, as Project Manager, I led Scrum projects for banking, retail, tourism and industry clients across Costa Rica, Nicaragua and Guatemala.",
    },
    stack: ["Scrum", "QA", "Automatización"],
  },
];

/**
 * La portada muestra solo el resumen; el caso completo vive en la página de
 * cada proyecto. El límite mantiene las filas parejas y obliga a elegir.
 */
const LARGO_MAX_RESUMEN = 130;

/** Corta el build si un resumen se pasa del límite, en cualquier idioma. */
function conResumenCorto(proyectos: readonly Proyecto[]): readonly Proyecto[] {
  for (const proyecto of proyectos) {
    for (const [idioma, texto] of Object.entries(proyecto.resumen)) {
      if (texto.length > LARGO_MAX_RESUMEN) {
        throw new Error(
          `El resumen de ${proyecto.nombre} (${idioma}) tiene ${texto.length} caracteres; el máximo es ${LARGO_MAX_RESUMEN}.`,
        );
      }
    }
  }
  return proyectos;
}

/**
 * Redactado con verbos en primera persona y resultados, no con fases del ciclo
 * de vida. Las cifras salen del CV: si cambian allá, cambian acá.
 */
export const PROYECTOS: readonly Proyecto[] = conResumenCorto([
  {
    slug: "kodi",
    // El lema va en español en los dos idiomas: es parte de la marca.
    nombre: "Kodi - Estudiá y aprobá",
    href: "https://holakodi.com",
    repo: null,
    anio: "2026",
    resumen: {
      es: "App para preparar la admisión universitaria, las pruebas del MEP y la licencia. Más de 3000 usuarios.",
      en: "Prep app for university admission, national tests and driving licenses. Over 3,000 users.",
    },
    rol: {
      es: "Diseño, desarrollo, infraestructura y publicación",
      en: "Design, development, infrastructure and release",
    },
    contexto: {
      es: "Kodi prepara a estudiantes para la admisión universitaria, las pruebas nacionales del MEP y las licencias del COSEVI, en Android e iOS.",
      en: "Kodi prepares students for university admission, Costa Rica's national tests and COSEVI driving licenses, on Android and iOS.",
    },
    aportes: [
      {
        es: "La llevé del diseño a producción: API REST en NestJS con PostgreSQL y Redis, con 44 módulos documentados en OpenAPI, app en React Native con Expo y panel administrativo en Next.js.",
        en: "I took it from design to production: a NestJS REST API on PostgreSQL and Redis with 44 modules documented in OpenAPI, a React Native app with Expo and an admin panel in Next.js.",
      },
      {
        es: "Integré los pagos de Google Play y App Store por webhooks con tareas idempotentes en BullMQ, para que un reenvío no registre dos veces la misma orden.",
        en: "I integrated Google Play and App Store payments through webhooks with idempotent BullMQ jobs, so a redelivery never records the same order twice.",
      },
      {
        es: "Mantengo unos 6600 casos de prueba de backend, unitarios y E2E con Jest, que corren en GitHub Actions. Los errores se monitorean con Sentry.",
        en: "I maintain about 6,600 backend test cases, unit and E2E with Jest, that run on GitHub Actions. Errors are monitored with Sentry.",
      },
    ],
    resultados: [
      { es: "Más de 3000 usuarios en Android e iOS.", en: "Over 3,000 users on Android and iOS." },
      { es: "Cubierta por El Financiero y NTG Costa Rica.", en: "Covered by El Financiero and NTG Costa Rica." },
    ],
    stack: ["React Native", "Expo", "NestJS", "PostgreSQL", "Redis", "BullMQ", "Next.js"],
  },
  {
    slug: "erp-arclo",
    nombre: "ERP de Arclo Systems",
    href: null,
    repo: null,
    anio: "2026",
    resumen: {
      es: "CRM, proyectos y contabilidad de partida doble en un solo sistema, con 2FA, auditoría y un servidor MCP.",
      en: "CRM, projects and double-entry accounting in one system, with 2FA, audit logs and an MCP server.",
    },
    rol: { es: "Arquitectura y desarrollo", en: "Architecture and development" },
    contexto: {
      es: "Arclo llevaba el CRM, los proyectos y la contabilidad en tres herramientas que no se hablaban. Es un sistema interno, con login y 2FA.",
      en: "Arclo kept its CRM, projects and accounting in three tools that didn't talk to each other. It is an internal system, behind login and 2FA.",
    },
    aportes: [
      {
        es: "Desarrollé sus 11 módulos de CRM, proyectos y finanzas: API REST en NestJS con Prisma y PostgreSQL, y PWA en React 19.",
        en: "I built its 11 CRM, project and finance modules: a NestJS REST API with Prisma and PostgreSQL, and a React 19 PWA.",
      },
      {
        es: "Modelé la contabilidad de partida doble en colones y dólares. Entrar pide 2FA, los permisos se validan en cada solicitud y una bitácora encadenada por hash impide editar o borrar registros.",
        en: "I modeled double-entry accounting in colones and dollars. Signing in requires 2FA, permissions are checked on every request and a hash-chained audit log prevents editing or deleting records.",
      },
      {
        es: "Agregué un servidor MCP con OAuth 2.1 que expone los estándares de ingeniería de Arclo a agentes de IA.",
        en: "I added an MCP server with OAuth 2.1 that exposes Arclo's engineering standards to AI agents.",
      },
      {
        es: "Versioné el esquema en 16 migraciones con rollback probado y escribí 213 archivos de pruebas unitarias, de integración y E2E con Vitest, Testcontainers y Playwright.",
        en: "I versioned the schema in 16 migrations with tested rollback and wrote 213 unit, integration and E2E test files with Vitest, Testcontainers and Playwright.",
      },
    ],
    resultados: [
      {
        es: "Cada cliente va del lead a la cotización, el contrato y las entregas quincenales en un solo sistema, y sigue su avance desde un portal propio.",
        en: "Every client moves from lead to quote, contract and biweekly deliveries in one system, and follows their progress from their own portal.",
      },
      {
        es: "La rentabilidad de cada proyecto sale de la misma contabilidad.",
        en: "Each project's profitability comes out of the same books.",
      },
    ],
    stack: ["React", "NestJS", "PostgreSQL", "Prisma", "MCP", "Vitest", "Playwright"],
  },
  {
    slug: "transportes-acaya",
    nombre: "Transportes Acaya",
    href: "https://acaya.app",
    repo: null,
    anio: "2025",
    resumen: {
      es: "Reemplazó el sistema y las hojas de cálculo con los que operaban. Hoy facturan desde ahí más de 1500 viajes.",
      en: "It replaced the system and spreadsheets they ran on. They now invoice over 1,500 trips from it.",
    },
    rol: {
      es: "Requerimientos, arquitectura y desarrollo",
      en: "Requirements, architecture and development",
    },
    contexto: {
      es: "Transportes Acaya operaba con su sistema anterior y hojas de cálculo que nadie podía editar a la vez, y facturaba a mano.",
      en: "Transportes Acaya ran on its previous system and spreadsheets nobody could edit at the same time, and invoiced by hand.",
    },
    aportes: [
      {
        es: "Levanté los requerimientos y construí la plataforma: ciclo de viaje de 4 estados, tarifas por cliente, órdenes de compra, liquidaciones a terceros y control de acceso con 3 roles.",
        en: "I gathered the requirements and built the platform: a 4-state trip lifecycle, per-client fares, purchase orders, third-party settlements and access control with 3 roles.",
      },
      {
        es: "Integré la factura electrónica de Hacienda v4.4: genero los comprobantes en XML y los firmo con el certificado digital .p12 (XAdES).",
        en: "I integrated Costa Rica's e-invoicing (Hacienda v4.4): receipts are generated as XML and signed with the .p12 digital certificate (XAdES).",
      },
      {
        es: "Automaticé reportes en Excel y PDF y notificaciones en tiempo real en cada cambio de estado del viaje.",
        en: "I automated Excel and PDF reports and real-time notifications on every trip status change.",
      },
    ],
    resultados: [
      {
        es: "Más de 1500 viajes gestionados y facturados desde la plataforma.",
        en: "Over 1,500 trips managed and invoiced from the platform.",
      },
    ],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma"],
  },
  {
    // Producto en producción según Emilio (2026-11-01). Las cifras del núcleo salen del
    // repositorio api-facturacion; las capacidades, de su documento de alcance.
    slug: "api-facturacion",
    nombre: "API de facturación electrónica",
    href: null,
    repo: null,
    anio: "2026",
    resumen: {
      es: "Emite, firma y valida la factura v4.4 de Hacienda con núcleo propio, y su IA acompaña cada factura hasta la declaración.",
      en: "Issues, signs and validates Costa Rica e-invoices in-house; its AI follows each invoice through to the tax return.",
    },
    rol: { es: "Arquitectura y desarrollo", en: "Architecture and development" },
    contexto: {
      es: "Arclo facturaba con un proveedor externo, y cada proyecto tenía que rehacer la integración con Hacienda: la custodia de la llave, los consecutivos, los reintentos y los cambios de anexos. Esta API lo resuelve una vez para todos los sistemas de Arclo, empezando por su ERP.",
      en: "Arclo invoiced through an outside provider, and every project had to redo the Hacienda integration: key custody, sequence numbers, retries and annex changes. This API solves it once for every Arclo system, starting with its ERP.",
    },
    aportes: [
      {
        es: "Escribí un núcleo propio con las reglas de Hacienda, sin SDKs de terceros. La firma XAdES-EPES sigue la política de Hacienda y usa node:crypto, sin criptografía propia.",
        en: "I wrote an in-house core with Hacienda's rules and no third-party SDKs. XAdES-EPES signing follows Hacienda's policy and runs on node:crypto, with no homemade crypto.",
      },
      {
        es: "Genero la clave de 50 caracteres y el consecutivo, y valido cada XML contra los XSD oficiales v4.4 en un proceso aislado. Una sola API emite todos los comprobantes para varias empresas y recibe los de proveedores.",
        en: "I generate the 50-character key and sequence number, and validate each XML against the official v4.4 XSDs in an isolated process. One API issues every document type for several companies and receives supplier invoices.",
      },
      {
        es: "Si Hacienda no responde, una cola reintenta. Cada comprobante sale con su PDF, avisa por webhook y correo, y queda en el archivo legal. Con el panel, las llaves de API, OpenAPI y la librería cliente, un proyecto integra la facturación en un día.",
        en: "If Hacienda doesn't respond, a queue retries. Each invoice gets a PDF, notifies by webhook and email, and goes into the legal archive. With the dashboard, API keys, OpenAPI docs and client library, a project integrates invoicing in a day.",
      },
      {
        es: "La llave .p12 y su PIN viven solo en memoria y nunca se escriben en disco, logs ni mensajes de error. Documenté ocho decisiones de arquitectura y escribí unas 190 pruebas, y una librería independiente verifica cada firma.",
        en: "The .p12 key and its PIN live only in memory and are never written to disk, logs or error messages. I documented eight architecture decisions and wrote about 190 tests, and an independent library verifies every signature.",
      },
      {
        es: "La firma, los montos y el IVA los calcula código determinista, y la IA queda fuera de ese núcleo. La IA sugiere el código CABYS, explica los rechazos de Hacienda, clasifica lo recibido y detecta proveedores que dejaron de estar inscritos.",
        en: "Signing, amounts and VAT run on deterministic code, and AI stays outside that core. AI suggests the CABYS code, explains Hacienda's rejections, classifies received invoices and detects suppliers that are no longer registered.",
      },
      {
        es: "Con los XML emitidos y recibidos armo el borrador del formulario D-150 casilla por casilla. Marco cada inconsistencia antes de declarar, para que no la encuentre primero el cruce de TRIBU-CR, y la IA explica cómo corregirla.",
        en: "From issued and received XML, I draft the D-150 VAT return box by box. Each inconsistency is flagged before filing, so the TRIBU-CR cross-check doesn't find it first, and AI explains how to fix it.",
      },
      {
        es: "Cuando Hacienda publica anexos nuevos, un flujo propone cada regla con su cita y sus pruebas, y una persona la aprueba. Por el servidor MCP, el agente de un cliente consulta sus comprobantes y solo emite dentro de un mandato firmado por una persona.",
        en: "When Hacienda publishes new annexes, a workflow proposes each rule with its citation and tests, and a person approves it. Through the MCP server, a client's agent queries its invoices and only issues within a mandate a person signed.",
      },
    ],
    resultados: [
      {
        es: "Su primer usuario es el ERP de Arclo, que deja de depender de un proveedor externo para facturar.",
        en: "Its first user is Arclo's ERP, which stops depending on an outside provider to invoice.",
      },
    ],
    stack: ["TypeScript", "NestJS", "PostgreSQL", "AWS", "XAdES-EPES", "OpenAPI", "Claude", "MCP"],
  },
]);

/**
 * Lo que construyo por fuera de Arclo: producto propio y experimentos que
 * igual viven en producción. Mismo tipo que `PROYECTOS`.
 */
export const PROYECTOS_PERSONALES: readonly Proyecto[] = conResumenCorto([
  {
    // Fuentes: el README de github.com/emilioorb/T-Ledger y el sitio al aire
    // (v1.4.0). El código es público solo para consulta, con todos los derechos
    // reservados: no es código abierto. Las pruebas salen del CV de Emilio.
    slug: "t-ledger",
    nombre: "T-Ledger",
    href: "https://t-ledger.vercel.app/",
    repo: "https://github.com/emilioorb/T-Ledger",
    anio: "2026",
    resumen: {
      es: "Usted anota un movimiento y el libro escribe el asiento de partida doble. Finanzas personales para usted, su pareja o su familia.",
      en: "You record one movement and the ledger writes the double entry. Personal finances for you, your partner or your family.",
    },
    rol: { es: "Arquitectura y desarrollo", en: "Architecture and development" },
    contexto: {
      es: "Una lista de gastos no responde lo que importa: cuándo termina de pagar una deuda, cuánto ahorra en intereses si adelanta cuotas, si llega a tiempo a una meta o si el mes cierra. T-Ledger lleva contabilidad de partida doble para responderlo, y cada cifra se rastrea hasta su origen.",
      en: "A list of expenses can't answer what matters: when a debt is paid off, how much interest you save by paying ahead, whether you reach a goal in time or whether the month closes. T-Ledger keeps true double-entry books to answer it, and every figure traces back to its source.",
    },
    aportes: [
      {
        es: "Cada movimiento genera su asiento balanceado, con el comprobante adjunto. Los asientos son inmutables: un error se corrige con un asiento de reversa, nunca editando.",
        en: "Every movement creates its balanced journal entry, with the receipt attached. Entries are immutable: a mistake is fixed with a reversing entry, never by editing.",
      },
      {
        es: "Para decidir, modela deudas con amortización e interés compuesto, metas de ahorro, inversiones, presupuesto por cubetas y la proyección del flujo de caja.",
        en: "To help decide, it models debts with amortization and compound interest, savings goals, investments, bucket budgeting and cash-flow projections.",
      },
      {
        es: "Lleva el mayor, el balance de comprobación, la situación financiera, el estado de resultados y el cierre mensual. Concilia contra estados de cuenta importados en CSV, y el patrimonio sale en una moneda con el tipo de cambio del BCCR.",
        en: "It keeps the general ledger, trial balance, balance sheet, income statement and monthly close. It reconciles against imported CSV bank statements, and net worth is reported in one currency at the central bank's rate.",
      },
      {
        es: "Cada persona comparte sus libros por invitación, como dueño, editor o lector. Aislé los libros en dos capas: un cliente de Prisma que agrega el libro a cada consulta, y falla si falta, y una guardia de rol en cada endpoint.",
        en: "Each person shares their ledgers by invitation, as owner, editor or viewer. I isolated ledgers in two layers: a Prisma client that adds the ledger to every query, and fails without it, and a role guard on every endpoint.",
      },
      {
        es: "Medí transacciones serializables: con cuatro libros, 27 de 120 escrituras agotaban los reintentos. Las cambié por un candado por libro en Postgres, y ahora dos personas en el mismo libro no se pisan y los libros distintos nunca se esperan.",
        en: "I measured serializable transactions: with four ledgers, 27 of 120 writes ran out of retries. I replaced them with a per-ledger Postgres lock, so two people on one ledger never clash and different ledgers never wait.",
      },
      {
        es: "La bitácora de auditoría se escribe en la misma transacción que el cambio, así que no hay cambio sin rastro. Sentry no recibe ningún dato del libro.",
        en: "The audit log is written in the same transaction as the change, so no change goes untracked. Sentry never receives any ledger data.",
      },
      {
        es: "Construí 13 módulos en NestJS sobre PostgreSQL, con 37 modelos, 26 migraciones y Better Auth. Un contrato OpenAPI genera los tipos del frontend en React 19 con TanStack, y unos 1140 casos de prueba en 146 archivos cubren los dos lados.",
        en: "I built 13 NestJS modules on PostgreSQL, with 37 models, 26 migrations and Better Auth. An OpenAPI contract generates the types for the React 19 and TanStack frontend, and about 1,140 test cases in 146 files cover both sides.",
      },
    ],
    resultados: [
      {
        es: "En producción, en la versión 1.4.0. El código está publicado para consulta.",
        en: "In production, at version 1.4.0. The source code is published for reference.",
      },
      {
        es: "Seis decisiones de arquitectura documentadas, entre ellas el aislamiento entre libros, la concurrencia y por qué el cifrado extremo a extremo se difiere.",
        en: "Six documented architecture decisions, including ledger isolation, concurrency and why end-to-end encryption is deferred.",
      },
    ],
    stack: ["React", "TanStack", "NestJS", "PostgreSQL", "Prisma", "Better Auth", "Cloudflare R2"],
  },
  {
    // Producto completo y al aire según Emilio (2026-11-01). El contenido sale del
    // repositorio gaceta-ai (README, STACK, ARCHITECTURE y alcance). Solo se
    // afirman garantías de diseño: las métricas medidas viven en el paper.
    slug: "gaceta-ai",
    nombre: "Gaceta AI",
    href: null,
    repo: null,
    anio: "2026",
    resumen: {
      es: "Pregúntele a La Gaceta en lenguaje simple: responde con citas verificadas por código y avisa lo que le afecta.",
      en: "Ask Costa Rica's official gazette in plain language: code-verified citations and alerts on what affects you.",
    },
    rol: { es: "Arquitectura, desarrollo e investigación", en: "Architecture, development and research" },
    contexto: {
      es: "La Gaceta publica unas 400 publicaciones por día hábil y casi nadie la lee. Ya hay quien la resume para abogados o la vigila por tema, pero nadie le responde a cualquier persona con citas comprobadas, la versión vigente de cada norma y alertas por WhatsApp.",
      en: "Costa Rica's official gazette prints about 400 notices every business day and almost nobody reads it. Some services summarize it for lawyers or track topics, but none answer anyone with checked citations, the current version of each regulation and WhatsApp alerts.",
    },
    aportes: [
      {
        es: "Cada día descarga la edición y sus Alcances, verifica la firma digital del PDF, separa cada publicación y quita los datos de personas privadas antes de guardar nada. El histórico llega hasta 2015.",
        en: "Every day it downloads the edition and its supplements, verifies the PDF's digital signature, splits each notice and strips private individuals' data before storing anything. The archive goes back to 2015.",
      },
      {
        es: "Búsqueda híbrida, con vectores en pgvector y full-text en español, un reranker y un grafo de normas que sigue reformas y derogatorias para responder con la versión vigente.",
        en: "Hybrid search, with pgvector embeddings and Spanish full-text, a reranker and a graph of regulations that follows amendments and repeals to answer with the version in force.",
      },
      {
        es: "Cada cita se comprueba carácter por carácter contra la página oficial antes de mostrarse; si no hay evidencia, responde «no lo sé». El texto recuperado entra al modelo marcado como no confiable, contra la inyección de instrucciones.",
        en: "Every citation is checked character by character against the official page before it is shown; without evidence, it answers “I don't know”. Retrieved text reaches the model marked as untrusted, against prompt injection.",
      },
      {
        es: "Claude Sonnet genera y Claude Haiku clasifica por tema, en un flujo fijo de planificar, recuperar, generar y verificar, sin agente. Cada llamada registra tokens, costo y latencia, con un tope de gasto diario.",
        en: "Claude Sonnet generates and Claude Haiku classifies by topic, in a fixed plan, retrieve, generate and verify flow, with no agent. Every call logs tokens, cost and latency, under a daily spending cap.",
      },
      {
        es: "Alertas por tema por WhatsApp, Telegram o correo, que se envían a lo sumo una vez. Una web en Next.js y un servidor MCP de solo lectura para que Claude u otro agente consulte La Gaceta.",
        en: "Topic alerts by WhatsApp, Telegram or email, sent at most once. A Next.js web app and a read-only MCP server so Claude or another agent can query the gazette.",
      },
      {
        es: "Evals propias desde el día uno: recall@k, MRR, citas literales, fuga de datos personales y faithfulness con un juez validado a mano. Una técnica entra solo si mejora una métrica, y la tabla de ablación es la base del paper.",
        en: "In-house evals from day one: recall@k, MRR, verbatim citations, personal-data leakage and faithfulness with a hand-validated judge. A technique ships only if it moves a metric, and the ablation table backs the paper.",
      },
    ],
    resultados: [
      {
        es: "Privacidad por diseño: ningún dato de personas físicas privadas en el índice y ninguna búsqueda por nombre.",
        en: "Privacy by design: no private individuals' data in the index and no search by name.",
      },
      {
        es: "Es la base del paper «Reliability by engineering», sobre cuánta confiabilidad de un RAG jurídico sale de decisiones de ingeniería.",
        en: "It backs the paper “Reliability by engineering”, on how much of a legal RAG's reliability comes from engineering decisions.",
      },
    ],
    stack: ["NestJS", "PostgreSQL", "pgvector", "pg-boss", "Claude", "MCP", "Next.js", "Zod"],
  },
  {
    slug: "emiliorb",
    nombre: "emiliorb.com",
    href: "https://emiliorb.com",
    repo: null,
    anio: "2026",
    resumen: {
      es: "Este portafolio, en español e inglés, con tema claro y oscuro y animaciones hechas a mano.",
      en: "This portfolio, in Spanish and English, with light and dark themes and hand-built animations.",
    },
    rol: { es: "Diseño y desarrollo", en: "Design and development" },
    contexto: {
      es: "Mi sitio personal, con lo que construyo, publico y leo, en español y en inglés.",
      en: "My personal site, with what I build, publish and read, in Spanish and English.",
    },
    aportes: [
      {
        es: "Enrutado por idioma, con el español en la raíz y el inglés bajo /en, enlaces hreflang y sitemap bilingüe.",
        en: "Per-language routing, with Spanish at the root and English under /en, hreflang links and a bilingual sitemap.",
      },
      {
        es: "Tema claro y oscuro, y animaciones con GSAP en islas de React que solo cargan donde hacen falta.",
        en: "Light and dark themes, and GSAP animations in React islands that load only where needed.",
      },
      {
        es: "Mis estadísticas de ajedrez en vivo desde la API de chess.com, validadas con Zod.",
        en: "My live chess stats from the chess.com API, validated with Zod.",
      },
    ],
    resultados: [],
    stack: ["Astro", "React", "Tailwind", "GSAP"],
  },
]);

export interface Nota {
  readonly medio: string;
  /** En el idioma original de la nota: traducir un titular ajeno sería inventarlo. */
  readonly titular: string;
  readonly href: string;
  /** ISO 8601; ordena y alimenta el `<time>`. */
  readonly fecha: string;
}

export const PRENSA: readonly Nota[] = [
  {
    medio: "El Financiero",
    titular:
      "Esta app puede ayudarle en sus exámenes de admisión a universidades, de manejo y del MEP.",
    href: "https://www.elfinancierocr.com/tecnologia/esta-app-puede-ayudarle-en-sus-examenes-de/3PFRLCUYUZAAHJ3X43TXCPDHRU/story/",
    fecha: "2026-10-02",
  },
  {
    medio: "NTG Costa Rica",
    titular:
      "Talento de Tilarán crea Kodi, una aplicación que busca cambiar la forma de estudiar para los exámenes.",
    href: "https://ntgcostarica.com/talento-de-tilaran-crea-kodi-una-aplicacion-que-busca-cambiar-la-forma-de-estudiar-para-los-examenes/",
    fecha: "2026-09-30",
  },
].sort((a, b) => b.fecha.localeCompare(a.fecha));

export type EstadoPaper = "preparacion" | "preprint" | "publicado";

export interface Paper {
  readonly slug: string;
  /** Va en inglés en los dos idiomas: es el idioma en que se escribe el paper. */
  readonly titulo: string;
  /** Una línea para la lista; el detalle va en su propia página. */
  readonly resumen: Bilingue;
  readonly tituloProvisional: boolean;
  readonly proyecto: string;
  readonly estado: EstadoPaper;
  readonly tesis: Bilingue;
  readonly aportes: readonly Bilingue[];
  /** En orden de preferencia. */
  readonly destinos: readonly Bilingue[];
  readonly calendario: Bilingue;
}

/**
 * Solo lo que el plan del paper sostiene hoy: mientras no haya resultados
 * medidos, la tesis se presenta como hipótesis y nada figura como enviado.
 * El más reciente va primero: la portada muestra los primeros.
 */
export const INVESTIGACION: readonly Paper[] = [
  {
    slug: "gaceta-ai",
    titulo: "Reliability by engineering: a RAG over Costa Rica's official gazette",
    resumen: {
      es: "Cuánta confiabilidad de un RAG jurídico sale de decisiones de ingeniería verificables y no de una recuperación más sofisticada.",
      en: "How much of a legal RAG's reliability comes from verifiable engineering decisions rather than more sophisticated retrieval.",
    },
    tituloProvisional: true,
    proyecto: "Gaceta AI",
    estado: "preparacion",
    tesis: {
      es: "En un RAG sobre un diario oficial, la mayor parte de la confiabilidad sale de decisiones de ingeniería verificables y no de técnicas de recuperación más sofisticadas: segmentar por publicación, comprobar las citas por código y filtrar los datos personales antes de indexar. Se mide con una ablación sobre un conjunto de referencia nuevo, y los resultados pueden desmentirla.",
      en: "In a RAG over an official gazette, most of the reliability comes from verifiable engineering decisions rather than more sophisticated retrieval: chunking by notice, checking citations in code and filtering personal data before indexing. It is measured with an ablation over a new benchmark, and the results may refute it.",
    },
    aportes: [
      {
        es: "Un conjunto de referencia abierto de preguntas sobre normativa costarricense, con respuesta y cita verificable (Gaceta, fecha y página).",
        en: "An open benchmark of questions on Costa Rican regulation, each with an answer and a verifiable citation (gazette, date and page).",
      },
      {
        es: "Una ablación de recuperación sobre un corpus jurídico en español: vectores, búsqueda híbrida, BM25, reranker y grafo de normas.",
        en: "A retrieval ablation over a Spanish legal corpus: vectors, hybrid search, BM25, a reranker and a graph of regulations.",
      },
      {
        es: "Verificación de citas por código: cuántas citas inventa el generador y cuánto cuesta eliminarlas.",
        en: "Citation checking in code: how many citations the generator invents and what it costs to remove them.",
      },
      {
        es: "Privacidad antes de indexar en un diario oficial que publica datos personales.",
        en: "Privacy before indexing in an official gazette that publishes personal data.",
      },
      {
        es: "Inyección de instrucciones desde el corpus: las publicaciones pagadas como vector de ataque.",
        en: "Prompt injection from the corpus: paid notices as an attack vector.",
      },
      {
        es: "Comparación con asistentes generales con búsqueda web, en la misma tarea y con las mismas métricas.",
        en: "A comparison with general-purpose assistants with web search, on the same task and metrics.",
      },
    ],
    destinos: [
      { es: "Preprint en arXiv (cs.CL y cs.IR)", en: "arXiv preprint (cs.CL and cs.IR)" },
      { es: "Workshop NLLP 2027, junto a EMNLP", en: "NLLP 2027 workshop, co-located with EMNLP" },
      {
        es: "ACL Rolling Review como artículo de recurso, si los resultados lo sostienen",
        en: "ACL Rolling Review as a resource paper, if the results hold up",
      },
    ],
    calendario: {
      es: "Se escribe en inglés cuando estén medidos los resultados de las fases 1 y 2.",
      en: "Written in English once the results of phases 1 and 2 are measured.",
    },
  },
];

export interface Estudio {
  readonly institucion: string;
  readonly href: string;
  /** El grado («Licenciatura»), aparte de la carrera: en pantalla van en piezas distintas. */
  readonly grado: Bilingue;
  readonly carrera: Bilingue;
  readonly desde: string;
  readonly hasta: string;
}

/**
 * Va al pie de Experiencia y no en una sección propia: con un solo título,
 * darle encabezado y divisoria lo pondría al mismo nivel visual que tres
 * puestos y dos productos publicados, y no pesa lo mismo.
 */
export const ESTUDIOS: Estudio = {
  institucion: "Universidad Invenio",
  href: "https://invenio.ac.cr",
  grado: { es: "Licenciatura", en: "Licentiate degree" },
  carrera: {
    es: "Tecnologías de Información y Comunicación Empresariales",
    en: "Enterprise Information and Communication Technologies",
  },
  desde: "2022",
  hasta: "2026",
};

export interface Red {
  readonly nombre: string;
  readonly href: string;
}

export const REDES: readonly Red[] = [
  { nombre: "GitHub", href: "https://github.com/emilioorb" },
  { nombre: "LinkedIn", href: "https://www.linkedin.com/in/emiliojrb/" },
  { nombre: "X", href: "https://x.com/_emiliojrb" },
];

export interface Libro {
  /** Identificador estable del libro: clave en el estante. */
  readonly slug: string;
  /** En el idioma de la edición que leí: traducir un título ajeno sería inventarlo. */
  readonly titulo: string;
  readonly portada: ImageMetadata;
  readonly autor: string;
  readonly anio: string;
  readonly porQue: Bilingue;
  /** La estantería de la portada muestra 10 como mucho; el resto vive solo en /libros. */
  readonly soloEnLibreria?: true;
}

/**
 * En el orden en que los recomiendo leer, no por fecha. Los 5 primeros son los
 * que la portada muestra en una laptop, y los 6 primeros en el teléfono.
 */
export const LIBROS: readonly Libro[] = [
  {
    slug: "the-goal",
    titulo: "The Goal",
    portada: portadaTheGoal,
    autor: "Eliyahu M. Goldratt",
    anio: "1984",
    porQue: {
      es: "Un sistema rinde lo que rinde su cuello de botella, y mejorar el resto no sirve. Es la teoría de restricciones.",
      en: "A system performs as well as its bottleneck, and improving the rest does nothing. It's the theory of constraints.",
    },
  },
  {
    slug: "a-philosophy-of-software-design",
    titulo: "A Philosophy of Software Design",
    portada: portadaPhilosophyDesign,
    autor: "John Ousterhout",
    anio: "2021",
    porQue: {
      es: "La complejidad se acumula de a poco. Enseña a frenarla con módulos profundos e interfaces simples.",
      en: "Complexity builds up little by little. It shows how to hold it back with deep modules and simple interfaces.",
    },
  },
  {
    slug: "fundamentals-of-software-architecture",
    titulo: "Fundamentals of Software Architecture",
    portada: portadaFundamentalsArchitecture,
    autor: "Mark Richards, Neal Ford",
    anio: "2025",
    porQue: {
      es: "En arquitectura todo es un trade-off. Enseña a nombrar las características que importan, medirlas y elegir el estilo que las sirve.",
      en: "In architecture everything is a trade-off. It teaches you to name the characteristics that matter, measure them and pick the style that serves them.",
    },
  },
  {
    slug: "designing-data-intensive-applications",
    titulo: "Designing Data-Intensive Applications",
    portada: portadaDataIntensive,
    autor: "Martin Kleppmann, Chris Riccomini",
    anio: "2026",
    porQue: {
      es: "Cómo funcionan por dentro las bases de datos, la replicación y los flujos de eventos, y qué se gana y se pierde con cada decisión.",
      en: "How databases, replication and event streams work inside, and what each decision gains and costs.",
    },
  },
  {
    slug: "ai-engineering",
    titulo: "AI Engineering",
    portada: portadaAiEngineering,
    autor: "Chip Huyen",
    anio: "2025",
    porQue: {
      es: "Cómo construir productos sobre modelos fundacionales: evaluación, RAG, agentes, fine-tuning y costos.",
      en: "How to build products on foundation models: evaluation, RAG, agents, fine-tuning and cost.",
    },
  },
  {
    slug: "the-phoenix-project",
    titulo: "The Phoenix Project",
    portada: portadaPhoenixProject,
    autor: "Gene Kim, Kevin Behr, George Spafford",
    anio: "2013",
    porQue: {
      es: "Las mismas ideas de The Goal llevadas al software y a la operación de TI.",
      en: "The ideas of The Goal carried over to software and IT operations.",
    },
  },
  {
    slug: "software-engineering-at-google",
    titulo: "Software Engineering at Google",
    portada: portadaEngineeringGoogle,
    autor: "Titus Winters, Tom Manshreck, Hyrum Wright",
    anio: "2020",
    porQue: {
      es: "La ingeniería como programación sostenida en el tiempo: pruebas, revisión de código, dependencias y equipos que escalan.",
      en: "Engineering as programming over time: testing, code review, dependencies and teams that scale.",
    },
  },
  {
    slug: "crisis-engineering",
    titulo: "Crisis Engineering",
    portada: portadaCrisisEngineering,
    autor: "Marina Nitze, Matthew Weaver, Mikey Dickerson",
    anio: "2026",
    porQue: {
      es: "Herramientas para cuando algo se cae o un proyecto se descarrila, de quienes rescataron HealthCare.gov.",
      en: "Tools for when something goes down or a project derails, from the people who rescued HealthCare.gov.",
    },
  },
  {
    slug: "the-infinity-machine",
    titulo: "The Infinity Machine",
    portada: portadaInfinityMachine,
    autor: "Sebastian Mallaby",
    anio: "2026",
    porQue: {
      es: "Cómo Demis Hassabis llevó DeepMind entre la ciencia de frontera y el producto.",
      en: "How Demis Hassabis steered DeepMind between frontier science and product.",
    },
  },
  {
    slug: "build-a-large-language-model",
    titulo: "Build a Large Language Model (From Scratch)",
    portada: portadaBuildLlm,
    autor: "Sebastian Raschka",
    anio: "2024",
    porQue: {
      es: "Arma un modelo tipo GPT desde cero en PyTorch, del tokenizador al ajuste fino.",
      en: "Builds a GPT-style model from scratch in PyTorch, from tokenizer to fine-tuning.",
    },
  },
  {
    slug: "ai-for-good",
    soloEnLibreria: true,
    titulo: "AI for Good",
    portada: portadaAiForGood,
    autor: "Josh Tyrangiel",
    anio: "2026",
    porQue: {
      es: "Maestros, médicos y funcionarios que usan IA para resolver problemas concretos.",
      en: "Teachers, doctors and civil servants using AI to fix concrete problems.",
    },
  },
  {
    slug: "how-great-ideas-happen",
    soloEnLibreria: true,
    titulo: "How Great Ideas Happen",
    portada: portadaGreatIdeas,
    autor: "George Newman",
    anio: "2026",
    porQue: {
      es: "Cómo nacen y se filtran las ideas que vale la pena perseguir.",
      en: "How ideas worth pursuing are born and filtered.",
    },
  },
];

export interface GrupoStack {
  readonly grupo: Bilingue;
  readonly items: readonly string[];
}

/** Mismo orden y mismas categorías que el CV, para que los dos digan lo mismo. */
export const STACK: readonly GrupoStack[] = [
  {
    grupo: { es: "Lenguajes", en: "Languages" },
    items: ["TypeScript", "JavaScript", "Python", "SQL", "PL/SQL", "Bash", "Java", ".NET"],
  },
  {
    grupo: { es: "Backend", en: "Backend" },
    items: ["Node.js", "NestJS", "Express", "FastAPI", "REST (OpenAPI)", "WebSockets", "BullMQ", "MCP"],
  },
  {
    grupo: { es: "Bases de datos", en: "Databases" },
    items: ["PostgreSQL", "SQL Server", "Oracle", "MySQL", "MongoDB", "Redis", "Prisma", "pgvector"],
  },
  {
    grupo: { es: "Pruebas", en: "Testing" },
    items: ["Jest", "Vitest", "Playwright", "Testcontainers"],
  },
  {
    grupo: { es: "Nube y DevOps", en: "Cloud & DevOps" },
    items: ["AWS", "Azure", "DigitalOcean", "Vercel", "Railway", "Cloudflare", "Docker", "GitHub Actions"],
  },
  {
    grupo: { es: "Frontend y móvil", en: "Frontend & mobile" },
    items: ["React", "Next.js", "Angular", "React Native", "Expo", "Ionic", "Astro"],
  },
  { grupo: { es: "IA", en: "AI" }, items: ["Claude Code", "Codex"] },
  { grupo: { es: "Métodos", en: "Methods" }, items: ["Scrum", "Git"] },
];

export const USUARIO_CHESS = "emiliojrb";

export const enIdioma = (texto: Bilingue, idioma: Idioma) => texto[idioma];
