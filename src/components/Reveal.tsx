import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** retraso en segundos para escalonar elementos */
  retraso?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

/**
 * Aparición suave al entrar en pantalla (sube un poco y se desvanece hacia visible).
 * Respeta prefers-reduced-motion: si está activo, aparece sin movimiento.
 */
export default function Reveal({ children, retraso = 0, className, as = "div" }: Props) {
  const reducir = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reducir ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: retraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
