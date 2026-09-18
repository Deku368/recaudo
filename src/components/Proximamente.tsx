interface Props {
  children: React.ReactNode;
}

/**
 * Marcador temporal para las partes interactivas que se construyen en etapas
 * posteriores. Se elimina cuando la sección queda terminada.
 */
export default function Proximamente({ children }: Props) {
  return (
    <div className="mt-8 rounded-2xl border-2 border-dashed border-tierra/30 bg-crema/50 p-6 text-sm text-tierra">
      <span className="font-semibold">En construcción · </span>
      {children}
    </div>
  );
}
