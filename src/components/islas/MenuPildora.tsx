import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';


/**
 * La píldora del centro de la cabecera de la referencia, replicada de su
 * bundle: un botón que abre un panel, con las dos rayas del ícono que se
 * cruzan en aspa, el rótulo que rota de "Menú" a "Cerrar" deslizándose, el
 * porcentaje de la página recorrido, y el panel que baja desplegando sus
 * enlaces uno detrás de otro.
 *
 * Los enlaces los pone Astro: son los de la landing, no los de la plantilla.
 */

// La misma `--salida` del sitio: la curva de la referencia era ella con otros
// decimales y no valía un cuarto juego de números.
const SUAVE = [0.23, 1, 0.32, 1] as const;

const ANCHO = { abierta: 296, escritorio: 200, movil: 128 } as const;
const SOMBRA = {
  abierta: '0 30px 70px -24px rgba(0,0,0,0.25)',
  cerrada: '0 30px 70px -24px rgba(0,0,0,0)',
} as const;

interface Enlace {
  readonly texto: string;
  readonly href: string;
  /** Los enlaces externos abren en otra pestaña. */
  readonly externo?: boolean;
}

interface Props {
  readonly abrir: string;
  readonly cerrar: string;
  readonly grupos: readonly {
    readonly titulo: string;
    readonly enlaces: readonly Enlace[];
    /** El primer grupo va en grande, como en la referencia. */
    readonly grande?: boolean;
    /** Las redes van en fila, no en columna. */
    readonly enFila?: boolean;
  }[];
}

/**
 * Cada elemento del panel entra con un resorte y un retraso propio. El retraso
 * va TOPEADO: son trece elementos y sin tope el último abría a 1,13 s. Con el
 * tope, el menú termina de abrirse en 0,52 s.
 */
const retraso = (i: number) => Math.min(0.04 + 0.03 * i, 0.22);

const ENTRADA = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.2, ease: SUAVE, delay: retraso(i) },
      y: { type: 'spring' as const, duration: 0.3, bounce: 0.1, delay: retraso(i) },
    },
  }),
};

function Aspa({ abierto, seco }: { abierto: boolean; seco: boolean | null }) {
  const paso = seco ? { duration: 0.01 } : { duration: 0.4, ease: SUAVE };
  return (
    <span className="pildora__icono" aria-hidden="true">
      <motion.span
        initial={false}
        animate={{ y: abierto ? 0 : -3, rotate: abierto ? 45 : 0 }}
        transition={paso}
      />
      <motion.span
        initial={false}
        animate={{ y: abierto ? 0 : 3, rotate: abierto ? -45 : 0 }}
        transition={paso}
      />
    </span>
  );
}

function Rotulo({ valor, seco }: { valor: string; seco: boolean | null }) {
  const ancho = `${Math.max(valor.length, 6)}ch`;
  if (seco) {
    return (
      <span className="pildora__rotulo pildora__rotulo--seco" style={{ minWidth: ancho }}>
        {valor}
      </span>
    );
  }
  return (
    <span className="pildora__rotulo" style={{ minWidth: ancho }}>
      <AnimatePresence initial={false}>
        <motion.span
          key={valor}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.28, ease: SUAVE }}
          aria-hidden="true"
        >
          {valor}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Avance() {
  const { scrollYProgress } = useScroll();
  const [porcentaje, setPorcentaje] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setPorcentaje(Math.round(100 * v)));
  return (
    <span className="pildora__avance" aria-hidden="true">
      {porcentaje}%
    </span>
  );
}

