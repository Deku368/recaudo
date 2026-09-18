import { useState } from "react";
import { Link } from "react-router-dom";
import Banda from "../components/Banda";
import EncabezadoSeccion from "../components/EncabezadoSeccion";
import Reveal from "../components/Reveal";
import Verdura from "../illustrations/Verdura";
import MesesBarra from "../components/MesesBarra";
import { productosEnMes, productorDe, mesActualMx, NOMBRES_MES } from "../lib/datos";

const ABREV = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function Calendario() {
  const mesHoy = mesActualMx();
  const [mes, setMes] = useState(mesHoy);
  const productos = productosEnMes(mes);

  return (
    <Banda id="calendario">
      <EncabezadoSeccion
        kicker="Calendario de temporada"
        titulo="Cada mes da algo distinto"
        intro="La tierra no produce lo mismo todo el año. Elige un mes y mira qué está en su punto. Comer de temporada es comer mejor, más fresco y más barato."
      />

      {/* Selector de mes */}
      <Reveal className="mt-8">
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Meses del año">
          {ABREV.map((ab, i) => {
            const m = i + 1;
            const activo = m === mes;
            return (
              <button
                key={m}
                role="tab"
                aria-selected={activo}
                onClick={() => setMes(m)}
                className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activo
                    ? "bg-jitomate text-crema"
                    : "bg-hueso-hondo text-tinta-suave hover:bg-arena"
                } ${m === mesHoy && !activo ? "ring-1 ring-jitomate/40" : ""}`}
              >
                {ab}
                {m === mesHoy && <span className="ml-1 text-[10px] opacity-80">hoy</span>}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Productos del mes */}
      <Reveal key={mes} className="mt-8">
        <p className="mb-5 text-lg text-tinta-suave">
          En <span className="font-semibold capitalize text-musgo">{NOMBRES_MES[mes - 1]}</span> puedes encontrar{" "}
          <span className="font-semibold text-jitomate">{productos.length}</span>{" "}
          {productos.length === 1 ? "producto" : "productos"} de temporada:
        </p>

        {productos.length === 0 ? (
          <p className="rounded-2xl bg-hueso-hondo p-6 text-tinta-suave">
            No hay productos cargados para este mes en los datos de ejemplo.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((prod) => {
              const productor = productorDe(prod);
              return (
                <li key={prod.id} className="flex flex-col rounded-2xl border border-tierra/15 bg-crema p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-hueso">
                      <Verdura nombre={prod.icono} size={38} titulo={prod.nombre} />
                    </span>
                    <div>
                      <p className="font-medium text-musgo">{prod.nombre}</p>
                      <p className="text-sm text-tierra">por {prod.unidad}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <MesesBarra meses={prod.mesesTemporada} resaltar={mes} />
                  </div>

                  {productor && (
                    <Link
                      to={`/productor/${productor.slug}`}
                      className="mt-4 text-sm font-medium text-jitomate hover:text-jitomate-hondo"
                    >
                      {productor.municipio} · {productor.nombre.replace(" (ejemplo)", "")} →
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Reveal>
    </Banda>
  );
}
