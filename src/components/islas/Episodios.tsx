import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EscenaEnPantalla } from "../episodios/Escenas";
import { coreografiaFijada, crearCorte, type Fijada } from "../episodios/coreografias";
import { Subtitulos } from "../episodios/Subtitulos";
import { CabeceraSerie, type RutasSerie } from "../episodios/CabeceraSerie";
import { TextosEscena } from "../episodios/Escenas";
import type { TextosSerie } from "../../i18n/ui";
import { narradorDeGuion } from "../../lib/episodios/narrador";

import type { Escena } from "../../lib/episodios/tipos";
import "../episodios/episodios.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  escenas: readonly Escena[];
  rutas: RutasSerie;
  textos: TextosSerie;
}

/**
 * Las anclas de la portada anterior, que siguen enlazadas desde afuera: cada
 * una cae en la escena que hoy cuenta lo mismo.
 */
const ANCLAS_VIEJAS: Readonly<Record<string, string>> = {
  inicio: "apertura",
  work: "ep2-titulo",
  projects: "ep5-proyectos",
  press: "ep6-lectura",
  research: "ep6-titulo",
  books: "ep7-libros",
  // Los ids de antes de que la universidad abriera la serie y todo corriera un número.
  "ep4-proyectos": "ep5-proyectos",
  "ep5-lectura": "ep6-lectura",
  "ep6-libros": "ep7-libros",
  "ep6-ajedrez": "ep7-ajedrez",
  contact: "proximo",
};

/** La escena a la que apunta el ancla de la URL, si apunta a alguna. */
function escenaDelAncla(secciones: readonly HTMLElement[]): HTMLElement | undefined {
  const ancla = decodeURIComponent(location.hash.slice(1));
  if (!ancla) return undefined;
  const id = ANCLAS_VIEJAS[ancla] ?? ancla;
  const seccion = secciones.find((s) => s.id === id);
  // La URL dice dónde está el visitante: el ancla vieja se cambia por la de la escena.
  if (seccion && id !== ancla) history.replaceState(null, "", `#${id}`);
  return seccion;
}

const aterrizar = (seccion: HTMLElement) =>
  requestAnimationFrame(() =>
    window.scrollTo({ top: seccion.getBoundingClientRect().top + window.scrollY + 2, behavior: "instant" }),
  );

interface Momento {
  readonly escena: number;
  readonly tiempo: number;
}

const MOVIMIENTO = "(prefers-reduced-motion: no-preference)";
const MENOS_MOVIMIENTO = "(prefers-reduced-motion: reduce)";
/** Las teclas que pasan la serie un momento por pulsación, y hacia dónde. */
const TECLAS_PASO: Readonly<Record<string, 1 | -1>> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
/** Lo que tiene que recorrer el dedo (px) para que un gesto cuente como paso y no como toque. */
const UMBRAL_GESTO = 24;

/** Lo que dice la cabecera en esta escena: el episodio en curso, o el rótulo del cierre. */
function rotuloHasta(escenas: readonly Escena[], indice: number): string | null {
  let rotulo: string | null = null;
  for (const escena of escenas.slice(0, indice + 1)) {
    if (escena.tipo === "titulo") rotulo = escena.cabecera;
    if (escena.tipo === "cierre") rotulo = escena.rotulo;
  }
  return rotulo;
}

