import type { CanastaPrearmada as TCanasta } from "../types/datos";
import { producto, productorDe } from "../lib/datos";
import { usePedido } from "../context/PedidoContext";
import { rangoPesos } from "../lib/format";
import Verdura from "../illustrations/Verdura";

export default function CanastaPrearmada({ canasta }: { canasta: TCanasta }) {
  const { canastaId, elegirCanasta } = usePedido();
  const elegida = canastaId === canasta.id;

  const precio =
    canasta.precioMin != null && canasta.precioMax != null
      ? rangoPesos(canasta.precioMin, canasta.precioMax)
      : "Precio por confirmar";

  const productos = canasta.contiene.map((id) => producto(id)).filter(Boolean);

  return (
    <div
      className={`flex flex-col rounded-3xl border-2 bg-crema p-6 transition-colors ${
        elegida ? "border-jitomate ring-2 ring-jitomate/20" : "border-tierra/15"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif text-2xl text-musgo">{canasta.nombre}</h3>
          {canasta.kg && <p className="text-sm text-tierra">~{canasta.kg} kg de verdura</p>}
        </div>
        {canasta.esEjemplo && (
          <span className="shrink-0 rounded-full bg-ocre/20 px-2 py-0.5 text-[11px] font-semibold text-ocre-hondo">
            ejemplo
          </span>
        )}
      </div>

      <p className="mt-2 text-2xl font-semibold text-jitomate">{precio}</p>
      <p className="mt-3 flex-1 text-sm text-tinta-suave">{canasta.descripcion}</p>

      {/* Contenido */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-tierra">Esta semana trae</p>
        <ul className="flex flex-wrap gap-2">
          {productos.map((prod) => {
            if (!prod) return null;
            const productor = productorDe(prod);
            return (
              <li
                key={prod.id}
                className="flex items-center gap-1.5 rounded-full bg-hueso px-2.5 py-1 text-xs text-tinta"
                title={productor ? `${prod.nombre} · ${productor.municipio}` : prod.nombre}
              >
                <Verdura nombre={prod.icono} size={18} />
                {prod.nombre}
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={() => elegirCanasta(canasta.id)}
        aria-pressed={elegida}
        className={`mt-6 rounded-full px-5 py-3 font-medium transition-colors ${
          elegida
            ? "bg-jitomate text-crema hover:bg-jitomate-hondo"
            : "border-2 border-hoja text-hoja hover:bg-hoja hover:text-crema"
        }`}
      >
        {elegida ? "✓ Elegida" : "Elegir esta canasta"}
      </button>
    </div>
  );
}
