import semanaJson from "../data/semana.json";
import type { Semana } from "../types/datos";

export const semana = semanaJson as Semana;

/** Formatea una fecha ISO (YYYY-MM-DD) en español, p.ej. "jueves 17 de septiembre". */
export function fechaLarga(iso: string): string {
  // Se fija el mediodía UTC para evitar corrimientos de día por zona horaria.
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Mexico_City",
  }).format(d);
}

/** Versión corta: "17 sep". */
export function fechaCorta(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    timeZone: "America/Mexico_City",
  }).format(d);
}
