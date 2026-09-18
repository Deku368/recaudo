import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { semana } from "../lib/semana";
import { producto, productorDe, disponibilidadDe } from "../lib/datos";
import { usePedido } from "../context/PedidoContext";
import { pesos } from "../lib/format";
import Verdura from "../illustrations/Verdura";
import EstadoBadge from "./EstadoBadge";

// Productos disponibles esta semana (con datos de producto y productor unidos).
const DISPONIBLES = semana.disponibilidad
  .map((d) => {
    const prod = producto(d.productoId);
    return prod ? { disp: d, prod, productor: productorDe(prod) } : null;
  })
  .filter((x): x is NonNullable<typeof x> => x !== null);

function Stepper({ id, agotado }: { id: string; agotado: boolean }) {
  const { items, incrementar, decrementar } = usePedido();
  const cantidad = items[id] ?? 0;

  if (agotado) {
    return <span className="text-sm font-medium text-tierra">No disponible</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => decrementar(id)}
        disabled={cantidad === 0}
        aria-label="Quitar uno"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-tierra/25 text-lg text-musgo transition-colors hover:bg-hueso-hondo disabled:opacity-30"
      >
        −
      </button>
      <span className="w-6 text-center font-semibold text-musgo" aria-live="polite">
        {cantidad}
      </span>
      <button
        onClick={() => incrementar(id)}
        aria-label="Agregar uno"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-hoja text-lg text-crema transition-colors hover:bg-musgo"
      >
        +
      </button>
    </div>
  );
}

function TarjetaProducto({
  prod,
  productorMunicipio,
  productorSlug,
  precio,
  estado,
}: {
  prod: { id: string; nombre: string; unidad: string; icono: string };
  productorMunicipio?: string;
  productorSlug?: string;
  precio: number | null;
  estado: "disponible" | "pocas" | "agotado";
}) {
  const agotado = estado === "agotado";
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: prod.id,
    disabled: agotado,
  });

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border border-tierra/15 bg-crema p-3 ${
        isDragging ? "opacity-40" : ""
      } ${agotado ? "opacity-60" : ""}`}
    >
      {/* Manija de arrastre (extra). El teclado usa los botones +/−. */}
      <button
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        aria-label={agotado ? undefined : `Arrastrar ${prod.nombre} a la canasta`}
        disabled={agotado}
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-hueso ${
          agotado ? "cursor-not-allowed" : "cursor-grab touch-none active:cursor-grabbing"
        }`}
      >
        <Verdura nombre={prod.icono} size={38} titulo={prod.nombre} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-musgo">{prod.nombre}</span>
          <span className="shrink-0 text-sm font-semibold text-jitomate">
            {precio != null ? pesos(precio) : "—"}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-tierra">
          <span>por {prod.unidad}</span>
          {productorMunicipio && productorSlug && (
            <>
              <span aria-hidden="true">·</span>
              <Link to={`/productor/${productorSlug}`} className="font-medium text-hoja hover:underline">
                {productorMunicipio}
              </Link>
            </>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <EstadoBadge estado={estado} />
          <Stepper id={prod.id} agotado={agotado} />
        </div>
      </div>
    </li>
  );
}

/** Zona donde caen los productos arrastrados. */
function Canastilla({ activa }: { activa: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canasta" });
  const { itemsArray, decrementar, incrementar, setCantidad } = usePedido();

  const subtotal = itemsArray.reduce((s, it) => {
    const d = disponibilidadDe(it.productoId);
    return s + (d?.precio ?? 0) * it.cantidad;
  }, 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-3xl border-2 border-dashed p-5 transition-colors ${
        isOver || activa ? "border-jitomate bg-jitomate/5" : "border-tierra/30 bg-hueso"
      }`}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true">🧺</span>
        <h4 className="font-serif text-lg text-musgo">Tu canasta</h4>
      </div>

      {itemsArray.length === 0 ? (
        <p className="mt-4 flex-1 text-sm text-tierra">
          Arrastra aquí los productos, o usa los botones <strong>+</strong> de cada uno.
          En el celular y con el teclado funciona igual con los botones.
        </p>
      ) : (
        <ul className="mt-4 flex-1 space-y-2">
          {itemsArray.map((it) => {
            const prod = producto(it.productoId);
            const d = disponibilidadDe(it.productoId);
            if (!prod) return null;
            return (
              <li key={it.productoId} className="flex items-center gap-2 rounded-xl bg-crema p-2 text-sm">
                <Verdura nombre={prod.icono} size={26} titulo={prod.nombre} />
                <span className="min-w-0 flex-1 truncate text-musgo">{prod.nombre}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => decrementar(it.productoId)}
                    aria-label={`Quitar un ${prod.nombre}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-tierra/25 text-musgo hover:bg-hueso-hondo"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold">{it.cantidad}</span>
                  <button
                    onClick={() => incrementar(it.productoId)}
                    aria-label={`Agregar un ${prod.nombre}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-hoja text-crema hover:bg-musgo"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setCantidad(it.productoId, 0)}
                    aria-label={`Quitar ${prod.nombre} de la canasta`}
                    className="ml-1 text-tierra hover:text-jitomate"
                  >
                    ✕
                  </button>
                </div>
                <span className="w-16 shrink-0 text-right font-medium text-jitomate">
                  {d?.precio != null ? pesos(d.precio * it.cantidad) : "—"}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-tierra/15 pt-3">
        <span className="font-medium text-musgo">Subtotal productos</span>
        <span className="text-lg font-semibold text-jitomate">{pesos(subtotal)}</span>
      </div>
      <p className="mt-1 text-xs text-tierra">El envío se calcula en el pedido, según tu zona.</p>
    </div>
  );
}

export default function Armador() {
  const { incrementar } = usePedido();
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const sensores = useSensors(
    // distancia mínima antes de iniciar el arrastre: así los botones +/− y los
    // enlaces siguen funcionando con un toque normal.
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function alSoltar(e: DragEndEvent) {
    setArrastrando(null);
    if (e.over?.id === "canasta") {
      incrementar(String(e.active.id));
    }
  }
  function alIniciar(e: DragStartEvent) {
    setArrastrando(String(e.active.id));
  }

  return (
    <DndContext sensors={sensores} onDragStart={alIniciar} onDragEnd={alSoltar}>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <ul className="grid gap-3 sm:grid-cols-2">
          {DISPONIBLES.map(({ disp, prod, productor }) => (
            <TarjetaProducto
              key={prod.id}
              prod={prod}
              productorMunicipio={productor?.municipio}
              productorSlug={productor?.slug}
              precio={disp.precio}
              estado={disp.estado}
            />
          ))}
        </ul>

        <div className="lg:sticky lg:top-6">
          <Canastilla activa={arrastrando !== null} />
        </div>
      </div>

      <DragOverlay>
        {arrastrando ? (
          <div className="flex items-center gap-2 rounded-full bg-crema px-3 py-2 shadow-lg">
            <Verdura nombre={producto(arrastrando)?.icono ?? "generico"} size={28} />
            <span className="text-sm font-medium text-musgo">{producto(arrastrando)?.nombre}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
