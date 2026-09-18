interface Props {
  className?: string;
}

/** Marca de Recaudo: nombre en serif con un jitomate como acento. */
export default function LogoRecaudo({ className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" width="30" height="30" aria-hidden="true" className="shrink-0">
        <path d="M50 34c15 0 26 12 26 29S65 90 50 90 24 80 24 63s11-29 26-29z" fill="#c3392a" />
        <path d="M50 36c-3-7-10-10-16-10 2 7 8 11 16 12zm0 0c3-7 10-10 16-10-2 7-8 11-16 12z" fill="#4b5d3a" />
        <path d="M50 22v14" stroke="#4b5d3a" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-2xl font-semibold tracking-tight text-musgo">Recaudo</span>
    </span>
  );
}
