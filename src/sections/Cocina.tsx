import { useState } from "react";
import { Link } from "react-router-dom";
import Banda from "../components/Banda";
import Reveal from "../components/Reveal";
import EtiquetaEjemplo from "../components/EtiquetaEjemplo";
import { cocina } from "../lib/cocina";
import { config } from "../lib/config";
import { productores } from "../lib/datos";
import { pesos } from "../lib/format";

const porId = new Map(productores.map((p) => [p.id, p]));

export default function Cocina() {
  const [cat, setCat] = useState(cocina.categorias[0].id);
  const categoria = cocina.categorias.find((c) => c.id === cat) ?? cocina.categorias[0];

  return (
    <Banda id="cocina" fondo="bg-hoja" textura="tela" className="text-crema">
      <Reveal className="max-w-2xl">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ocre">
          <span className="inline-block h-px w-6 bg-ocre" />
          La cocina
        </p>
        <h2 className="text-3xl text-crema sm:text-4xl">El restaurante que empezó todo</h2>
        <p className="mt-4 text-lg text-crema/85">
          Desayunos, comidas y panadería con los mismos ingredientes que llegan a tu canasta.
          Los platillos que ves aquí nombran a quién cultivó lo que los hace.
        </p>
        <div className="mt-4">
          <EtiquetaEjemplo texto="Carta de ejemplo" />
        </div>
      </Reveal>

      {/* Carta de temporada + menú del día */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Reveal className="rounded-2xl bg-musgo/50 p-5 ring-1 ring-crema/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocre">Carta de temporada</p>
          <p className="mt-1 font-serif text-xl text-crema">{cocina.estacionCarta}</p>
          <p className="mt-2 text-sm text-crema/75">{cocina.notaRotacion}</p>
        </Reveal>
        <Reveal retraso={0.05} className="rounded-2xl bg-musgo/50 p-5 ring-1 ring-crema/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocre">
            Menú del día · {pesos(cocina.menuDelDia.precio)}
          </p>
          <p className="mt-1 font-serif text-xl text-crema">{cocina.menuDelDia.dias}</p>
          <p className="mt-2 text-sm text-crema/75">{cocina.menuDelDia.descripcion}</p>
        </Reveal>
      </div>

      {/* Selector de categoría */}
      <Reveal className="mt-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categorías del menú">
          {cocina.categorias.map((c) => {
            const activo = c.id === cat;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={activo}
                onClick={() => setCat(c.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activo ? "bg-jitomate text-crema" : "bg-crema/10 text-crema/80 hover:bg-crema/20"
                }`}
              >
                {c.nombre}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Platillos */}
      <Reveal key={cat} className="mt-6">
        <p className="mb-4 text-sm text-crema/70">{categoria.horario}</p>
        <ul className="grid gap-4 md:grid-cols-3">
          {categoria.platillos.map((pl) => (
            <li key={pl.nombre} className="flex flex-col rounded-2xl bg-crema p-5 text-tinta">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-lg text-musgo">{pl.nombre}</h3>
                <span className="shrink-0 font-medium text-jitomate">{pesos(pl.precio)}</span>
              </div>
              <p className="mt-2 flex-1 text-sm text-tinta-suave">{pl.descripcion}</p>
              {pl.productorIds.length > 0 && (
                <p className="mt-3 border-t border-tierra/15 pt-3 text-xs text-tierra">
                  Ingredientes de:{" "}
                  {pl.productorIds.map((id, i) => {
                    const prod = porId.get(id);
                    if (!prod) return null;
                    return (
                      <span key={id}>
                        {i > 0 && ", "}
                        <Link to={`/productor/${prod.slug}`} className="font-medium text-jitomate hover:underline">
                          {prod.municipio}
                        </Link>
                      </span>
                    );
                  })}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Dirección y redes */}
      <Reveal className="mt-10 flex flex-col gap-4 rounded-2xl bg-musgo/50 p-6 ring-1 ring-crema/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-xl text-crema">Ven a comer</p>
          <address className="mt-1 not-italic text-sm text-crema/80">{config.direccion}</address>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={config.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-crema px-5 py-2.5 text-sm font-medium text-musgo hover:bg-hueso"
          >
            Ver en el mapa
          </a>
          <a
            href={config.redes.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-crema/40 px-5 py-2.5 text-sm font-medium text-crema hover:bg-crema/10"
          >
            Instagram
          </a>
          <a
            href={config.redes.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-crema/40 px-5 py-2.5 text-sm font-medium text-crema hover:bg-crema/10"
          >
            Facebook
          </a>
        </div>
      </Reveal>
    </Banda>
  );
}
