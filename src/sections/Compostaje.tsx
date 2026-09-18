import Banda from "../components/Banda";
import Reveal from "../components/Reveal";

// Íconos simples propios para cada paso (SVG en la paleta de la marca).
const iconos: Record<string, React.ReactNode> = {
  separar: (
    <>
      <path d="M20 44c0-16 8-26 20-30-2 18-8 26-20 30z" fill="#7e8f5b" />
      <rect x="46" y="30" width="26" height="26" rx="4" fill="#7a4f31" />
      <path d="M50 42h18M50 48h18" stroke="#fbf6ec" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  bote: (
    <>
      <path d="M28 30h44l-4 40a4 4 0 0 1-4 3.6H36a4 4 0 0 1-4-3.6z" fill="#4b5d3a" />
      <rect x="24" y="24" width="52" height="8" rx="4" fill="#33402a" />
      <circle cx="42" cy="48" r="2" fill="#fbf6ec" />
      <circle cx="58" cy="56" r="2" fill="#fbf6ec" />
      <circle cx="50" cy="40" r="2" fill="#fbf6ec" />
    </>
  ),
  capas: (
    <>
      <rect x="26" y="54" width="48" height="10" rx="3" fill="#7a4f31" />
      <rect x="26" y="42" width="48" height="10" rx="3" fill="#7e8f5b" />
      <rect x="26" y="30" width="48" height="10" rx="3" fill="#a97c24" />
    </>
  ),
  agua: (
    <>
      <path d="M50 24c8 10 14 18 14 26a14 14 0 1 1-28 0c0-8 6-16 14-26z" fill="#7e8f5b" />
      <path d="M44 52a6 6 0 0 0 6 6" stroke="#fbf6ec" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  ),
  tierra: (
    <>
      <path d="M24 58h52v6a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4z" fill="#593824" />
      <path d="M50 56V40" stroke="#4b5d3a" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 44c-6-2-10-6-12-12 6 0 11 4 12 12zm0-4c6-2 10-6 12-12-6 0-11 4-12 12z" fill="#4b5d3a" />
    </>
  ),
};

const PASOS = [
  {
    icono: "separar",
    titulo: "Separa lo verde y lo café",
    texto: "Verde: cáscaras, restos de verdura y hojas frescas. Café: cartón, servilletas y hojas secas.",
  },
  {
    icono: "bote",
    titulo: "Un bote con tapa",
    texto: "Hazle unos agujeros para que respire. Cabe en un balcón o bajo el fregadero.",
  },
  {
    icono: "capas",
    titulo: "Alterna capas",
    texto: "Una capa de verde, una de café. Así no huele y se descompone parejo.",
  },
  {
    icono: "agua",
    titulo: "Ni seco ni encharcado",
    texto: "Húmedo como esponja exprimida. Revuelve una vez por semana para darle aire.",
  },
  {
    icono: "tierra",
    titulo: "En 2 o 3 meses, tierra",
    texto: "Queda una tierra oscura que huele a bosque. Úsala en tus macetas o plantas.",
  },
];

export default function Compostaje() {
  return (
    <Banda id="compostaje" fondo="bg-tierra" textura="tela" className="text-crema">
      <Reveal className="max-w-2xl">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ocre">
          <span className="inline-block h-px w-6 bg-ocre" />
          Después de la canasta
        </p>
        <h2 className="text-3xl text-crema sm:text-4xl">Que nada se desperdicie</h2>
        <p className="mt-4 text-lg text-crema/85">
          Las hojas, cáscaras y tallos que sobran pueden volver a la tierra. Aquí va una guía
          sencilla para compostar en casa, aunque tengas poco espacio.
        </p>
      </Reveal>

      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {PASOS.map((paso, i) => (
          <Reveal as="li" key={paso.icono} retraso={i * 0.05} className="rounded-2xl bg-crema p-5 text-tinta">
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-hueso">
                <svg viewBox="0 0 100 100" width="46" height="46" aria-hidden="true">
                  {iconos[paso.icono]}
                </svg>
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tierra text-sm font-semibold text-crema">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-4 font-serif text-lg text-musgo">{paso.titulo}</h3>
            <p className="mt-2 text-sm text-tinta-suave">{paso.texto}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-6 rounded-2xl bg-barro/40 p-5 text-sm text-crema/90 ring-1 ring-crema/10">
        <p>
          <span className="font-semibold">Ojo:</span> no eches carne, lácteos, aceite ni excremento
          de mascotas. Eso sí atrae plagas y malos olores.
        </p>
      </Reveal>
    </Banda>
  );
}
