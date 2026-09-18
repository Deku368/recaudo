import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import LogoRecaudo from "../components/LogoRecaudo";
import FotoPendiente from "../components/FotoPendiente";
import EtiquetaEjemplo from "../components/EtiquetaEjemplo";
import MesesBarra from "../components/MesesBarra";
import Verdura from "../illustrations/Verdura";
import BotonWhatsApp from "../components/BotonWhatsApp";
import { productorPorSlug, productosDe, mesActualMx } from "../lib/datos";

export default function ProductorPage() {
  const { slug } = useParams();
  const productor = slug ? productorPorSlug(slug) : undefined;

  if (!productor) {
    return (
      <main className="envoltura flex min-h-screen flex-col items-center justify-center py-24 text-center">
        <h1 className="text-3xl text-musgo">No encontramos a ese productor</h1>
        <p className="mt-3 text-tinta-suave">Puede que el enlace esté mal escrito.</p>
        <Link to="/" className="mt-8 rounded-full border-2 border-hoja px-6 py-3 font-medium text-hoja hover:bg-hoja hover:text-crema">
          ← Volver al inicio
        </Link>
      </main>
    );
  }

  const productos = productosDe(productor.id);
  const mesHoy = mesActualMx();

  return (
    <>
      {/* Barra superior */}
      <header className="border-b border-hueso-hondo bg-hueso/90 backdrop-blur-sm">
        <div className="envoltura flex items-center justify-between py-3">
          <Link to="/" aria-label="Ir al inicio">
            <LogoRecaudo />
          </Link>
          <Link to="/#productores" className="text-sm font-medium text-tinta-suave hover:text-jitomate">
            ← Todos los productores
          </Link>
        </div>
      </header>

      <main className="textura-papel bg-hueso">
        <div className="envoltura grid gap-8 py-12 md:grid-cols-2 md:py-16">
          {/* Foto */}
          <FotoPendiente
            etiqueta={`Foto de ${productor.nombre} pendiente`}
            ratio="4 / 3"
            className="w-full md:sticky md:top-6"
          />

          {/* Datos */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-jitomate">{productor.municipio}, Puebla</p>
            <h1 className="mt-1 text-4xl text-musgo">{productor.nombre}</h1>

            <div className="mt-3">
              {productor.esEjemplo ? (
                <EtiquetaEjemplo />
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-hoja/15 px-2.5 py-0.5 text-xs font-semibold text-hoja">
                  ✓ Productor confirmado
                </span>
              )}
            </div>

            <p className="mt-5 text-lg text-tinta-suave">{productor.historia}</p>

            <p className="mt-4 text-sm text-tierra">
              <span className="font-semibold text-musgo">Temporada:</span> {productor.temporada}
            </p>

            {/* Qué produce */}
            <h2 className="mt-8 text-xl text-musgo">Lo que cultiva</h2>
            <ul className="mt-4 space-y-4">
              {productos.map((prod) => (
                <li key={prod.id} className="flex items-center gap-4 rounded-2xl border border-tierra/15 bg-crema p-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-hueso">
                    <Verdura nombre={prod.icono} size={38} titulo={prod.nombre} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-musgo">{prod.nombre}</span>
                      <span className="text-sm text-tierra">por {prod.unidad}</span>
                    </div>
                    <div className="mt-2">
                      <MesesBarra meses={prod.mesesTemporada} resaltar={mesHoy} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-hoja/10 p-5 text-sm text-tinta-suave">
              <p>
                <span className="font-semibold text-musgo">📎 Esta página tiene su propia dirección.</span>{" "}
                A futuro, un código QR en la canasta física puede llevar directo aquí, para que
                conozcas a quien cultivó lo que te llevas.
              </p>
            </div>

            <div className="mt-6">
              <BotonWhatsApp mensaje={`Hola Recaudo, me interesa saber más sobre ${productor.nombre}.`}>
                Preguntar por este productor
              </BotonWhatsApp>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
