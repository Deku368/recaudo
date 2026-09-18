interface Props {
  /** color del borde ondulado (clase de color de Tailwind, p.ej. "text-hueso") */
  color?: string;
  /** invierte la onda para el borde inferior */
  invertido?: boolean;
  className?: string;
}

/**
 * Borde orgánico ondulado entre secciones, en lugar de un corte recto.
 * Se coloca dentro de una sección para fundirla con la de al lado.
 */
export default function Divisor({ color = "text-hueso", invertido = false, className = "" }: Props) {
  return (
    <div className={`pointer-events-none w-full overflow-hidden leading-[0] ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
        className={`h-[60px] w-full md:h-[90px] ${color} ${invertido ? "rotate-180" : ""}`}
      >
        <path
          fill="currentColor"
          d="M0,40 C180,90 340,0 540,30 C720,58 860,95 1040,60 C1120,44 1170,52 1200,48 L1200,90 L0,90 Z"
        />
      </svg>
    </div>
  );
}