export default function Episodios({ escenas, rutas, textos }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const [momento, setMomento] = useState<Momento>({ escena: 0, tiempo: 0 });
  const [enEscena, setEnEscena] = useState(true);
  const [cine, setCine] = useState(false);
  const indiceActual = useRef(0);
  const tiempoActual = useRef(0);

  const mover = useCallback((escena: number, tiempo: number) => {
    indiceActual.current = escena;
    tiempoActual.current = tiempo;
    setMomento((previo) =>
      previo.escena === escena && previo.tiempo === tiempo ? previo : { escena, tiempo },
    );
  }, []);

  const salirDeCine = useCallback(() => {
    setCine(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
  }, []);

  const entrarEnCine = () => {
    setCine(true);
    // iPhone no da pantalla completa a una página: queda el modo cine sin ella.
    void document.documentElement.requestFullscreen?.({ navigationUI: "hide" }).catch(() => undefined);
  };

  const alPulsar = (evento: React.MouseEvent<HTMLDivElement>) => {
    if (evento.target instanceof Element && evento.target.closest('[data-accion="cine"]')) entrarEnCine();
  };

  // En modo cine la interfaz se apaga; vuelve mientras el visitante mueve el mouse.
  useEffect(() => {
    const raizHtml = document.documentElement;
    if (!cine) {
      delete raizHtml.dataset.cine;
      return;
    }
    raizHtml.dataset.cine = "quieto";
    let espera = 0;
    const despertar = () => {
      raizHtml.dataset.cine = "activo";
      window.clearTimeout(espera);
      espera = window.setTimeout(() => (raizHtml.dataset.cine = "quieto"), 2500);
    };
    // Entrar o salir cambia el alto de la ventana: las escenas miden en svh y los
    // disparadores del scroll tienen que volver a medirse, o los cortes caen corridos.
    // Con Esc el navegador sale de la pantalla completa; el modo cine sale con ella.
    const alCambiarPantalla = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      if (!document.fullscreenElement) setCine(false);
    };
    window.addEventListener("pointermove", despertar, { passive: true });
    document.addEventListener("fullscreenchange", alCambiarPantalla);
    return () => {
      window.clearTimeout(espera);
      window.removeEventListener("pointermove", despertar);
      document.removeEventListener("fullscreenchange", alCambiarPantalla);
      delete raizHtml.dataset.cine;
    };
  }, [cine]);

  const ultimoTiempo = (indice: number) => Math.max((escenas[indice]?.narracion.length ?? 1) - 1, 0);

  useGSAP(
    () => {
      const contenedor = raiz.current;
      if (!contenedor) return;
      const secciones = gsap.utils.toArray<HTMLElement>(".escena", contenedor);

      ScrollTrigger.create({
        trigger: contenedor,
        start: "top top",
        end: "bottom bottom",
        onLeave: () => setEnEscena(false),
        onEnterBack: () => setEnEscena(true),
      });

      const mm = gsap.matchMedia();
      // Sin movimiento no hay coreografías: basta con caer en el borde de la escena.
      let aterrizarEn: (seccion: HTMLElement) => void = aterrizar;

      mm.add(MOVIMIENTO, () => {
        const raizHtml = document.documentElement;
        raizHtml.dataset.episodios = "escenario";
        // Lenis ya suaviza la rueda: un scrub con retraso encima se sentiría
        // como arrastrar la página por barro. Sin Lenis (táctil), un poco de
        // suavizado.
        const scrub = raizHtml.classList.contains("lenis-smooth") ? true : 0.4;

        const lienzos = secciones.map((s) => s.querySelector<HTMLElement>(".escena__lienzo"));
        const cortes = lienzos.map((l) => (l ? crearCorte(l) : null));
        let iniciado = false;

        const cortarA = (indice: number, direccion: 1 | -1) => {
          lienzos.forEach((lienzo, i) => {
            if (!lienzo) return;
            const activa = i === indice;
            gsap.set(lienzo, { opacity: activa ? 1 : 0 });
            lienzo.toggleAttribute("data-activa", activa);
          });
          // Al volver se entra por el final de la escena: lo que se lee es su última línea.
          mover(indice, direccion === 1 ? 0 : ultimoTiempo(indice));
          if (!iniciado) return;
          const lineas = lienzos[indice]?.querySelector<HTMLElement>(".velocidad");
          if (lineas) lineas.dataset.direccion = direccion === 1 ? "bajando" : "subiendo";
          cortes[indice]?.restart();
        };

        cortarA(0, 1);
        const fijadas: (Fijada | null)[] = secciones.map((seccion, i) => {
          const escena = escenas[i];
          if (!escena) return null;
          if (i > 0) {
            ScrollTrigger.create({
              trigger: seccion,
              start: "top top",
              onEnter: () => cortarA(i, 1),
              onLeaveBack: () => cortarA(i - 1, -1),
            });
          }
          return coreografiaFijada(escena, seccion, {
            scrub,
            alCambiarTiempo: (tiempo) => {
              if (indiceActual.current === i) mover(i, tiempo);
            },
          });
        });

        // En una escena con coreografía, el borde es el instante antes de que
        // entre lo primero: se aterriza donde su primer momento ya se ve entero.
        aterrizarEn = (seccion) => {
          const fijada = fijadas[secciones.indexOf(seccion)];
          if (fijada) requestAnimationFrame(() => fijada.irA(0));
          else aterrizar(seccion);
        };

        // Con teclado, el foco puede caer en un enlace de una escena o de un
        // tiempo que todavía no está en pantalla: el scroll lo va a buscar.
        const alEnfocar = (evento: FocusEvent) => {
          const objetivo = evento.target;
          if (!(objetivo instanceof Element)) return;
          const i = secciones.findIndex((seccion) => seccion.contains(objetivo));
          const seccion = secciones[i];
          if (!seccion) return;
          const marcas = gsap.utils.toArray<HTMLElement>("[data-tiempo]", seccion);
          const tiempo = Math.max(
            marcas.findIndex((marca) => marca.contains(objetivo)),
            0,
          );
          if (indiceActual.current === i && tiempoActual.current === tiempo) return;
          const fijada = fijadas[i];
          if (fijada) fijada.irA(tiempo);
          else window.scrollTo({ top: seccion.getBoundingClientRect().top + window.scrollY + 2, behavior: "instant" });
        };
        contenedor.addEventListener("focusin", alEnfocar);

        // Las flechas pasan la serie como diapositivas: cada pulsación lleva al
        // siguiente momento (una línea, un paso o una escena), sin dejarla apretada.
        const paradas = () =>
          secciones
            .flatMap((seccion, i) => {
              const fijada = fijadas[i];
              const tiempos = escenas[i]?.narracion.length ?? 1;
              if (fijada) {
                return Array.from({ length: tiempos }, (_, t) => fijada.destino(t)).filter(
                  (top): top is number => top !== null,
                );
              }
              // Una escena sin coreografía se ve entera apenas su borde llega arriba.
              return [i === 0 ? 0 : seccion.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.1];
            })
            .sort((a, b) => a - b);
        const paradaHacia = (direccion: 1 | -1) => {
          const actual = window.scrollY;
          const todas = paradas();
          return direccion === 1 ? todas.find((top) => top > actual + 4) : todas.findLast((top) => top < actual - 4);
        };
        const alTeclear = (evento: KeyboardEvent) => {
          const direccion = TECLAS_PASO[evento.key];
          if (!direccion || evento.altKey || evento.ctrlKey || evento.metaKey) return;
          if (evento.target instanceof HTMLInputElement || evento.target instanceof HTMLTextAreaElement) return;
          evento.preventDefault();
          // Dejarla apretada no encadena saltos: un paso por pulsación.
          if (evento.repeat) return;
          const destino = paradaHacia(direccion);
          if (destino !== undefined) window.scrollTo({ top: destino, behavior: "smooth" });
        };
        window.addEventListener("keydown", alTeclear);

        // En el teléfono la inercia del dedo recorre más de un momento por gesto
        // (un título mide ~340 px y un deslizamiento suelta 1000 o más), y cruza
        // los cortes de golpe. Dentro de la serie el dedo pasa un momento por
        // gesto, como las flechas; fuera de ella el scroll vuelve a ser nativo.
        let toque: { x: number; y: number; dio: boolean } | null = null;
        const alTocar = (evento: TouchEvent) => {
          const dedo = evento.touches[0];
          toque = evento.touches.length === 1 && dedo ? { x: dedo.clientX, y: dedo.clientY, dio: false } : null;
        };
        const alArrastrar = (evento: TouchEvent) => {
          const dedo = evento.touches[0];
          if (!toque || !dedo || !evento.cancelable) return;
          const dy = toque.y - dedo.clientY;
          // Un gesto de lado (la galería, un zoom) sigue siendo del navegador.
          if (Math.abs(dy) < Math.abs(toque.x - dedo.clientX)) return;
          const direccion = dy > 0 ? 1 : -1;
          const destino = paradaHacia(direccion);
          if (destino === undefined) return;
          evento.preventDefault();
          if (toque.dio || Math.abs(dy) < UMBRAL_GESTO) return;
          toque.dio = true;
          window.scrollTo({ top: destino, behavior: "smooth" });
        };
        const alSoltar = () => (toque = null);
        window.addEventListener("touchstart", alTocar, { passive: true });
        window.addEventListener("touchmove", alArrastrar, { passive: false });
        window.addEventListener("touchend", alSoltar, { passive: true });
        window.addEventListener("touchcancel", alSoltar, { passive: true });
        requestAnimationFrame(() => {
          iniciado = true;
        });


        return () => {
          contenedor.removeEventListener("focusin", alEnfocar);
          window.removeEventListener("keydown", alTeclear);
          window.removeEventListener("touchstart", alTocar);
          window.removeEventListener("touchmove", alArrastrar);
          window.removeEventListener("touchend", alSoltar);
          window.removeEventListener("touchcancel", alSoltar);
          delete raizHtml.dataset.episodios;
          lienzos.forEach((l) => l?.removeAttribute("data-activa"));
        };
      });

      // Sin pin ni scrub: todo está en su lugar y el narrador solo sigue la lectura.
      mm.add(MENOS_MOVIMIENTO, () => {
        secciones.forEach((seccion, i) => {
          // Los tiempos de la escena son sus pasos, que aquí se leen uno tras otro.
          const tiempos = [seccion, ...gsap.utils.toArray<HTMLElement>("[data-tiempo]", seccion).slice(1)];
          tiempos.forEach((nodo, tiempo) => {
            if (i === 0 && tiempo === 0) return;
            const anterior: Momento =
              tiempo > 0 ? { escena: i, tiempo: tiempo - 1 } : { escena: i - 1, tiempo: ultimoTiempo(i - 1) };
            ScrollTrigger.create({
              trigger: nodo,
              start: "top 55%",
              onEnter: () => mover(i, tiempo),
              onLeaveBack: () => mover(anterior.escena, anterior.tiempo),
            });
          });
        });
      });

      // Llegar con un ancla (la ficha vuelve a #ep5-proyectos, y hay enlaces viejos
      // a #projects): el corte cae justo en el borde de la escena, así que se
      // aterriza un poco adentro de ella.
      const seguirAncla = () => {
        const anclada = escenaDelAncla(secciones);
        if (anclada) aterrizarEn(anclada);
      };
      seguirAncla();
      window.addEventListener("hashchange", seguirAncla);

      // Geist llega después del primer cálculo y cambia los altos.
      void document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("hashchange", seguirAncla);
        mm.revert();
      };
    },
    { scope: raiz, dependencies: [escenas] },
  );

  const escena = escenas[momento.escena];
  const linea = escena && enEscena ? narradorDeGuion.linea(escena, momento.tiempo) : null;

  return (
    <TextosEscena.Provider value={textos}>
      <CabeceraSerie
        rotulo={rotuloHasta(escenas, momento.escena)}
        tono={escena?.tono ?? "claro"}
        rutas={rutas}
        textos={textos}
      />
      <div ref={raiz} className="episodios" onClick={alPulsar}>
        {escenas.map((e, i) => (
          <EscenaEnPantalla key={e.id} escena={e} orden={i + 1} />
        ))}
      </div>
      {cine && (
        <div className="controles-cine">
          <button type="button" className="controles-cine__boton pulsable" onClick={salirDeCine}>
            {textos.salir}
          </button>
        </div>
      )}
      <Subtitulos linea={linea} tono={escena?.tono ?? "claro"} />
    </TextosEscena.Provider>
  );
}
