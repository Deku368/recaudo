import Reveal from "./Reveal";

interface Props {
  kicker: string;
  titulo: string;
  intro?: string;
  centrado?: boolean;
}

/** Encabezado consistente para cada sección: kicker + título serif + intro. */
export default function EncabezadoSeccion({ kicker, titulo, intro, centrado = false }: Props) {
  return (
    <Reveal className={centrado ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-jitomate">
        <span className="inline-block h-px w-6 bg-jitomate" />
        {kicker}
      </p>
      <h2 className="text-3xl text-musgo sm:text-4xl">{titulo}</h2>
      {intro && <p className="mt-4 text-lg text-tinta-suave">{intro}</p>}
    </Reveal>
  );
}
