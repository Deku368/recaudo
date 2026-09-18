import { productores } from "../lib/datos";

interface Props {
  seleccionado: string | null;
  onSelect: (id: string) => void;
}

/**
 * Mapa ilustrado de Puebla, dibujado a mano con SVG (no es Google Maps ni
 * mosaicos genéricos). Cada productor es un marcador que se puede tocar o
 * enfocar con el teclado. La forma del estado es estilizada, no cartográfica.
 */
export default function MapaPuebla({ seleccionado, onSelect }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <svg viewBox="0 0 100 100" className="w-full" role="img" aria-label="Mapa ilustrado de Puebla con sus productores">
        <defs>
          <filter id="sombraMapa" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#593824" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Cuerpo del estado */}
        <path
          filter="url(#sombraMapa)"
          d="M42 6 C52 4 60 10 58 20 C70 22 82 30 80 42 C88 50 86 64 76 68 C74 80 62 92 50 90 C40 96 28 88 30 76 C18 72 12 60 20 52 C14 44 16 30 28 28 C30 16 34 8 42 6 Z"
          fill="#dcd2b4"
          stroke="#a97c24"
          strokeWidth="0.8"
          strokeDasharray="2 1.5"
        />

        {/* Volcanes (Popo e Izta) como guiño de paisaje, en zona interior despejada */}
        <g opacity="0.45">
          <path d="M52 56 l4 -8 4 8 z" fill="#7e8f5b" />
          <path d="M58 57 l4.5 -10 4.5 10 z" fill="#7e8f5b" />
          <path d="M54.6 49.6 l1.4 1.3 h-2.8 z" fill="#fbf6ec" />
          <path d="M61.2 48.4 l1.6 1.5 h-3.2 z" fill="#fbf6ec" />
        </g>

        {/* Líneas suaves que sugieren caminos */}
        <path d="M46 60 C56 54 64 48 72 43" fill="none" stroke="#a97c24" strokeWidth="0.5" strokeDasharray="1 1.5" opacity="0.5" />
        <path d="M46 60 C42 46 43 30 44 20" fill="none" stroke="#a97c24" strokeWidth="0.5" strokeDasharray="1 1.5" opacity="0.5" />

        {/* Marcador especial: el restaurante */}
        <g transform="translate(48 62)">
          <path d="M0 -3.4 C2.4 -3.4 3.4 -1.6 3.4 0.2 C3.4 2.4 0 5 0 5 C0 5 -3.4 2.4 -3.4 0.2 C-3.4 -1.6 -2.4 -3.4 0 -3.4 Z" fill="#c3392a" stroke="#fbf6ec" strokeWidth="0.7" />
          <circle cy="0.2" r="1.1" fill="#fbf6ec" />
        </g>
        <text x="48" y="58" textAnchor="middle" fontSize="3" fill="#593824" fontFamily="Work Sans, sans-serif" fontWeight="600">
          Recaudo
        </text>

        {/* Marcadores de productores */}
        {productores.map((p) => {
          const activo = seleccionado === p.id;
          return (
            <g
              key={p.id}
              transform={`translate(${p.mapa.x} ${p.mapa.y})`}
              className="cursor-pointer"
              onClick={() => onSelect(p.id)}
              role="button"
              tabIndex={0}
              aria-label={`${p.nombre}, ${p.municipio}`}
              aria-pressed={activo}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(p.id);
                }
              }}
            >
              {activo && <circle r="7.5" fill="#c3392a" opacity="0.18" />}
              <circle
                r={activo ? 4.4 : 3.4}
                fill={activo ? "#c3392a" : "#4b5d3a"}
                stroke="#fbf6ec"
                strokeWidth="1"
                className="transition-all"
              />
              <circle r="1.2" fill="#fbf6ec" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
