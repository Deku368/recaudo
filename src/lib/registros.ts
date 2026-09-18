// Guardado de opiniones e interés de membresía en localStorage (prototipo).
// En producción se conectan al mismo backend que los pedidos (ver README).

export interface Opinion {
  calificacion: number; // 1–5
  comentario: string;
  folio: string;
  fecha: string; // ISO
}

export interface InteresMembresia {
  nombre: string;
  contacto: string;
  fecha: string; // ISO
}

function guardar<T>(clave: string, valor: T): boolean {
  try {
    const raw = localStorage.getItem(clave);
    const arr = raw ? (JSON.parse(raw) as T[]) : [];
    arr.push(valor);
    localStorage.setItem(clave, JSON.stringify(arr));
    return true;
  } catch {
    return false;
  }
}

export const guardarOpinion = (o: Opinion) => guardar("recaudo_opiniones", o);
export const guardarInteres = (i: InteresMembresia) => guardar("recaudo_interes_membresia", i);