export default function MenuPildora({ abrir, cerrar, grupos }: Props) {
  const seco = useReducedMotion();
  const [abierto, setAbierto] = useState(false);
  const [escritorio, setEscritorio] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const consulta = window.matchMedia('(min-width: 768px)');
    const leer = () => setEscritorio(consulta.matches);
    leer();
    consulta.addEventListener('change', leer);
    return () => consulta.removeEventListener('change', leer);
  }, []);

  // Escape cierra y devuelve el foco al botón, como en la referencia.
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [abierto]);

  const cerrarPanel = () => setAbierto(false);

  // El escalón de entrada de cada pieza, calculado ANTES del marcado. Iba con
  // un contador que se incrementaba durante el render: funciona porque vuelve
  // a cero en cada pasada, pero se rompe en cuanto alguien memoice un trozo.
  const escalones = useMemo(() => {
    const mapa = new Map<string, number>();
    let n = 0;
    for (const grupo of grupos) {
      mapa.set(`titulo:${grupo.titulo}`, n++);
      for (const enlace of grupo.enlaces) mapa.set(`enlace:${enlace.href}`, n++);
    }
    return mapa;
  }, [grupos]);

  return (
    <>
      <motion.div
        className="pildora"
        initial={false}
        animate={{
          width: abierto ? ANCHO.abierta : escritorio ? ANCHO.escritorio : ANCHO.movil,
          boxShadow: abierto ? SOMBRA.abierta : SOMBRA.cerrada,
        }}
        transition={seco ? { duration: 0.01 } : { duration: 0.24, ease: SUAVE }}
      >
        <motion.div
          className="pildora__fondo"
          initial={false}
          animate={{ opacity: abierto ? 1 : 0 }}
          transition={{ duration: 0.2, ease: SUAVE }}
        />

        <div className="pildora__cuerpo">
          <div className="pildora__barra">
            <button
              ref={boton}
              type="button"
              className="pildora__boton pulsable"
              aria-expanded={abierto}
              aria-controls="menu-panel"
              aria-label={abierto ? cerrar : abrir}
              onClick={() => setAbierto((v) => !v)}
            >
              <Aspa abierto={abierto} seco={seco} />
              <Rotulo valor={abierto ? cerrar : abrir} seco={seco} />
            </button>
            {escritorio && <Avance />}
          </div>

          <AnimatePresence initial={false}>
            {abierto && (
              <motion.nav
                key="panel"
                id="menu-panel"
                aria-label={abrir}
                className="pildora__panel"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={seco ? { duration: 0.01 } : { duration: 0.24, ease: SUAVE }}
              >
                <div className="pildora__centrado">
                  <motion.div
                    className="pildora__lista"
                    initial={seco ? false : 'hidden'}
                    animate={seco ? undefined : 'visible'}
                  >
                    {grupos.map((grupo, g) => (
                      <div
                        key={grupo.titulo}
                        role="group"
                        aria-labelledby={`menu-grupo-${g}`}
                        className={`pildora__grupo${grupo.grande ? ' pildora__grupo--grande' : ''}${g > 0 ? ' pildora__grupo--separado' : ''}`}
                      >
                        <motion.span
                          id={`menu-grupo-${g}`}
                          className="pildora__titulo"
                          custom={escalones.get(`titulo:${grupo.titulo}`) ?? 0}
                          variants={ENTRADA}
                        >
                          {grupo.titulo}
                        </motion.span>
                        <div className={grupo.enFila ? 'pildora__fila' : 'pildora__columna'}>
                          {grupo.enlaces.map((enlace) => (
                            <motion.a
                              key={enlace.href}
                              href={enlace.href}
                              onClick={cerrarPanel}
                              target={enlace.externo ? '_blank' : undefined}
                              rel={enlace.externo ? 'noopener noreferrer' : undefined}
                              className="pildora__enlace"
                              custom={escalones.get(`enlace:${enlace.href}`) ?? 0}
                              variants={ENTRADA}
                            >
                              {enlace.texto}
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Un clic en cualquier otra parte cierra el panel.

          `tabIndex={-1}`: cubre toda la ventana con z-index negativo, así que
          al tabular tomaba el foco sin que se viera nada. Con teclado el panel
          se cierra con Escape, que ya está resuelto arriba. */}
      <AnimatePresence>
        {abierto && (
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            aria-label={cerrar}
            onClick={cerrarPanel}
            className="pildora__telon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
