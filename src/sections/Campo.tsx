import { motion, useReducedMotion } from "motion/react";
import Verdura from "../illustrations/Verdura";
import BotonWhatsApp from "../components/BotonWhatsApp";
import { useIrASeccion } from "../lib/navegacion";
import { semana, fechaCorta } from "../lib/semana";

// Verduras que flotan suavemente en el fondo del hero.
const flotantes = [
  { nombre: "jitomate", top: "14%", left: "8%", size: 74, dur: 7 },
  { nombre: "zanahoria", top: "68%", left: "12%", size: 62, dur: 8 },
  { nombre: "acelga", top: "22%", left: "82%", size: 80, dur: 9 },
  { nombre: "quinoa", top: "72%", left: "78%", size: 58, dur: 6.5 },
  { nombre: "betabel", top: "46%", left: "90%", size: 50, dur: 7.5 },
];

export default function Campo() {
  const irA = useIrASeccion();
  const reducir = useReducedMotion();

  return (
    <section id="inicio" className="relative overflow-hidden scroll-mt-20">
      {/* Fondo con blobs orgánicos en capas */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-crema via-hueso to-hueso" />
        <svg className="absolute -left-24 -top-24 h-[420px] w-[420px] text-hoja-clara/25" viewBox="0 0 200 200">
          <path
            fill="currentColor"
            d="M43 -63C56 -54 66 -42 71 -28C76 -14 76 2 71 16C66 30 56 42 43 51C30 60 15 66 -1 68C-17 70 -34 68 -47 59C-60 50 -69 34 -72 17C-75 0 -72 -18 -63 -31C-54 -44 -39 -52 -25 -60C-11 -68 3 -76 17 -75C31 -74 30 -72 43 -63Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg className="absolute -bottom-32 -right-16 h-[460px] w-[460px] text-ocre/20" viewBox="0 0 200 200">
          <path
            fill="currentColor"
            d="M39 -57C52 -49 65 -40 71 -27C77 -14 76 3 70 18C64 33 53 46 39 55C25 64 8 69 -8 68C-24 67 -41 60 -53 48C-65 36 -72 19 -72 2C-72 -15 -65 -32 -53 -43C-41 -54 -24 -59 -8 -63C8 -67 26 -65 39 -57Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Verduras flotantes decorativas (ocultas en móvil para no estorbar) */}
      <div className="pointer-events-none absolute inset-0 -z-0 hidden md:block" aria-hidden="true">
        {flotantes.map((f) => (
          <motion.div
            key={f.nombre}
            className="absolute opacity-70"
            style={{ top: f.top, left: f.left }}
            animate={reducir ? undefined : { y: [0, -14, 0], rotate: [0, 4, 0] }}
            transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut" }}
          >
            <Verdura nombre={f.nombre} size={f.size} />
          </motion.div>
        ))}
      </div>

      <div className="envoltura relative flex min-h-[86vh] flex-col items-center justify-center py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl border border-hoja/30 bg-crema/70 px-4 py-1.5 text-center text-xs font-medium text-hoja sm:rounded-full sm:text-sm"
        >
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-jitomate" />
          <span>
            {semana.estacion} · {semana.etiqueta}
          </span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full max-w-3xl text-balance text-4xl leading-[1.05] text-musgo sm:text-5xl md:text-6xl"
        >
          Del campo a tu mesa,
          <span className="text-jitomate"> sin intermediarios</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 w-full max-w-xl text-pretty text-lg text-tinta-suave"
        >
          Comida local y de temporada en Cholula. Compramos directo a productores de la
          región y cada semana armamos una canasta con lo que la tierra está dando. Aquí
          sabes quién cultivó lo que te comes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            onClick={() => irA("canasta")}
            className="inline-flex items-center gap-2 rounded-full bg-jitomate px-7 py-3.5 font-medium text-crema shadow-sm transition-colors hover:bg-jitomate-hondo"
          >
            Ver la canasta de esta semana
          </button>
          <BotonWhatsApp variante="contorno" />
        </motion.div>

        <button
          onClick={() => irA("productores")}
          className="mt-14 flex flex-col items-center gap-1 text-sm text-tierra transition-colors hover:text-jitomate"
        >
          <span>Conoce a quién lo cultiva</span>
          <motion.svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={reducir ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>

        <p className="mt-6 w-full max-w-md text-pretty text-xs text-tierra/70">
          Pedidos abiertos hasta el miércoles · entrega {fechaCorta(semana.ciclo.entregaTienda)} en
          tienda o {fechaCorta(semana.ciclo.entregaDomicilio)} a domicilio
        </p>
      </div>
    </section>
  );
}
