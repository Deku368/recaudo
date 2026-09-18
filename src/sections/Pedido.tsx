import { useState } from "react";
import Banda from "../components/Banda";
import EncabezadoSeccion from "../components/EncabezadoSeccion";
import Reveal from "../components/Reveal";
import BotonWhatsApp from "../components/BotonWhatsApp";
import { usePedido } from "../context/PedidoContext";
import { useIrASeccion } from "../lib/navegacion";
import { config } from "../lib/config";
import { semana } from "../lib/semana";
import { producto, disponibilidadDe } from "../lib/datos";
import { estadoCierre, ahoraConSimulacion } from "../lib/cierre";
import { pesos } from "../lib/format";
import { enlaceWhatsApp } from "../lib/config";
import {
  calcularTotales,
  costoEnvio,
  generarFolio,
  textoTotal,
  textoWhatsApp,
  enviarPedido,
  type Entrega,
  type Pago,
  type SiSeAgota,
  type DatosPedido,
} from "../lib/pedido";

export default function Pedido() {
  const { canastaId, itemsArray, totalUnidades, limpiar } = usePedido();
  const irA = useIrASeccion();
  const cierre = estadoCierre(ahoraConSimulacion());

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [entrega, setEntrega] = useState<Entrega>("tienda");
  const [zona, setZona] = useState<string>(config.envios[0].zona);
  const [direccion, setDireccion] = useState("");
  const [pago, setPago] = useState<Pago>("transferencia");
  const [siSeAgota, setSiSeAgota] = useState<SiSeAgota>("sustituir");
  const [notas, setNotas] = useState("");
  const [confirmado, setConfirmado] = useState<{ pedido: DatosPedido; texto: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const haySeleccion = canastaId !== null || totalUnidades > 0;
  const zonaEfectiva = entrega === "domicilio" ? zona : null;
  const totales = calcularTotales(canastaId, itemsArray, entrega, zonaEfectiva);
  const envio = costoEnvio(entrega, zonaEfectiva);
  const canastaElegida = semana.canastas.find((c) => c.id === canastaId);

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!haySeleccion) {
      setError("Elige una canasta o agrega productos antes de enviar.");
      return;
    }
    if (!nombre.trim() || !telefono.trim()) {
      setError("Necesitamos tu nombre y teléfono.");
      return;
    }
    if (entrega === "domicilio" && !direccion.trim()) {
      setError("Comparte tu dirección para la entrega a domicilio.");
      return;
    }

    const pedido: DatosPedido = {
      folio: generarFolio(),
      fecha: new Date().toISOString(),
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      canastaId,
      items: itemsArray,
      entrega,
      zona: zonaEfectiva,
      direccion: direccion.trim(),
      pago,
      notas,
      siSeAgota,
      totalMin: totales.min,
      totalMax: totales.max,
      totalPorConfirmar: totales.porConfirmar,
    };

    const ok = enviarPedido(pedido);
    if (!ok) {
      setError("No pudimos guardar el pedido. Intenta de nuevo o escríbenos por WhatsApp.");
      return;
    }
    setConfirmado({ pedido, texto: textoWhatsApp(pedido) });
    window.scrollTo({ top: document.getElementById("pedido")?.offsetTop ?? 0, behavior: "smooth" });
  }

  // ── Estado: pedidos cerrados ────────────────────────────────────────────
  if (!cierre.abierto && !confirmado) {
    return (
      <Banda id="pedido">
        <EncabezadoSeccion kicker="Tu pedido" titulo="Los pedidos de esta semana están cerrados" />
        <Reveal className="mt-6 max-w-xl rounded-3xl border border-tierra/15 bg-crema p-6">
          <p className="text-tinta-suave">{cierre.mensajeCerrado}</p>
          <p className="mt-3 text-sm text-tierra">
            Abrimos el <strong className="capitalize">{cierre.aperturaDiaNombre}</strong> y cerramos el{" "}
            <strong className="capitalize">{cierre.cierreDiaNombre}</strong> a las {cierre.cierreHora},
            hora de Ciudad de México.
          </p>
          <div className="mt-5">
            <BotonWhatsApp mensaje="Hola Recaudo, quiero apartar mi canasta para la próxima semana.">
              Aparta por WhatsApp
            </BotonWhatsApp>
          </div>
        </Reveal>
      </Banda>
    );
  }

  // ── Estado: pedido confirmado ───────────────────────────────────────────
  if (confirmado) {
    const { pedido, texto } = confirmado;
    return (
      <Banda id="pedido">
        <Reveal className="mx-auto max-w-xl rounded-3xl border-2 border-hoja/30 bg-crema p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-hoja text-2xl text-crema">✓</span>
            <div>
              <h2 className="font-serif text-2xl text-musgo">¡Pedido listo!</h2>
              <p className="text-sm text-tierra">Folio {pedido.folio}</p>
            </div>
          </div>

          <p className="mt-5 text-tinta-suave">
            Falta un paso: envíanos el pedido por WhatsApp con el botón de abajo. Ya va todo
            redactado y ordenado, no tienes que escribir nada.
          </p>

          <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl bg-hueso p-4 text-sm text-tinta">
            {texto}
          </pre>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={enlaceWhatsApp(texto)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-jitomate px-6 py-3.5 font-medium text-crema hover:bg-jitomate-hondo"
            >
              Enviar por WhatsApp
            </a>
            <button
              onClick={() => {
                limpiar();
                setConfirmado(null);
                setNombre("");
                setTelefono("");
                setDireccion("");
                setNotas("");
              }}
              className="rounded-full border-2 border-hoja px-6 py-3.5 font-medium text-hoja hover:bg-hoja hover:text-crema"
            >
              Hacer otro pedido
            </button>
          </div>
        </Reveal>
      </Banda>
    );
  }

  // ── Estado: formulario abierto ──────────────────────────────────────────
  return (
    <Banda id="pedido">
      <EncabezadoSeccion
        kicker="Tu pedido"
        titulo="Cierra tu pedido en un minuto"
        intro="Al enviar se arma un mensaje de WhatsApp con todo ordenado, para que en Recaudo no tengan que recapturar nada."
      />

      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-hoja/15 px-3 py-1 text-sm text-hoja">
        <span className="inline-block h-2 w-2 rounded-full bg-hoja" />
        Pedidos abiertos · cierran el {cierre.cierreDiaNombre} a las {cierre.cierreHora}
      </p>

      <form onSubmit={alEnviar} className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* Columna de campos */}
        <div className="space-y-8">
          {/* Datos */}
          <fieldset className="space-y-4">
            <Leyenda>Tus datos</Leyenda>
            <Campo etiqueta="Nombre" htmlFor="nombre">
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className={inputClase}
                placeholder="Tu nombre"
              />
            </Campo>
            <Campo etiqueta="Teléfono" htmlFor="telefono">
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className={inputClase}
                placeholder="10 dígitos"
              />
            </Campo>
          </fieldset>

          {/* Entrega */}
          <fieldset className="space-y-4">
            <Leyenda>¿Cómo la quieres recibir?</Leyenda>
            <div className="grid gap-3 sm:grid-cols-2">
              <OpcionRadio
                nombre="entrega"
                checked={entrega === "tienda"}
                onChange={() => setEntrega("tienda")}
                titulo={`Recojo en tienda · ${config.entrega.tiendaDia}`}
                detalle="Sin costo, en el restaurante"
              />
              <OpcionRadio
                nombre="entrega"
                checked={entrega === "domicilio"}
                onChange={() => setEntrega("domicilio")}
                titulo={`A domicilio · ${config.entrega.domicilioDia}`}
                detalle="Por la mañana, según tu zona"
              />
            </div>

            {entrega === "domicilio" && (
              <div className="space-y-4 rounded-2xl bg-crema p-4">
                <Campo etiqueta="Zona de entrega" htmlFor="zona">
                  <select id="zona" value={zona} onChange={(e) => setZona(e.target.value)} className={inputClase}>
                    {config.envios.map((z) => (
                      <option key={z.zona} value={z.zona}>
                        {z.zona} ·{" "}
                        {z.porConfirmar
                          ? "costo por confirmar"
                          : z.costoMin === z.costoMax
                            ? pesos(z.costoMin ?? 0)
                            : `${pesos(z.costoMin ?? 0)}–${pesos(z.costoMax ?? 0)}`}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo etiqueta="Dirección" htmlFor="direccion">
                  <input
                    id="direccion"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className={inputClase}
                    placeholder="Calle, número, colonia y referencias"
                  />
                </Campo>
              </div>
            )}
          </fieldset>

          {/* Pago */}
          <fieldset className="space-y-4">
            <Leyenda>Forma de pago</Leyenda>
            <div className="grid gap-3 sm:grid-cols-2">
              <OpcionRadio
                nombre="pago"
                checked={pago === "transferencia"}
                onChange={() => setPago("transferencia")}
                titulo="Transferencia"
                detalle="Te compartimos los datos"
              />
              <OpcionRadio
                nombre="pago"
                checked={pago === "recoger"}
                onChange={() => setPago("recoger")}
                titulo="Pago al recoger/recibir"
                detalle="En efectivo o transferencia"
              />
            </div>
          </fieldset>

          {/* Si algo se agota */}
          <fieldset className="space-y-4">
            <Leyenda>Si algo se agota…</Leyenda>
            <div className="grid gap-3 sm:grid-cols-3">
              <OpcionRadio nombre="agota" checked={siSeAgota === "sustituir"} onChange={() => setSiSeAgota("sustituir")} titulo="Sustituir" detalle="Por algo similar" />
              <OpcionRadio nombre="agota" checked={siSeAgota === "avisar"} onChange={() => setSiSeAgota("avisar")} titulo="Avisarme" detalle="Por WhatsApp" />
              <OpcionRadio nombre="agota" checked={siSeAgota === "omitir"} onChange={() => setSiSeAgota("omitir")} titulo="Omitirlo" detalle="Sin reemplazo" />
            </div>
          </fieldset>

          {/* Notas */}
          <Campo etiqueta="Notas (opcional)" htmlFor="notas">
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className={inputClase}
              placeholder="Alguna preferencia, alergia o indicación"
            />
          </Campo>
        </div>

        {/* Columna de resumen (sticky) */}
        <aside className="lg:sticky lg:top-6">
          <div className="rounded-3xl border border-tierra/15 bg-crema p-6">
            <h3 className="font-serif text-xl text-musgo">Tu pedido</h3>

            {!haySeleccion ? (
              <p className="mt-3 text-sm text-tierra">
                Aún no eliges nada.{" "}
                <button type="button" onClick={() => irA("canasta")} className="font-medium text-jitomate hover:underline">
                  Elige tu canasta
                </button>
                .
              </p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {canastaElegida && (
                  <li className="flex justify-between gap-2">
                    <span className="text-tinta">{canastaElegida.nombre}</span>
                    <span className="text-tinta-suave">
                      {canastaElegida.precioMin != null && canastaElegida.precioMax != null
                        ? canastaElegida.precioMin === canastaElegida.precioMax
                          ? pesos(canastaElegida.precioMin)
                          : `${pesos(canastaElegida.precioMin)}–${pesos(canastaElegida.precioMax)}`
                        : "por confirmar"}
                    </span>
                  </li>
                )}
                {itemsArray.map((it) => {
                  const prod = producto(it.productoId);
                  const d = disponibilidadDe(it.productoId);
                  if (!prod) return null;
                  return (
                    <li key={it.productoId} className="flex justify-between gap-2">
                      <span className="text-tinta">
                        {it.cantidad} × {prod.nombre}
                      </span>
                      <span className="text-tinta-suave">{d?.precio != null ? pesos(d.precio * it.cantidad) : "—"}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-4 space-y-1 border-t border-tierra/15 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-tinta-suave">Envío</span>
                <span className="text-tinta-suave">
                  {entrega === "tienda"
                    ? "Sin costo"
                    : envio.porConfirmar
                      ? "Por confirmar"
                      : envio.min === envio.max
                        ? pesos(envio.min)
                        : `${pesos(envio.min)}–${pesos(envio.max)}`}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-musgo">Total</span>
                <span className="text-xl font-semibold text-jitomate">{textoTotal(totales)}</span>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-jitomate/10 px-3 py-2 text-sm text-jitomate-hondo">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-jitomate px-6 py-3.5 font-medium text-crema transition-colors hover:bg-jitomate-hondo"
            >
              Revisar y enviar
            </button>
            <p className="mt-3 text-center text-xs text-tierra">
              Se genera un folio y se arma tu mensaje de WhatsApp.
            </p>
          </div>
        </aside>
      </form>
    </Banda>
  );
}

// ── Piezas de formulario ──────────────────────────────────────────────────
const inputClase =
  "w-full rounded-xl border border-tierra/25 bg-hueso px-4 py-3 text-tinta placeholder:text-tierra/50 focus:border-jitomate focus:outline-none focus:ring-2 focus:ring-jitomate/30";

function Leyenda({ children }: { children: React.ReactNode }) {
  return <legend className="font-serif text-xl text-musgo">{children}</legend>;
}

function Campo({ etiqueta, htmlFor, children }: { etiqueta: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium text-tinta">{etiqueta}</span>
      {children}
    </label>
  );
}

function OpcionRadio({
  nombre,
  checked,
  onChange,
  titulo,
  detalle,
}: {
  nombre: string;
  checked: boolean;
  onChange: () => void;
  titulo: string;
  detalle: string;
}) {
  return (
    <label
      className={`flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition-colors ${
        checked ? "border-jitomate bg-jitomate/5" : "border-tierra/20 bg-crema hover:border-jitomate/40"
      }`}
    >
      <span className="flex items-center gap-2">
        <input type="radio" name={nombre} checked={checked} onChange={onChange} className="accent-jitomate" />
        <span className="font-medium text-musgo">{titulo}</span>
      </span>
      <span className="mt-1 pl-6 text-xs text-tierra">{detalle}</span>
    </label>
  );
}
