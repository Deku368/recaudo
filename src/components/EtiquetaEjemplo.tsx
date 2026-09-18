interface Props {
  className?: string;
  texto?: string;
}

/** Marca visible de que un contenido es un dato de ejemplo, no confirmado. */
export default function EtiquetaEjemplo({ className = "", texto = "Dato de ejemplo" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-ocre/20 px-2.5 py-0.5 text-xs font-semibold text-ocre-hondo ${className}`}
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
        <path d="M12 2L2 21h20L12 2zm0 5l6.5 12h-13L12 7zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z" />
      </svg>
      {texto}
    </span>
  );
}
