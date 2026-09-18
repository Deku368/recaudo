import { useState } from "react";
import Banda from "../components/Banda";
import EncabezadoSeccion from "../components/EncabezadoSeccion";
import Reveal from "../components/Reveal";
import { guardarOpinion } from "../lib/registros";

export default function Opiniones() {
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [folio, setFolio] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (calificacion === 0) {
      setError("Elige cuántas estrellas nos das.");
      return;
    }
    const ok = guardarOpinion({
      calificacion,
      comentario: comentario.trim(),
      folio: folio.trim(),
      fecha: new Date().toISOString(),
    });
    if (ok) setEnviado(true);
    else setError("No pudimos guardar tu opinión. Intenta de nuevo.");
  }

  return (
    <Banda id="opiniones">
      <EncabezadoSeccion
        kicker="Cuéntanos cómo te fue"
        titulo="Tu opinión ajusta la próxima canasta"
        intro="¿Llegó todo bien? ¿Algo faltó o sobró? Dinos con una calificación y un comentario corto."
        centrado
      />

      <Reveal className="mx-auto mt-8 max-w-lg">
        {enviado ? (
          <div className="rounded-3xl border-2 border-hoja/30 bg-crema p-8 text-center">
            <span className="text-4xl">🌱</span>
            <h3 className="mt-3 font-serif text-2xl text-musgo">¡Gracias!</h3>
            <p className="mt-2 text-tinta-suave">
              Tu opinión nos ayuda a mejorar la canasta de la semana que viene.
            </p>
          </div>
        ) : (
          <form onSubmit={alEnviar} className="rounded-3xl border border-tierra/15 bg-crema p-6 md:p-8">
            {/* Estrellas */}
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-tinta">Tu calificación</legend>
              <div className="flex gap-1" role="radiogroup" aria-label="Calificación en estrellas">
                {[1, 2, 3, 4, 5].map((n) => {
                  const activa = (hover || calificacion) >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={calificacion === n}
                      aria-label={`${n} de 5 estrellas`}
                      onClick={() => {
                        setCalificacion(n);
                        setError(null);
                      }}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      className="text-4xl transition-transform hover:scale-110"
                    >
                      <span className={activa ? "text-ocre" : "text-tierra/25"}>★</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label htmlFor="comentario" className="mt-6 block">
              <span className="mb-1.5 block text-sm font-medium text-tinta">Comentario</span>
              <textarea
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                placeholder="¿Qué te gustó? ¿Qué mejorarías?"
                className="w-full rounded-xl border border-tierra/25 bg-hueso px-4 py-3 text-tinta placeholder:text-tierra/50 focus:border-jitomate focus:outline-none focus:ring-2 focus:ring-jitomate/30"
              />
            </label>

            <label htmlFor="folio-op" className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-tinta">
                Folio del pedido <span className="text-tierra">(opcional)</span>
              </span>
              <input
                id="folio-op"
                type="text"
                value={folio}
                onChange={(e) => setFolio(e.target.value)}
                placeholder="REC-260917-ABC"
                className="w-full rounded-xl border border-tierra/25 bg-hueso px-4 py-3 text-tinta placeholder:text-tierra/50 focus:border-jitomate focus:outline-none focus:ring-2 focus:ring-jitomate/30"
              />
            </label>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-jitomate/10 px-3 py-2 text-sm text-jitomate-hondo">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-jitomate px-6 py-3.5 font-medium text-crema transition-colors hover:bg-jitomate-hondo"
            >
              Enviar mi opinión
            </button>
          </form>
        )}
      </Reveal>
    </Banda>
  );
}
