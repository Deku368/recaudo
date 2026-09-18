import { useState, useEffect } from "react";
import LogoRecaudo from "./LogoRecaudo";
import { SECCIONES, useIrASeccion } from "../lib/navegacion";

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const [encogido, setEncogido] = useState(false);
  const irA = useIrASeccion();

  useEffect(() => {
    const alScroll = () => setEncogido(window.scrollY > 20);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  const ir = (id: string) => {
    setAbierto(false);
    irA(id);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        encogido ? "bg-hueso/90 shadow-sm backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="envoltura flex items-center justify-between py-3" aria-label="Principal">
        <button onClick={() => ir("inicio")} className="flex items-center" aria-label="Ir al inicio">
          <LogoRecaudo />
        </button>

        {/* Navegación de escritorio */}
        <ul className="hidden items-center gap-6 md:flex">
          {SECCIONES.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => ir(s.id)}
                className="text-sm font-medium text-tinta-suave transition-colors hover:text-jitomate"
              >
                {s.nombre}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => ir("pedido")}
              className="rounded-full bg-jitomate px-5 py-2 text-sm font-medium text-crema transition-colors hover:bg-jitomate-hondo"
            >
              Pedir la canasta
            </button>
          </li>
        </ul>

        {/* Botón de menú móvil */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-musgo md:hidden"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
            {abierto ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {abierto && (
        <div id="menu-movil" className="textura-papel border-t border-hueso-hondo bg-hueso md:hidden">
          <ul className="envoltura flex flex-col gap-1 py-3">
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => ir(s.id)}
                  className="w-full rounded-lg px-3 py-3 text-left font-medium text-tinta hover:bg-hueso-hondo"
                >
                  {s.nombre}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => ir("pedido")}
                className="mt-1 w-full rounded-full bg-jitomate px-3 py-3 text-center font-medium text-crema"
              >
                Pedir la canasta
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
