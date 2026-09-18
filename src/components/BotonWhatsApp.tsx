import { enlaceWhatsApp } from "../lib/config";

interface Props {
  mensaje?: string;
  children?: React.ReactNode;
  className?: string;
  variante?: "solido" | "contorno";
}

function IconoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.5 9.5 0 01-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.46 9.46 0 01-1.45-5.05c0-5.23 4.26-9.49 9.5-9.49 2.54 0 4.92.99 6.71 2.78a9.42 9.42 0 012.78 6.72c0 5.23-4.26 9.49-9.5 9.49zm5.53-15.03A11.4 11.4 0 0012.05 3C6.14 3 1.33 7.8 1.33 13.71c0 1.89.5 3.73 1.44 5.36L1.24 24l5.05-1.32a11.4 11.4 0 005.76 1.47h.01c5.9 0 10.71-4.8 10.71-10.71 0-2.86-1.11-5.55-3.13-7.57z" />
    </svg>
  );
}

/** Botón de WhatsApp reutilizable con el ícono de la marca. */
export default function BotonWhatsApp({ mensaje, children, className = "", variante = "solido" }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium transition-colors focus-visible:outline-jitomate";
  const estilos =
    variante === "solido"
      ? "bg-jitomate text-crema hover:bg-jitomate-hondo shadow-sm"
      : "border-2 border-hoja text-hoja hover:bg-hoja hover:text-crema";

  return (
    <a
      href={enlaceWhatsApp(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${estilos} ${className}`}
    >
      <IconoWhatsApp />
      {children ?? "Escríbenos por WhatsApp"}
    </a>
  );
}
