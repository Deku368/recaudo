import { semana, fechaLarga } from "../lib/semana";

const PASOS = [
  { clave: "anuncio" as const, titulo: "Se anuncia", detalle: "Publicamos la canasta de la semana" },
  { clave: "cierre" as const, titulo: "Cierran pedidos", detalle: "Último momento para pedir" },
  { clave: "entregaTienda" as const, titulo: "Entrega en tienda", detalle: "Recoges en el restaurante, sin costo" },
  { clave: "entregaDomicilio" as const, titulo: "Entrega a domicilio", detalle: "Llega por la mañana a tu casa" },
];

/** Línea visual del ciclo semanal: anuncio → cierre → entregas. */
export default function CicloLinea() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PASOS.map((paso, i) => {
        const fecha = semana.ciclo[paso.clave];
        const esCierre = paso.clave === "cierre";
        return (
          <li
            key={paso.clave}
            className={`relative rounded-2xl border p-4 ${
              esCierre ? "border-jitomate/40 bg-jitomate/5" : "border-tierra/15 bg-crema"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  esCierre ? "bg-jitomate text-crema" : "bg-hoja text-crema"
                }`}
              >
                {i + 1}
              </span>
              <span className="font-semibold text-musgo">{paso.titulo}</span>
            </div>
            <p className="mt-2 text-sm text-tierra first-letter:uppercase">{fechaLarga(fecha)}</p>
            <p className="mt-1 text-sm text-tinta-suave">{paso.detalle}</p>
          </li>
        );
      })}
    </ol>
  );
}
