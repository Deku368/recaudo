import { config } from "../lib/config";
import BotonWhatsApp from "./BotonWhatsApp";
import LogoRecaudo from "./LogoRecaudo";

export default function Footer() {
  return (
    <footer className="textura-tela bg-musgo text-hueso">
      <div className="envoltura grid gap-10 py-14 md:grid-cols-3">
        <div>
          <LogoRecaudo className="[&_span]:text-hueso" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-hueso/80">
            Comida local y de temporada. Los mismos productores surten la cocina y tu canasta.
          </p>
        </div>

        <div className="text-sm">
          <h3 className="mb-3 font-serif text-lg text-hueso">Dónde estamos</h3>
          <address className="space-y-1 not-italic text-hueso/85">
            <p>{config.direccion}</p>
            <p>
              <a href={`tel:+${config.whatsapp}`} className="hover:text-ocre">
                {config.telefonoDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${config.email}`} className="hover:text-ocre">
                {config.email}
              </a>
            </p>
            <p>
              <a href={config.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-ocre">
                Ver en el mapa
              </a>
            </p>
          </address>
        </div>

        <div className="text-sm">
          <h3 className="mb-3 font-serif text-lg text-hueso">Síguenos</h3>
          <ul className="space-y-1 text-hueso/85">
            <li>
              <a href={config.redes.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-ocre">
                Facebook · Recaudo
              </a>
            </li>
            <li>
              <a href={config.redes.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ocre">
                Instagram · @recaudocholula
              </a>
            </li>
          </ul>
          <BotonWhatsApp className="mt-5" />
        </div>
      </div>

      <div className="border-t border-hueso/15 py-5 text-center text-xs text-hueso/60">
        <p>
          Prototipo de propuesta · Servicio Social Tec de Monterrey · Datos de ejemplo salvo donde se indique.
        </p>
      </div>
    </footer>
  );
}
