import configJson from "../data/config.json";
import type { Config } from "../types/datos";

export const config = configJson as Config;

/** Enlace a WhatsApp con mensaje opcional ya redactado. */
export function enlaceWhatsApp(mensaje?: string): string {
  const base = `https://wa.me/${config.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
