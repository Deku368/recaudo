import type { ReactNode } from "react";

interface Props {
  id?: string;
  children: ReactNode;
  fondo?: string; // clase de color de fondo
  textura?: "papel" | "tela" | "ninguna";
  className?: string;
}

/** Banda de sección a todo lo ancho, con contenido centrado y textura opcional. */
export default function Banda({ id, children, fondo = "bg-hueso", textura = "papel", className = "" }: Props) {
  const claseTextura = textura === "papel" ? "textura-papel" : textura === "tela" ? "textura-tela" : "";
  return (
    <section id={id} className={`${fondo} ${claseTextura} scroll-mt-20 ${className}`}>
      <div className="envoltura py-16 md:py-24">{children}</div>
    </section>
  );
}
