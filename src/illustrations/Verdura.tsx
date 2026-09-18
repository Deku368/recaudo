import type { JSX } from "react";

// Ilustraciones SVG propias de Recaudo. Nada de fotos de banco.
// Cada verdura es un dibujo plano en la paleta terrosa de la marca.
// La clave (key) es la que se usa en productos.json → campo "icono".

const V = {
  hoja: "#4b5d3a",
  hojaClara: "#7e8f5b",
  jitomate: "#c3392a",
  jitomateHondo: "#9f2b1e",
  ocre: "#c99a3e",
  ocreHondo: "#a97c24",
  tierra: "#7a4f31",
  barro: "#593824",
  crema: "#fbf6ec",
  betabel: "#8e3a52",
  rabano: "#cf5a6a",
};

type Dibujo = () => JSX.Element;

const dibujos: Record<string, Dibujo> = {
  jitomate: () => (
    <>
      <path d="M50 30c14 0 24 11 24 27S64 88 50 88 26 73 26 57s10-27 24-27z" fill={V.jitomate} />
      <path d="M50 30c8 0 14 4 18 11-5 3-11 4-18 4s-13-1-18-4c4-7 10-11 18-11z" fill={V.jitomateHondo} opacity=".5" />
      <path d="M50 32c-3-6-9-9-15-9 2 6 7 10 15 11zm0 0c3-6 9-9 15-9-2 6-7 10-15 11z" fill={V.hoja} />
      <path d="M50 20v13" stroke={V.hoja} strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),
  zanahoria: () => (
    <>
      <path d="M45 32c8-2 17 0 22 6L42 86c-4-6-6-14-5-22 1-12 3-28 8-32z" fill={V.ocre} />
      <path d="M50 40l-4 8m10-2l-5 9m9-3l-5 9" stroke={V.ocreHondo} strokeWidth="3" strokeLinecap="round" />
      <path d="M45 32c-4-8-3-16 0-22 3 6 4 12 3 20zm5-1c2-9 7-15 13-18-1 8-5 14-11 19zm-9 2c-6-6-13-8-20-7 5 6 12 9 20 9z" fill={V.hoja} />
    </>
  ),
  acelga: () => (
    <>
      <path d="M50 88c-2-18-4-40-2-56 6 6 8 30 6 56z" fill={V.rabano} />
      <path d="M50 34c10-14 26-18 38-14-6 16-22 26-38 24z" fill={V.hoja} />
      <path d="M48 36C36 24 20 22 10 27c7 15 24 24 40 20z" fill={V.hojaClara} />
    </>
  ),
  betabel: () => (
    <>
      <path d="M50 40c14 0 22 10 22 22 0 15-12 24-22 24s-22-9-22-24c0-12 8-22 22-22z" fill={V.betabel} />
      <path d="M50 40c-2-10-8-16-16-19 1 9 6 16 16 19zm0 0c2-10 8-16 16-19-1 9-6 16-16 19z" fill={V.hoja} />
      <path d="M50 86c6-8 8-20 6-34" stroke={V.crema} strokeWidth="2" opacity=".4" fill="none" />
    </>
  ),
  quinoa: () => (
    <>
      <path d="M50 86V44" stroke={V.tierra} strokeWidth="4" strokeLinecap="round" />
      <g fill={V.ocre}>
        <circle cx="50" cy="24" r="6" />
        <circle cx="40" cy="34" r="5" />
        <circle cx="60" cy="34" r="5" />
        <circle cx="43" cy="46" r="5" />
        <circle cx="57" cy="46" r="5" />
        <circle cx="50" cy="38" r="5" />
      </g>
      <g fill={V.ocreHondo} opacity=".6">
        <circle cx="50" cy="24" r="2.5" />
        <circle cx="40" cy="34" r="2" />
        <circle cx="60" cy="34" r="2" />
      </g>
    </>
  ),
  calabaza: () => (
    <>
      <g fill={V.ocre}>
        <ellipse cx="38" cy="60" rx="14" ry="22" />
        <ellipse cx="62" cy="60" rx="14" ry="22" />
        <ellipse cx="50" cy="60" rx="16" ry="24" />
      </g>
      <path d="M50 36c0-8 6-12 14-12" stroke={V.hoja} strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  rabano: () => (
    <>
      <path d="M50 44c12 0 20 9 20 20s-9 22-20 22-20-9-20-22 8-20 20-20z" fill={V.rabano} />
      <path d="M50 86c0-8 0-24 0-42" stroke={V.crema} strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <path d="M50 44c-2-12-8-18-16-21 1 10 7 18 16 21zm0 0c2-12 8-18 16-21-1 10-7 18-16 21z" fill={V.hoja} />
    </>
  ),
  cebolla: () => (
    <>
      <path d="M50 38c14 0 22 11 22 26 0 14-10 22-22 22s-22-8-22-22c0-15 8-26 22-26z" fill={V.crema} stroke={V.ocreHondo} strokeWidth="2" />
      <path d="M40 42c-4 14-4 30 2 42m16-42c4 14 4 30-2 42" stroke={V.ocreHondo} strokeWidth="1.5" fill="none" opacity=".5" />
      <path d="M45 38l5-14 5 14" stroke={V.hoja} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  lechuga: () => (
    <>
      <path d="M50 84c-16 0-28-12-28-26 0-4 2-6 4-6-2-8 6-16 14-14 2-6 14-6 16 0 8-2 16 6 14 14 2 0 4 2 4 6 0 14-12 26-24 26z" fill={V.hojaClara} />
      <path d="M50 84c-8-14-12-28-10-40m10 40c8-14 12-28 10-40" stroke={V.hoja} strokeWidth="2" fill="none" opacity=".5" />
    </>
  ),
  maiz: () => (
    <>
      <path d="M50 26c10 0 16 12 16 30S60 88 50 88s-16-14-16-32 6-30 16-30z" fill={V.ocre} />
      <g fill={V.ocreHondo} opacity=".5">
        <path d="M44 36c0 14 0 34 0 46m12-46c0 14 0 34 0 46" />
        <circle cx="44" cy="44" r="1.6" /><circle cx="50" cy="44" r="1.6" /><circle cx="56" cy="44" r="1.6" />
        <circle cx="44" cy="56" r="1.6" /><circle cx="50" cy="56" r="1.6" /><circle cx="56" cy="56" r="1.6" />
        <circle cx="44" cy="68" r="1.6" /><circle cx="50" cy="68" r="1.6" /><circle cx="56" cy="68" r="1.6" />
      </g>
      <path d="M40 40c-8-6-10-16-8-24 8 4 12 14 12 22zm20 0c8-6 10-16 8-24-8 4-12 14-12 22z" fill={V.hoja} />
    </>
  ),
  hierbas: () => (
    <>
      <path d="M50 88V40" stroke={V.tierra} strokeWidth="3" strokeLinecap="round" />
      <path d="M50 44c-8-2-14-8-16-16 8 0 14 6 16 16zm0-8c8-2 14-8 16-16-8 0-14 6-16 16zm0 20c-8-2-14-8-16-16 8 0 14 6 16 16zm0 0c8-2 14-8 16-16-8 0-14 6-16 16z" fill={V.hoja} />
    </>
  ),
  chile: () => (
    <>
      <path d="M40 30c2 8 0 16-4 24-6 12-4 26 8 30 14 4 22-8 20-20-2-10-8-14-8-24 0-6-2-10-8-12-6-2-10 0-8 2z" fill={V.hoja} />
      <path d="M40 30c8-4 14-6 20-4-4 4-10 6-16 6z" fill={V.hojaClara} />
    </>
  ),
  // Fallback: una hoja genérica
  generico: () => (
    <path d="M50 86c0-30 10-52 30-62-2 30-12 52-30 62zM50 86c0-30-10-52-30-62 2 30 12 52 30 62z" fill={V.hoja} />
  ),
};

export const clavesVerdura = Object.keys(dibujos);

interface Props {
  nombre: string;
  size?: number;
  className?: string;
  titulo?: string;
}

/** Renderiza la ilustración SVG de una verdura por su clave. */
export default function Verdura({ nombre, size = 64, className = "", titulo }: Props) {
  const dibujo = dibujos[nombre] ?? dibujos.generico;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={titulo ? "img" : "presentation"}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      {titulo && <title>{titulo}</title>}
      {dibujo()}
    </svg>
  );
}
