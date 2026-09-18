import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoRecaudo from "../components/LogoRecaudo";
import { leerPedidos, type DatosPedido } from "../lib/pedido";
import { rangoPesos } from "../lib/format";
import { semana } from "../lib/semana";
import { producto } from "../lib/datos";
import {
  totalesPorProducto,
  csvPedidos,
  csvListaCompra,
  descargarCSV,
  cargarEjemplos,
  borrarPedidos,
} from "../lib/pedidosAdmin";

function resumenPedido(p: DatosPedido): string {
  const partes: string[] = [];
  if (p.canastaId) {
    const c = semana.canastas.find((k) => k.id === p.canastaId);
    if (c) partes.push(c.nombre);
  }
  for (const it of p.items) {
    const prod = producto(it.productoId);
    if (prod) partes.push(`${it.cantidad}× ${prod.nombre}`);
  }
  return partes.join(" · ") || "—";
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<DatosPedido[]>([]);

  const recargar = () => setPedidos(leerPedidos());
  useEffect(recargar, []);

  const totales = totalesPorProducto(pedidos);
  const ingresoMin = pedidos.reduce((s, p) => s + p.totalMin, 0);
  const ingresoMax = pedidos.reduce((s, p) => s + p.totalMax, 0);
  const aDomicilio = pedidos.filter((p) => p.entrega === "domicilio").length;

  return (
    <>
      <header className="border-b border-hueso-hondo bg-hueso/90 backdrop-blur-sm">
        <div className="envoltura flex items-center justify-between py-3">
          <Link to="/" aria-label="Ir al inicio">
            <LogoRecaudo />
          </Link>
          <span className="rounded-full bg-hoja/15 px-3 py-1 text-sm font-medium text-hoja">Panel interno</span>
        </div>
      </header>

      <main className="textura-papel min-h-screen bg-hueso">
        <div className="envoltura py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-jitomate">Pedidos de la semana</p>
          <h1 className="mt-1 text-3xl text-musgo sm:text-4xl">Todo lo que hay que preparar</h1>
          <p className="mt-3 max-w-2xl text-tinta-suave">
            Esta es la pantalla que le ahorra el trabajo a Recaudo: los pedidos capturados, el total
            por producto (lo que hay que pedirle a cada productor) y la exportación a CSV. En el
            prototipo los pedidos se guardan en este navegador.
          </p>

          {/* Acciones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => descargarCSV("pedidos-recaudo.csv", csvPedidos(pedidos))}
              disabled={pedidos.length === 0}
              className="rounded-full bg-jitomate px-5 py-2.5 text-sm font-medium text-crema transition-colors hover:bg-jitomate-hondo disabled:opacity-40"
            >
              ⤓ Exportar pedidos (CSV)
            </button>
            <button
              onClick={() => descargarCSV("lista-de-compra-recaudo.csv", csvListaCompra(pedidos))}
              disabled={pedidos.length === 0}
              className="rounded-full border-2 border-hoja px-5 py-2.5 text-sm font-medium text-hoja transition-colors hover:bg-hoja hover:text-crema disabled:opacity-40"
            >
              ⤓ Exportar lista de compra (CSV)
            </button>
            <button
              onClick={() => {
                cargarEjemplos();
                recargar();
              }}
              className="rounded-full border border-tierra/30 px-5 py-2.5 text-sm font-medium text-tierra transition-colors hover:bg-hueso-hondo"
            >
              Cargar pedidos de ejemplo
            </button>
            <button
              onClick={() => {
                borrarPedidos();
                recargar();
              }}
              disabled={pedidos.length === 0}
              className="rounded-full border border-tierra/30 px-5 py-2.5 text-sm font-medium text-tierra transition-colors hover:bg-hueso-hondo disabled:opacity-40"
            >
              Vaciar
            </button>
          </div>

          {pedidos.length === 0 ? (
            <div className="mt-10 rounded-3xl border-2 border-dashed border-tierra/30 bg-crema/50 p-10 text-center">
              <p className="text-tinta-suave">
                Aún no hay pedidos guardados en este navegador. Haz un pedido desde el inicio o carga
                los de ejemplo para ver cómo funciona.
              </p>
            </div>
          ) : (
            <>
              {/* Resumen */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <Tarjeta etiqueta="Pedidos" valor={String(pedidos.length)} />
                <Tarjeta etiqueta="A domicilio / en tienda" valor={`${aDomicilio} / ${pedidos.length - aDomicilio}`} />
                <Tarjeta etiqueta="Ingreso estimado" valor={rangoPesos(ingresoMin, ingresoMax)} />
              </div>

              {/* Tabla de pedidos */}
              <h2 className="mt-10 text-2xl text-musgo">Pedidos capturados</h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-tierra/15">
                <table className="w-full min-w-[720px] border-collapse bg-crema text-sm">
                  <thead>
                    <tr className="border-b border-tierra/15 text-left text-tierra">
                      <Th>Folio</Th>
                      <Th>Cliente</Th>
                      <Th>Pedido</Th>
                      <Th>Entrega</Th>
                      <Th>Pago</Th>
                      <Th>Total</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr key={p.folio} className="border-b border-tierra/10 last:border-0">
                        <Td className="font-mono text-xs">{p.folio}</Td>
                        <Td>
                          <span className="font-medium text-musgo">{p.nombre}</span>
                          <br />
                          <span className="text-xs text-tierra">{p.telefono}</span>
                        </Td>
                        <Td className="max-w-[220px] text-tinta-suave">{resumenPedido(p)}</Td>
                        <Td>
                          {p.entrega === "domicilio" ? (
                            <span>
                              Domicilio
                              <br />
                              <span className="text-xs text-tierra">{p.zona}</span>
                            </span>
                          ) : (
                            "Tienda"
                          )}
                        </Td>
                        <Td>{p.pago === "transferencia" ? "Transferencia" : "Al recibir"}</Td>
                        <Td className="font-medium text-jitomate">{rangoPesos(p.totalMin, p.totalMax)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales por producto */}
              <h2 className="mt-10 text-2xl text-musgo">Lista de compra por productor</h2>
              <p className="mt-1 text-sm text-tinta-suave">Esto es lo que hay que pedirle a cada quien esta semana.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-tierra/15">
                <table className="w-full min-w-[560px] border-collapse bg-crema text-sm">
                  <thead>
                    <tr className="border-b border-tierra/15 text-left text-tierra">
                      <Th>Productor / municipio</Th>
                      <Th>Producto</Th>
                      <Th>Unidad</Th>
                      <Th>Cantidad</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {totales.map((t) => (
                      <tr key={t.productoId} className="border-b border-tierra/10 last:border-0">
                        <Td>
                          <span className="font-medium text-musgo">{t.municipio}</span>
                          <br />
                          <span className="text-xs text-tierra">{t.productor}</span>
                        </Td>
                        <Td>{t.nombre}</Td>
                        <Td className="text-tierra">{t.unidad}</Td>
                        <Td className="text-lg font-semibold text-hoja">{t.cantidad}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function Tarjeta({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-tierra/15 bg-crema p-5">
      <p className="text-sm text-tierra">{etiqueta}</p>
      <p className="mt-1 text-2xl font-semibold text-musgo">{valor}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
