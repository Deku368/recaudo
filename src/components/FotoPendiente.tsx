interface Props {
  /** texto que describe qué foto irá aquí */
  etiqueta?: string;
  /** relación de aspecto CSS, p.ej. "4 / 3" o "1 / 1" */
  ratio?: string;
  className?: string;
  redondeado?: boolean;
}

/**
 * Espacio con tamaño fijo reservado para una foto real que aún no existe.
 * Al llegar la foto se sustituye sin mover el resto del diseño.
 */
export default function FotoPendiente({
  etiqueta = "Foto pendiente",
  ratio = "4 / 3",
  className = "",
  redondeado = true,
}: Props) {
  return (
    <div
      className={`foto-pendiente ${redondeado ? "rounded-2xl" : ""} ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={etiqueta}
    >
      <span className="max-w-[80%] px-3">📷 {etiqueta}</span>
    </div>
  );
}
