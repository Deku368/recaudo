import { config } from "./config";
import { semana } from "./semana";
import { producto, disponibilidadDe } from "./datos";
import { pesos, rangoPesos } from "./format";

export type Entrega = "tienda" | "domicilio";
export type Pago = "transferencia" | "recoger";
export type SiSeAgota = "sustituir" | "avisar" | "omitir";

export interface ItemPedido {
  productoId: string;
  cantidad: number;
}

export interface DatosPedido {
  folio: string;
  fecha: string; // ISO
  nombre: string;
  telefono: string;
  canastaId: string | null;
  items: ItemPedido[];
  entrega: Entrega;
  zona: string | null;
  direccion: string;
  pago: Pago;
  notas: string;
  siSeAgota: SiSeAgota;
  totalMin: number;
  totalMax: number;
  totalPorConfirmar: boolean;
}

const CLAVE_STORAGE = "recaudo_pedidos";

/** Genera un folio legible tipo REC-260917-A3F. */
export function generarFolio(fecha = new Date()): string {
  const y = String(fecha.getFullYear()).slice(2);
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suf = "";
  for (let i = 0; i < 3; i++) suf += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return `REC-${y}${m}${d}-${suf}`;
}

/** Costo de envío de una zona (por nombre). Recolección en tienda = sin costo. */
export function costoEnvio(entrega: Entrega, zona: string | null) {
  if (entrega === "tienda") return { min: 0, max: 0, porConfirmar: false };
  const z = config.envios.find((e) => e.zona === zona);
  if (!z) return { min: 0, max: 0, porConfirmar: true };
  return { min: z.costoMin ?? 0, max: z.costoMax ?? 0, porConfirmar: z.porConfirmar };
}

export interface Totales {
  min: number;
  max: number;
  porConfirmar: boolean;
}

/** Suma canasta prearmada + productos del armador + envío. */
export function calcularTotales(
  canastaId: string | null,
  items: ItemPedido[],
  entrega: Entrega,
  zona: string | null,
): Totales {
  let min = 0;
  let max = 0;
  let porConfirmar = false;

  // Canasta prearmada
  if (canastaId) {
    const c = semana.canastas.find((k) => k.id === canastaId);
    if (c) {
      if (c.precioMin == null || c.precioMax == null) porConfirmar = true;
      else {
        min += c.precioMin;
        max += c.precioMax;
      }
    }
  }

  // Productos sueltos del armador (precio exacto por unidad)
  for (const it of items) {
    const disp = disponibilidadDe(it.productoId);
    if (disp?.precio == null) porConfirmar = true;
    else {
      min += disp.precio * it.cantidad;
      max += disp.precio * it.cantidad;
    }
  }

  // Envío
  const envio = costoEnvio(entrega, zona);
  if (envio.porConfirmar) porConfirmar = true;
  min += envio.min;
  max += envio.max;

  return { min, max, porConfirmar };
}

/** Texto del total listo para mostrar. */
export function textoTotal(t: Totales): string {
  const base = rangoPesos(t.min, t.max);
  return t.porConfirmar ? `${base} + por confirmar` : base;
}

const NOMBRE_AGOTA: Record<SiSeAgota, string> = {
  sustituir: "Sustituir por algo similar",
  avisar: "Avisarme por WhatsApp",
  omitir: "Omitirlo del pedido",
};

/**
 * Arma el mensaje de WhatsApp con el pedido ya ordenado, para que Recaudo
 * no tenga que recapturar nada: folio, productos, entrega y total.
 */
export function textoWhatsApp(p: DatosPedido): string {
  const L: string[] = [];
  L.push(`*Pedido Recaudo · ${p.folio}*`);
  L.push("");
  L.push(`*Nombre:* ${p.nombre}`);
  L.push(`*Teléfono:* ${p.telefono}`);
  L.push("");
  L.push("*Lo que quiero:*");

  if (p.canastaId) {
    const c = semana.canastas.find((k) => k.id === p.canastaId);
    if (c) {
      const precio = c.precioMin == null || c.precioMax == null ? "precio por confirmar" : rangoPesos(c.precioMin, c.precioMax);
      L.push(`• ${c.nombre} (${precio})`);
    }
  }
  for (const it of p.items) {
    const prod = producto(it.productoId);
    const disp = disponibilidadDe(it.productoId);
    if (!prod) continue;
    const sub = disp?.precio != null ? ` — ${pesos(disp.precio * it.cantidad)}` : "";
    L.push(`• ${it.cantidad} × ${prod.nombre} (${prod.unidad})${sub}`);
  }

  L.push("");
  if (p.entrega === "tienda") {
    L.push(`*Entrega:* recojo en el restaurante el ${config.entrega.tiendaDia} (sin costo)`);
  } else {
    L.push(`*Entrega:* a domicilio el ${config.entrega.domicilioDia}`);
    L.push(`*Zona:* ${p.zona ?? "(por definir)"}`);
    L.push(`*Dirección:* ${p.direccion || "(la comparto por aquí)"}`);
  }
  L.push(`*Pago:* ${p.pago === "transferencia" ? "Transferencia" : "Pago al recoger/recibir"}`);
  L.push(`*Si algo se agota:* ${NOMBRE_AGOTA[p.siSeAgota]}`);
  if (p.notas.trim()) L.push(`*Notas:* ${p.notas.trim()}`);

  L.push("");
  const total = textoTotal({ min: p.totalMin, max: p.totalMax, porConfirmar: p.totalPorConfirmar });
  L.push(`*Total estimado:* ${total}`);

  return L.join("\n");
}

/**
 * Punto único de envío del pedido.
 * En el prototipo guarda en localStorage. Para producción, aquí se conecta
 * a Google Sheets o a un servicio de formularios (ver README, sección "Conectar
 * los pedidos"). Devuelve true si se guardó bien.
 *
 * ── Cómo conectar a Google Sheets (resumen) ──────────────────────────────
 *   1. Crea un Google Apps Script con doPost(e) que escriba en tu hoja.
 *   2. Publícalo como App Web (acceso: cualquiera).
 *   3. Descomenta el bloque fetch de abajo y pon la URL del script.
 * Alternativa sin código: Formspree / Getform / Sheet.best (fetch POST igual).
 */
export function enviarPedido(p: DatosPedido): boolean {
  try {
    const previos = leerPedidos();
    previos.push(p);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(previos));

    // --- PRODUCCIÓN: enviar también a Google Sheets / Formspree ---
    // fetch("https://script.google.com/macros/s/XXXX/exec", {
    //   method: "POST",
    //   body: JSON.stringify(p),
    //   headers: { "Content-Type": "application/json" },
    // });

    return true;
  } catch {
    return false;
  }
}

/** Lee los pedidos guardados en el prototipo (para la ruta /pedidos). */
export function leerPedidos(): DatosPedido[] {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE);
    return raw ? (JSON.parse(raw) as DatosPedido[]) : [];
  } catch {
    return [];
  }
}
