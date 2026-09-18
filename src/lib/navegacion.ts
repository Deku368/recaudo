import { useNavigate, useLocation } from "react-router-dom";

export const SECCIONES = [
  { id: "inicio", nombre: "El campo" },
  { id: "productores", nombre: "Quién lo cultiva" },
  { id: "calendario", nombre: "Temporada" },
  { id: "cocina", nombre: "La cocina" },
  { id: "canasta", nombre: "La canasta" },
] as const;

/**
 * Devuelve una función para ir a una sección de la página larga.
 * Como usamos HashRouter, no navegamos con anclas #: hacemos scroll con JS.
 * Si estamos en otra ruta (ficha de productor, /pedidos), primero vamos a "/"
 * y la propia Home hace el scroll al llegar (via location.state.scrollTo).
 */
export function useIrASeccion() {
  const navigate = useNavigate();
  const location = useLocation();

  return (id: string) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };
}
