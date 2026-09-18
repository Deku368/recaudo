import cocinaJson from "../data/cocina.json";

export interface Platillo {
  nombre: string;
  descripcion: string;
  precio: number;
  productorIds: string[];
}

export interface CategoriaMenu {
  id: string;
  nombre: string;
  horario: string;
  platillos: Platillo[];
}

export interface Cocina {
  esEjemplo: boolean;
  estacionCarta: string;
  notaRotacion: string;
  menuDelDia: { dias: string; descripcion: string; precio: number };
  categorias: CategoriaMenu[];
}

export const cocina = cocinaJson as Cocina;
