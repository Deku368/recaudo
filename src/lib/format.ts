/** Formatea un número como pesos mexicanos sin decimales: 180 → "$180". */
export function pesos(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/** Rango de precio: (180, 230) → "$180–$230"; (180,180) → "$180". */
export function rangoPesos(min: number, max: number): string {
  return min === max ? pesos(min) : `${pesos(min)}–${pesos(max)}`;
}
