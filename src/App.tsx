import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ScrollARaiz from "./components/ScrollARaiz";

// Las rutas auxiliares se cargan bajo demanda para aligerar la carga inicial
// de la página principal (mejor velocidad en celular).
const ProductorPage = lazy(() => import("./pages/ProductorPage"));
const PedidosPage = lazy(() => import("./pages/PedidosPage"));

function Cargando() {
  return (
    <div className="flex min-h-screen items-center justify-center text-tierra">
      <p>Cargando…</p>
    </div>
  );
}

// HashRouter (no BrowserRouter) para que el sitio viva bien en GitHub Pages:
// cada URL de productor funciona al abrirse directo, sin configurar el servidor.
export default function App() {
  return (
    <HashRouter>
      <ScrollARaiz />
      <Suspense fallback={<Cargando />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productor/:slug" element={<ProductorPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
