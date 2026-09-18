import { useState } from "react";
import Banda from "../components/Banda";
import EncabezadoSeccion from "../components/EncabezadoSeccion";
import Reveal from "../components/Reveal";
import { guardarInteres } from "../lib/registros";

export default function Membresia() {
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !contacto.trim()) {
      setError("Déjanos tu nombre y un contacto (teléfono o correo).");
      return;
    }
    const ok = guardarInteres({ nombre: nombre.trim(), contacto: contacto.trim(), fecha: new Date().toISOString() });
    if (ok) setEnviado(true);
    else setError("No pudimos guardar tus datos. Intenta de nuevo.");
  }

  return (
    <Banda id="membresia" fondo="bg-hueso-hondo">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <EncabezadoSeccion
          kicker="Próximamente"
          titulo="¿Y si tu canasta llegara sola cada semana?"
          intro="Estamos pensando en una membresía para recibir tu canasta sin volver a pedirla. Todavía no existe, pero si te interesa, déjanos tus datos y te avisamos primero."
        />

        <Reveal>
          {enviado ? (
            <div className="rounded-3xl border-2 border-hoja/30 bg-crema p-8 text-center">
              <span className="text-4xl">📬</span>
              <h3 className="mt-3 font-serif text-2xl text-musgo">¡Anotado!</h3>
              <p className="mt-2 text-tinta-suave">
                Serás de los primeros en enterarte cuando abramos la membresía.
              </p>
            </div>
          ) : (
            <form onSubmit={alEnviar} className="rounded-3xl border border-tierra/15 bg-crema p-6 md:p-8">
              <p className="mb-4 text-sm font-medium text-tierra">Registro de interés · sin compromiso</p>
              <label htmlFor="mem-nombre" className="block">
                <span className="mb-1.5 block text-sm font-medium text-tinta">Nombre</span>
                <input
                  id="mem-nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-tierra/25 bg-hueso px-4 py-3 text-tinta placeholder:text-tierra/50 focus:border-jitomate focus:outline-none focus:ring-2 focus:ring-jitomate/30"
                />
              </label>
              <label htmlFor="mem-contacto" className="mt-4 block">
                <span className="mb-1.5 block text-sm font-medium text-tinta">Teléfono o correo</span>
                <input
                  id="mem-contacto"
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  placeholder="Para avisarte"
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
                Quiero que me avisen
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Banda>
  );
}
