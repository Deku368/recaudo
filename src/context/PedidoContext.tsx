import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ItemPedido } from "../lib/pedido";

interface PedidoContextValor {
  canastaId: string | null;
  items: Record<string, number>;
  itemsArray: ItemPedido[];
  totalUnidades: number;
  elegirCanasta: (id: string | null) => void;
  setCantidad: (productoId: string, cantidad: number) => void;
  incrementar: (productoId: string) => void;
  decrementar: (productoId: string) => void;
  limpiar: () => void;
}

const Ctx = createContext<PedidoContextValor | null>(null);

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [canastaId, setCanastaId] = useState<string | null>(null);
  const [items, setItems] = useState<Record<string, number>>({});

  const elegirCanasta = (id: string | null) =>
    setCanastaId((actual) => (actual === id ? null : id));

  const setCantidad = (productoId: string, cantidad: number) => {
    setItems((prev) => {
      const copia = { ...prev };
      if (cantidad <= 0) delete copia[productoId];
      else copia[productoId] = cantidad;
      return copia;
    });
  };

  const incrementar = (productoId: string) => setCantidad(productoId, (items[productoId] ?? 0) + 1);
  const decrementar = (productoId: string) => setCantidad(productoId, (items[productoId] ?? 0) - 1);

  const limpiar = () => {
    setCanastaId(null);
    setItems({});
  };

  const itemsArray = useMemo<ItemPedido[]>(
    () => Object.entries(items).map(([productoId, cantidad]) => ({ productoId, cantidad })),
    [items],
  );

  const totalUnidades = useMemo(
    () => Object.values(items).reduce((a, b) => a + b, 0),
    [items],
  );

  const valor: PedidoContextValor = {
    canastaId,
    items,
    itemsArray,
    totalUnidades,
    elegirCanasta,
    setCantidad,
    incrementar,
    decrementar,
    limpiar,
  };

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function usePedido(): PedidoContextValor {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePedido debe usarse dentro de PedidoProvider");
  return ctx;
}
