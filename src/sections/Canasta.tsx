import Banda from "../components/Banda";
import EncabezadoSeccion from "../components/EncabezadoSeccion";
import Reveal from "../components/Reveal";
import CicloLinea from "../components/CicloLinea";
import CanastaPrearmada from "../components/CanastaPrearmada";
import Armador from "../components/Armador";
import { semana } from "../lib/semana";
import { producto } from "../lib/datos";
import { useIrASeccion } from "../lib/navegacion";
import { usePedido } from "../context/PedidoContext";

export default function Canasta() {
  const irA = useIrASeccion();
  const { canastaId, totalUnidades } = usePedido();
  const haySeleccion = canastaId !== null || totalUnidades > 0;

  return (
    <Banda id="canasta" fondo="bg-hueso-hondo">
      <EncabezadoSeccion
        kicker="A tu mesa"
        titulo="La canasta de esta semana"
        intro="Se anuncia el domingo, los pedidos cierran el miércoles y entregamos el jueves en el restaurante o el viernes por la mañana a domicilio."
      />

      {/* Ciclo */}
      <Reveal className="mt-8">
        <CicloLinea />
      </Reveal>

      {/* Canastas prearmadas */}
      <div className="mt-14">
        <Reveal>
          <h3 className="text-2xl text-musgo">Canastas prearmadas</h3>
          <p className="mt-2 max-w-2xl text-tinta-suave">
            Nosotros elegimos lo mejor de la semana. Elige el tamaño que te acomode.
          </p>
        </Reveal>
        <Reveal className="mt-6 grid gap-5 md:grid-cols-3">
          {semana.canastas.map((c) => (
            <CanastaPrearmada key={c.id} canasta={c} />
          ))}
        </Reveal>
      </div>

      {/* Sustituciones de la semana */}
      {semana.sustituciones.length > 0 && (
        <Reveal className="mt-8 rounded-2xl border border-ocre/30 bg-ocre/10 p-4 text-sm text-tierra">
          <p className="font-semibold text-ocre-hondo">Cambios de esta semana</p>
          <ul className="mt-1 space-y-1">
            {semana.sustituciones.map((s, i) => {
              const sale = producto(s.sale);
              const entra = producto(s.entra);
              return (
                <li key={i}>
                  La <strong>{entra?.nombre}</strong> sustituye a la <strong>{sale?.nombre}</strong>
                  {s.motivo ? ` — ${s.motivo}.` : "."}
                </li>
              );
            })}
          </ul>
        </Reveal>
      )}

      {/* Armador */}
      <div className="mt-14">
        <Reveal>
          <h3 className="text-2xl text-musgo">…o arma la tuya</h3>
          <p className="mt-2 max-w-2xl text-tinta-suave">
            Elige exactamente lo que quieres. El total se actualiza al momento. Cada producto
            dice quién lo cultiva y cómo va la disponibilidad de la semana.
          </p>
        </Reveal>
        <Reveal className="mt-6">
          <Armador />
        </Reveal>
      </div>

      {/* Ir al pedido */}
      <Reveal className="mt-12 flex flex-col items-center gap-3 text-center">
        <button
          onClick={() => irA("pedido")}
          className="rounded-full bg-jitomate px-8 py-4 text-lg font-medium text-crema shadow-sm transition-colors hover:bg-jitomate-hondo"
        >
          Continuar con mi pedido →
        </button>
        {!haySeleccion && (
          <p className="text-sm text-tierra">
            Elige una canasta prearmada o agrega productos al armador para continuar.
          </p>
        )}
      </Reveal>
    </Banda>
  );
}
