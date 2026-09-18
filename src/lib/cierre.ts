import { config } from "./config";

export const NOMBRE_DIA = [
  "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
];

/**
 * Fecha "ahora", con opción de simular para demos y pruebas del cierre.
 * Si la URL trae ?sim=YYYY-MM-DDTHH:MM (dentro del hash), usa esa fecha.
 * Ejemplo: .../#/?sim=2026-09-17T00:05  → simula el jueves (cerrado).
 * En uso normal, sin ?sim, devuelve la fecha real.
 */
export function ahoraConSimulacion(): Date {
  try {
    const hash = window.location.hash;
    const q = hash.includes("?") ? hash.split("?").slice(1).join("?") : "";
    const sim = new URLSearchParams(q).get("sim");
    if (sim) {
      const d = new Date(sim);
      if (!Number.isNaN(d.getTime())) return d;
    }
  } catch {
    /* sin simulación */
  }
  return new Date();
}

interface PartesMx {
  dia: number; // 0 = domingo … 6 = sábado
  minutos: number; // minutos desde la medianoche
}

/**
 * Lee el día de la semana y la hora "de pared" en la zona horaria configurada
 * (America/Mexico_City), sin depender del reloj ni la zona del dispositivo.
 * Recibe una fecha (por defecto ahora) para poder simular en pruebas.
 */
export function partesMx(fecha: Date = new Date()): PartesMx {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: config.cierre.tz,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const partes = fmt.formatToParts(fecha);
  const dias: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const nombreDia = partes.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hora = Number(partes.find((p) => p.type === "hour")?.value ?? "0");
  const min = Number(partes.find((p) => p.type === "minute")?.value ?? "0");
  return { dia: dias[nombreDia] ?? 0, minutos: hora * 60 + min };
}

function horaAMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface EstadoCierre {
  abierto: boolean;
  cierreHora: string; // "23:59"
  cierreDiaNombre: string; // "miércoles"
  aperturaDiaNombre: string; // "domingo"
  /** Mensaje corto para mostrar cuando está cerrado. */
  mensajeCerrado: string;
}

/**
 * ¿El formulario acepta pedidos ahora? Abierto desde el día de apertura 00:00
 * hasta el día de cierre a la hora de cierre (inclusive). Fuera de eso, cerrado.
 */
export function estadoCierre(fecha: Date = new Date()): EstadoCierre {
  const { aperturaDia, cierreDia, cierreHora } = config.cierre;
  const { dia, minutos } = partesMx(fecha);
  const cierreMin = horaAMinutos(cierreHora);

  let abierto = false;
  if (dia >= aperturaDia && dia <= cierreDia) {
    abierto = dia < cierreDia ? true : minutos <= cierreMin;
  }

  const aperturaDiaNombre = NOMBRE_DIA[aperturaDia];
  const cierreDiaNombre = NOMBRE_DIA[cierreDia];

  return {
    abierto,
    cierreHora,
    cierreDiaNombre,
    aperturaDiaNombre,
    mensajeCerrado: `Los pedidos de esta semana ya cerraron. Abrimos de nuevo el ${aperturaDiaNombre} y cierran el ${cierreDiaNombre} a las ${cierreHora}.`,
  };
}
