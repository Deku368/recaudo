import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Al cambiar de ruta (por ejemplo entrar a la ficha de un productor),
// lleva el scroll al inicio. Si la URL trae un ancla (#seccion), la respeta.
export default function ScrollARaiz() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}
