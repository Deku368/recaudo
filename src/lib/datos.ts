import productoresJson from "../data/productores.json";
import productosJson from "../data/productos.json";
import type { Productor, Producto, DisponibilidadSemana } from "../types/datos";
import { semana } from "./semana";

export const productores = productoresJson as Productor[];
export const productos = productosJson as Producto[];

const porIdProductor = new Map(productores.map((p) => [p.id, p]));
const porIdProducto = new Map(productos.map((p) => [p.id, p]));

export function productorPorSlug(slug: string): Productor | undefined {
  return productores.find((p) => p.slug === slug);
}

export function productorDe(producto: Producto): Productor | undefined {
  return porIdProductor.get(producto.productorId);
}

export function producto(id: string): Producto | undefined {
  return porIdProducto.get(id);
}

export function productosDe(productorId: string): Producto[] {
  return productos.filter((p) => p.productorId === productorId);
}

/** Productos que están en temporada en un mes dado (1–12). */
export function productosEnMes(mes: number): Producto[] {
  return productos.filter((p) => p.mesesTemporada.includes(mes));
}

/** Disponibilidad de esta semana, indexada por id de producto. */
const dispPorId = new Map<string, DisponibilidadSemana>(
  semana.disponibilidad.map((d) => [d.productoId, d]),
);

export function disponibilidadDe(productoId: string): DisponibilidadSemana | undefined {
  return dispPorId.get(productoId);
}

/** Mes actual (1–12) según la hora de Ciudad de México, no la del dispositivo. */
export function mesActualMx(): number {
  const partes = new Intl.DateTimeFormat("es-MX", {
    month: "numeric",
    timeZone: "America/Mexico_City",
  }).formatToParts(new Date());
  const mes = partes.find((p) => p.type === "month")?.value ?? "1";
  return Number(mes);
}

export const NOMBRES_MES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
