const INICIALES = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

interface Props {
  meses: number[]; // 1–12
  resaltar?: number; // mes a marcar con borde (p.ej. el mes actual)
}

/**
 * Tira de 12 meses; se pintan los que están en temporada.
 * Las celdas son flexibles: se ajustan al ancho disponible (nunca desbordan
 * en móvil) y no crecen más de lo necesario en pantallas grandes.
 */
export default function MesesBarra({ meses, resaltar }: Props) {
  return (
    <div
      className="flex w-full gap-1"
      role="img"
      aria-label={`En temporada: ${meses.map((m) => INICIALES[m - 1]).join(", ")}`}
    >
      {INICIALES.map((ini, i) => {
        const mes = i + 1;
        const activo = meses.includes(mes);
        const esResaltado = resaltar === mes;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`flex aspect-square min-w-0 max-w-[30px] flex-1 items-center justify-center rounded-md text-[11px] font-semibold ${
              activo ? "bg-hoja text-crema" : "bg-hueso-hondo text-tierra/50"
            } ${esResaltado ? "ring-2 ring-jitomate ring-offset-1 ring-offset-crema" : ""}`}
          >
            {ini}
          </span>
        );
      })}
    </div>
  );
}
