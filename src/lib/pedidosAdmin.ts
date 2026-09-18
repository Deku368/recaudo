import { semana } from "./semana";
import { producto, productorDe } from "./datos";
import type { DatosPedido } from "./pedido";

/** Expande un pedido a cantidades por producto (canasta prearmada + armador). */
export function expandirPedido(p: DatosPedido): Map<string, number> {
  const m = new Map<string, number>();
  const sumar = (id: string, n: number) => m.set(id, (m.get(id) ?? 0) + n);

  if (p.canastaId) {
    const c = semana.canastas.find((k) => k.id === p.canastaId);
    c?.contiene.forEach((id) => sumar(id, 1));
  }
  p.items.forEach((it) => sumar(it.productoId, it.cantidad));
  return m;
}

export interface TotalProducto {
  productoId: string;
  nombre: string;
  unidad: string;
  cantidad: number;
  productor: string;
  municipio: string;
}

/** Totales por producto en todos los pedidos: lo que hay que pedir a cada productor. */
export function totalesPorProducto(pedidos: DatosPedido[]): TotalProducto[] {
  const acc = new Map<string, number>();
  for (const p of pedidos) {
    for (const [id, n] of expandirPedido(p)) acc.set(id, (acc.get(id) ?? 0) + n);
  }
  const filas: TotalProducto[] = [];
  for (const [id, cantidad] of acc) {
    const prod = producto(id);
    if (!prod) continue;
    const productor = productorDe(prod);
    filas.push({
      productoId: id,
      nombre: prod.nombre,
      unidad: prod.unidad,
      cantidad,
      productor: productor?.nombre ?? "—",
      municipio: productor?.municipio ?? "—",
    });
  }
  // Ordena por municipio y luego por producto, para agrupar por productor.
  return filas.sort((a, b) => a.municipio.localeCompare(b.municipio) || a.nombre.localeCompare(b.nombre));
}

// ── CSV ────────────────────────────────────────────────────────────────────
function celda(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function aCSV(filas: (string | number)[][]): string {
  // BOM para que Excel abra bien los acentos.
  return "﻿" + filas.map((f) => f.map(celda).join(",")).join("\n");
}

function resumenItems(p: DatosPedido): string {
  const partes: string[] = [];
  if (p.canastaId) {
    const c = semana.canastas.find((k) => k.id === p.canastaId);
    if (c) partes.push(c.nombre);
  }
  for (const it of p.items) {
    const prod = producto(it.productoId);
    if (prod) partes.push(`${it.cantidad} ${prod.nombre}`);
  }
  return partes.join(" · ");
}

export function csvPedidos(pedidos: DatosPedido[]): string {
  const cab = ["Folio", "Fecha", "Nombre", "Teléfono", "Entrega", "Zona", "Dirección", "Pago", "Si se agota", "Pedido", "Total min", "Total max", "Notas"];
  const filas = pedidos.map((p) => [
    p.folio,
    p.fecha.slice(0, 10),
    p.nombre,
    p.telefono,
    p.entrega === "tienda" ? "Tienda" : "Domicilio",
    p.zona ?? "",
    p.direccion,
    p.pago === "transferencia" ? "Transferencia" : "Al recibir",
    p.siSeAgota,
    resumenItems(p),
    p.totalMin,
    p.totalMax,
    p.notas,
  ]);
  return aCSV([cab, ...filas]);
}

export function csvListaCompra(pedidos: DatosPedido[]): string {
  const cab = ["Municipio", "Productor", "Producto", "Unidad", "Cantidad total"];
  const filas = totalesPorProducto(pedidos).map((t) => [t.municipio, t.productor, t.nombre, t.unidad, t.cantidad]);
  return aCSV([cab, ...filas]);
}

/** Dispara la descarga de un archivo CSV. */
export function descargarCSV(nombre: string, contenido: string) {
  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Datos de ejemplo para la demo ────────────────────────────────────────────
const EJEMPLOS: DatosPedido[] = [
  {
    folio: "REC-260914-A1B", fecha: "2026-09-14T10:12:00Z", nombre: "María López", telefono: "2221234567",
    canastaId: "canasta-3kg", items: [{ productoId: "jitomate", cantidad: 2 }], entrega: "domicilio",
    zona: "Cholula", direccion: "5 de Mayo 12, Centro", pago: "transferencia", notas: "Sin cilantro por favor",
    siSeAgota: "sustituir", totalMin: 274, totalMax: 324, totalPorConfirmar: false,
  },
  {
    folio: "REC-260914-C7D", fecha: "2026-09-14T18:40:00Z", nombre: "Jorge Méndez", telefono: "2229876543",
    canastaId: "canasta-5kg", items: [], entrega: "tienda", zona: null, direccion: "", pago: "recoger", notas: "",
    siSeAgota: "avisar", totalMin: 230, totalMax: 280, totalPorConfirmar: false,
  },
  {
    folio: "REC-260915-E3F", fecha: "2026-09-15T09:05:00Z", nombre: "Ana Torres", telefono: "2221112233",
    canastaId: null, items: [{ productoId: "acelga", cantidad: 2 }, { productoId: "calabaza", cantidad: 1 }, { productoId: "maiz", cantidad: 4 }],
    entrega: "domicilio", zona: "San Andrés y Angelópolis", direccion: "Av. Las Torres 45", pago: "transferencia",
    notas: "", siSeAgota: "omitir", totalMin: 148, totalMax: 168, totalPorConfirmar: false,
  },
];

export function cargarEjemplos() {
  try {
    localStorage.setItem("recaudo_pedidos", JSON.stringify(EJEMPLOS));
  } catch {
    /* noop */
  }
}

export function borrarPedidos() {
  try {
    localStorage.removeItem("recaudo_pedidos");
  } catch {
    /* noop */
  }
}
