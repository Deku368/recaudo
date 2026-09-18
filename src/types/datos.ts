// ─────────────────────────────────────────────────────────────
// Tipos de los datos editables de Recaudo.
// Los archivos JSON en src/data/ deben cumplir estas formas.
// Quien edita el contenido no toca este archivo; solo los .json.
// ─────────────────────────────────────────────────────────────

export type EstadoProducto = "disponible" | "pocas" | "agotado";

/** Día de la semana: 0 = domingo … 6 = sábado */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ZonaEnvio {
  zona: string;
  costoMin: number | null;
  costoMax: number | null;
  /** true = el costo aún se confirma con Recaudo */
  porConfirmar: boolean;
  nota?: string;
}

export interface Config {
  whatsapp: string; // solo dígitos, formato internacional: 52 + 10 dígitos
  telefonoDisplay: string;
  email: string;
  direccion: string;
  mapsUrl: string;
  redes: { facebook: string; instagram: string };
  cierre: {
    aperturaDia: DiaSemana; // día en que abren pedidos
    cierreDia: DiaSemana; // día en que cierran
    cierreHora: string; // "HH:MM" en 24h
    tz: string; // zona horaria IANA, p.ej. America/Mexico_City
  };
  entrega: {
    tiendaDia: string; // texto: "jueves"
    domicilioDia: string; // texto: "viernes"
  };
  envios: ZonaEnvio[];
}

export interface Productor {
  id: string;
  slug: string; // usado en la URL /productor/:slug
  nombre: string;
  municipio: string;
  produce: string[];
  historia: string;
  temporada: string;
  mapa: { x: number; y: number }; // % dentro del SVG del mapa (0–100)
  foto: string | null; // ruta a la foto; null = espacio "pendiente"
  esEjemplo: boolean; // true si son datos de ejemplo, no confirmados
}

export interface Producto {
  id: string;
  nombre: string;
  unidad: string; // "manojo", "kg", "pieza"…
  productorId: string;
  mesesTemporada: number[]; // 1 = enero … 12 = diciembre
  icono: string; // clave de ilustración SVG
  esEjemplo: boolean;
}

export interface DisponibilidadSemana {
  productoId: string;
  precio: number | null; // null = sin definir; se muestra rango o "por confirmar"
  estado: EstadoProducto;
}

export interface CanastaPrearmada {
  id: string;
  nombre: string;
  kg: number | null;
  precioMin: number | null;
  precioMax: number | null;
  descripcion: string;
  contiene: string[]; // ids de producto
  esEjemplo: boolean;
}

export interface Sustitucion {
  sale: string; // id de producto
  entra: string; // id de producto
  motivo?: string;
}

export interface Semana {
  etiqueta: string; // "Semana del 15 al 21 de septiembre" (ejemplo)
  ciclo: {
    anuncio: string; // ISO date del domingo de anuncio
    cierre: string; // ISO date del miércoles de cierre
    entregaTienda: string; // ISO date del jueves
    entregaDomicilio: string; // ISO date del viernes
  };
  estacion: string; // "Otoño"
  disponibilidad: DisponibilidadSemana[];
  canastas: CanastaPrearmada[];
  sustituciones: Sustitucion[];
}

// Preparado para el futuro (membresía / pedidos recurrentes). No se usa aún.
export interface PedidoRecurrente {
  clienteId: string;
  frecuencia: "semanal" | "quincenal";
  canastaId: string;
  entrega: "tienda" | "domicilio";
  activo: boolean;
}
