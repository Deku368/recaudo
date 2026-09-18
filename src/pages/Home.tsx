import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PedidoProvider } from "../context/PedidoContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Campo from "../sections/Campo";
import QuienCultiva from "../sections/QuienCultiva";
import Calendario from "../sections/Calendario";
import Cocina from "../sections/Cocina";
import Canasta from "../sections/Canasta";
import Pedido from "../sections/Pedido";
import Compostaje from "../sections/Compostaje";
import Opiniones from "../sections/Opiniones";
import Membresia from "../sections/Membresia";

export default function Home() {
  const location = useLocation();

  // Si llegamos desde otra ruta pidiendo ir a una sección, hacemos scroll al llegar.
  useEffect(() => {
    const destino = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (destino) {
      // Pequeño respiro para que el layout termine de montar.
      const t = setTimeout(() => {
        document.getElementById(destino)?.scrollIntoView({ behavior: "smooth" });
      }, 60);
      return () => clearTimeout(t);
    }
  }, [location]);

  return (
    <PedidoProvider>
      <Header />
      <main>
        <Campo />
        <QuienCultiva />
        <Calendario />
        <Cocina />
        <Canasta />
        <Pedido />
        <Compostaje />
        <Opiniones />
        <Membresia />
      </main>
      <Footer />
    </PedidoProvider>
  );
}
