import type { EstadoProducto } from "../types/datos";

const ESTILOS: Record<EstadoProducto, { texto: string; clase: string }> = {
  disponible: { texto: "Disponible", clase: "bg-hoja/15 text-hoja" },
  pocas: { texto: "Quedan pocas", clase: "bg-ocre/25 text-ocre-hondo" },
  agotado: { texto: "Agotado", clase: "bg-tierra/15 text-tierra" },
};

export default function EstadoBadge({ estado }: { estado: EstadoProducto }) {
  const e = ESTILOS[estado];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${e.clase}`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {e.texto}
    </span>
  );
}
