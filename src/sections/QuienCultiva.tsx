import { useState } from "react";
import { Link } from "react-router-dom";
import Banda from "../components/Banda";
import EncabezadoSeccion from "../components/EncabezadoSeccion";
import MapaPuebla from "../components/MapaPuebla";
import Reveal from "../components/Reveal";
import EtiquetaEjemplo from "../components/EtiquetaEjemplo";
import Verdura from "../illustrations/Verdura";
import { productores, productosDe } from "../lib/datos";

export default function QuienCultiva() {
  const [seleccionado, setSeleccionado] = useState<string>(productores[0].id);
  const activo = productores.find((p) => p.id === seleccionado) ?? productores[0];
  const productosActivo = productosDe(activo.id);

  return (
    <Banda id="productores" fondo="bg-hueso-hondo">
      <EncabezadoSeccion
        kicker="Quién lo cultiva"
        titulo="Detrás de cada verdura hay una familia"
        intro="Ninguna verdura aparece aquí sin su productor. Toca una región del mapa de Puebla o elige de la lista para conocer quién la cultiva y desde dónde llega a tu mesa."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Mapa + lista */}
        <Reveal>
          <MapaPuebla seleccionado={seleccionado} onSelect={setSeleccionado} />

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Lista de productores">
            {productores.map((p) => {
              const esActivo = p.id === seleccionado;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => setSeleccionado(p.id)}
                    aria-pressed={esActivo}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      esActivo
                        ? "border-jitomate bg-jitomate text-crema"
                        : "border-tierra/25 bg-crema/60 text-tinta hover:border-jitomate/50"
                    }`}
                  >
                    {p.municipio}
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* Ficha-preview del productor seleccionado */}
        <Reveal
          key={activo.id}
          className="rounded-3xl border border-tierra/15 bg-crema p-6 shadow-sm md:p-8"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-jitomate">{activo.municipio}</p>
              <h3 className="mt-1 text-2xl text-musgo">{activo.nombre}</h3>
            </div>
            <div className="flex shrink-0 -space-x-2">
              {productosActivo.slice(0, 3).map((prod) => (
                <span
                  key={prod.id}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-crema bg-hueso"
                >
                  <Verdura nombre={prod.icono} size={30} titulo={prod.nombre} />
                </span>
              ))}
            </div>
          </div>

          {activo.esEjemplo ? (
            <EtiquetaEjemplo />
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-hoja/15 px-2.5 py-0.5 text-xs font-semibold text-hoja">
              ✓ Productor confirmado
            </span>
          )}

          <p className="mt-4 text-tinta-suave">{activo.historia}</p>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="font-semibold text-musgo">Produce:</dt>
              <dd className="text-tinta-suave">{activo.produce.join(", ")}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-musgo">Temporada:</dt>
              <dd className="text-tinta-suave">{activo.temporada}</dd>
            </div>
          </dl>

          <Link
            to={`/productor/${activo.slug}`}
            className="mt-6 inline-flex items-center gap-1 font-medium text-jitomate hover:text-jitomate-hondo"
          >
            Ver ficha completa
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </Banda>
  );
}
