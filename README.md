# Recaudo · comida local y de temporada

Sitio web (prototipo funcional) para **Recaudo**, restaurante de comida local y de temporada
en San Andrés Cholula, Puebla. Es un recorrido de scroll que lleva del campo al productor,
del productor a la cocina y de la cocina a tu mesa, con una **canasta semanal** de verdura y
un **formulario de pedido que arma el mensaje de WhatsApp** para que en Recaudo no tengan que
recapturar nada.

> Proyecto de Servicio Social del Tec de Monterrey. Los datos son de **ejemplo** salvo donde
> se indique (ver [Qué es real y qué es ejemplo](#qué-es-real-y-qué-es-ejemplo)).

---

## Índice

1. [Cómo correr el proyecto](#cómo-correr-el-proyecto)
2. [Estructura de carpetas](#estructura-de-carpetas)
3. [Actualizar la semana (lo más común)](#actualizar-la-semana)
4. [Agregar o editar un productor y sus fotos](#agregar-o-editar-un-productor)
5. [Agregar o editar productos](#agregar-o-editar-productos)
6. [Configuración general (WhatsApp, cierre, envíos)](#configuración-general)
7. [El cierre automático y cómo simular fechas](#el-cierre-automático)
8. [La pantalla interna de pedidos y el CSV](#la-pantalla-interna-de-pedidos)
9. [Conectar los pedidos a Google Sheets o Formspree](#conectar-los-pedidos)
10. [Cómo desplegarlo](#cómo-desplegarlo)
11. [Qué es real y qué es ejemplo (pendiente de confirmar)](#qué-es-real-y-qué-es-ejemplo)
12. [Notas técnicas](#notas-técnicas)

---

## Cómo correr el proyecto

Necesitas **Node.js 20 o superior**.

```bash
npm install       # instala dependencias (una sola vez)
npm run dev       # servidor de desarrollo → http://localhost:5173
```

Otros comandos:

```bash
npm run build     # genera el sitio para producción en la carpeta dist/
npm run preview   # sirve el sitio ya compilado para revisarlo
npm run typecheck # revisa que no haya errores de TypeScript
```

---

## Estructura de carpetas

```
src/
├─ data/            ← LO ÚNICO QUE EDITA QUIEN NO PROGRAMA (archivos .json)
│  ├─ config.json       WhatsApp, cierre, zonas y costos de envío, redes
│  ├─ productores.json  quién cultiva: nombre, municipio, historia, mapa, foto
│  ├─ productos.json    qué se vende: unidad, productor, meses de temporada
│  ├─ semana.json       la semana en curso: fechas, disponibilidad, canastas
│  └─ cocina.json       menús del restaurante
├─ types/            definición de la forma de los datos (no se toca)
├─ lib/              lógica: cierre, pedido, totales, CSV, formato
├─ components/       piezas de interfaz reutilizables
├─ illustrations/    ilustraciones SVG propias de verduras
├─ sections/         cada tramo del recorrido (Campo, Cocina, Canasta…)
└─ pages/            Home (scroll largo), ficha de productor, /pedidos
```

**Regla de oro:** el contenido que cambia vive en `src/data/*.json`. No hace falta tocar código
para actualizar la semana, cambiar precios o agregar un productor.

---

## Actualizar la semana

Editar **un solo archivo**: `src/data/semana.json`. Es lo que se hace cada semana.

```jsonc
{
  "etiqueta": "Semana del 13 al 19 de septiembre",  // texto que se ve arriba
  "estacion": "Final del verano",                    // texto de la estación
  "ciclo": {
    "anuncio": "2026-09-13",        // domingo en que se anuncia (formato AAAA-MM-DD)
    "cierre": "2026-09-16",         // miércoles en que cierran los pedidos
    "entregaTienda": "2026-09-17",  // jueves de entrega en el restaurante
    "entregaDomicilio": "2026-09-18"// viernes de entrega a domicilio
  },
  "disponibilidad": [               // qué hay esta semana, con precio y estado
    { "productoId": "acelga", "precio": 25, "estado": "disponible" },
    { "productoId": "chile-poblano", "precio": 45, "estado": "pocas" },
    { "productoId": "espinaca", "precio": null, "estado": "agotado" }
    // estado: "disponible" | "pocas" | "agotado"
    // precio: número en pesos, o null si aún no se define
  ],
  "canastas": [                     // las canastas prearmadas de la semana
    {
      "id": "canasta-3kg",
      "nombre": "Canasta 3 kg",
      "kg": 3,
      "precioMin": 180,             // usa el rango; pon el mismo número en min y max si es fijo
      "precioMax": 230,             // pon null en ambos si el precio está por confirmar
      "descripcion": "Buena para dos o tres personas.",
      "contiene": ["acelga", "lechuga", "jitomate", "rabano", "maiz", "cilantro"],
      "esEjemplo": true
    }
  ],
  "sustituciones": [                // cambios de la semana (se muestran como aviso)
    { "sale": "espinaca", "entra": "acelga", "motivo": "La lluvia atrasó el corte" }
  ]
}
```

> Los `productoId` deben existir en `productos.json`. Si escribes un id que no existe,
> ese producto simplemente no aparece.

---

## Agregar o editar un productor

Editar `src/data/productores.json`. Cada productor es un bloque así:

```jsonc
{
  "id": "hortaliza-calpan",         // identificador interno, sin espacios ni acentos
  "slug": "hortaliza-calpan",       // aparece en la URL: /#/productor/hortaliza-calpan
  "nombre": "Huerta de Calpan",
  "municipio": "Calpan",
  "produce": ["Acelga", "Espinaca"],
  "historia": "Familia que cultiva hoja verde en las faldas del volcán…",
  "temporada": "Casi todo el año",
  "mapa": { "x": 34, "y": 44 },     // posición en el mapa: % de 0 a 100 (x = izq→der, y = arriba→abajo)
  "foto": null,                     // null = muestra un recuadro "Foto pendiente"
  "esEjemplo": true                 // true = se marca como dato de ejemplo (badge ocre)
}
```

**Poner la foto real de un productor:**

1. Copia la imagen a la carpeta `public/`, por ejemplo `public/fotos/calpan.jpg`.
2. En el productor, cambia `"foto": null` por `"foto": "./fotos/calpan.jpg"`.
3. Listo. El recuadro "Foto pendiente" se reemplaza sin mover nada del diseño.
   (Recomendado: imágenes de ~1200 px de ancho, en formato `.jpg` o `.webp`, ligeras.)

**Cada productor tiene su propia dirección** (`/#/productor/su-slug`). A futuro, un código QR en
la canasta física puede llevar directo a esa ficha.

---

## Agregar o editar productos

Editar `src/data/productos.json`:

```jsonc
{
  "id": "acelga",                   // id único (se usa en semana.json y en las canastas)
  "nombre": "Acelga",
  "unidad": "manojo",               // "manojo", "kg", "pieza", "bolsa 500 g"…
  "productorId": "hortaliza-calpan",// debe existir en productores.json
  "mesesTemporada": [1, 2, 3, 9, 10, 11, 12], // 1=enero … 12=diciembre
  "icono": "acelga",                // ilustración a usar (ver lista abajo)
  "esEjemplo": true
}
```

Ilustraciones de verdura disponibles (`icono`):
`jitomate`, `zanahoria`, `acelga`, `betabel`, `quinoa`, `calabaza`, `rabano`, `cebolla`,
`lechuga`, `maiz`, `hierbas`, `chile` y `generico` (hoja neutra, para lo que no tenga dibujo).

---

## Configuración general

Editar `src/data/config.json`:

```jsonc
{
  "whatsapp": "522226031898",       // formato internacional: 52 + los 10 dígitos, sin signos
  "telefonoDisplay": "222 603 18 98",
  "email": "contacto@recaudo.com.mx",
  "direccion": "12 Poniente 105, San Andrés Cholula, Puebla",
  "mapsUrl": "https://…",           // enlace a Google Maps para el botón "Ver en el mapa"
  "redes": { "facebook": "https://…", "instagram": "https://…" },
  "cierre": {
    "aperturaDia": 0,               // 0=domingo … 6=sábado. Día en que ABREN los pedidos
    "cierreDia": 3,                 // día en que CIERRAN (3 = miércoles)
    "cierreHora": "23:59",          // hora de cierre en 24h
    "tz": "America/Mexico_City"     // zona horaria (no cambiar salvo mudanza)
  },
  "entrega": { "tiendaDia": "jueves", "domicilioDia": "viernes" },
  "envios": [                       // zonas y costos; el total del pedido los suma
    { "zona": "Cholula", "costoMin": 30, "costoMax": 30, "porConfirmar": false },
    { "zona": "Zavaleta (dentro de zona)", "costoMin": null, "costoMax": null, "porConfirmar": true, "nota": "Costo por confirmar" }
  ]
}
```

---

## El cierre automático

El formulario de pedido **solo acepta pedidos del domingo al miércoles a las 23:59**, hora de
Ciudad de México. Esto **no depende del reloj ni la zona horaria del dispositivo**: se calcula
siempre contra `America/Mexico_City`. Fuera de ese periodo, el formulario se desactiva y muestra
cuándo abre el siguiente ciclo, con opción de escribir por WhatsApp.

Los días y la hora salen de `config.json` (`cierre`). Para cambiar el horario, edita ahí.

**Simular una fecha (para demos y pruebas):** agrega `?sim=` con una fecha al final de la URL,
dentro del hash. Ejemplos:

```
http://localhost:5173/#/?sim=2026-09-15T18:00:00Z   → martes  → formulario ABIERTO
http://localhost:5173/#/?sim=2026-09-16T05:59:00Z   → miércoles 23:59 → ABIERTO (último minuto)
http://localhost:5173/#/?sim=2026-09-17T14:00:00Z   → jueves  → formulario CERRADO
```

Sin `?sim`, usa la fecha real. (Comprobado: domingo/martes/miércoles 23:59 → abierto;
jueves/viernes/sábado → cerrado.)

---

## La pantalla interna de pedidos

Ruta **`/#/pedidos`** (o el botón desde la barra). Es lo que demuestra la reducción del trabajo
manual: reúne los pedidos capturados, calcula el **total por producto** (lo que hay que pedirle a
cada productor) y exporta a **CSV**.

- **Exportar pedidos (CSV):** un renglón por pedido (cliente, entrega, pago, total, notas…).
- **Exportar lista de compra (CSV):** cantidades sumadas por producto, agrupadas por productor.
- **Cargar pedidos de ejemplo / Vaciar:** para la demo.

En el prototipo, los pedidos se guardan en el navegador (`localStorage`). Para que se guarden en
un solo lugar compartido, hay que conectarlos a un backend (siguiente sección).

---

## Conectar los pedidos

Todo el envío pasa por **una sola función**: `enviarPedido()` en `src/lib/pedido.ts`. Hoy guarda
en `localStorage`. Para producción, ahí mismo (hay un bloque comentado) se conecta a un servicio.

**Opción A — Google Sheets (gratis):**
1. En una hoja de Google, menú *Extensiones → Apps Script*.
2. Pega una función `doPost(e)` que escriba `JSON.parse(e.postData.contents)` en la hoja.
3. *Implementar → Nueva implementación → App web*, acceso "Cualquiera". Copia la URL.
4. En `enviarPedido()`, descomenta el `fetch(...)` y pega esa URL.

**Opción B — sin código:** [Formspree](https://formspree.io), [Getform](https://getform.io) o
[Sheet.best](https://sheet.best). Todas reciben un `fetch` POST con el pedido en JSON, igual que arriba.

Lo mismo aplica a **opiniones** y **registros de membresía** (`src/lib/registros.ts`).

---

## Cómo desplegarlo

El sitio es **estático** (sin backend). El ruteo usa hash (`/#/…`) y las rutas de assets son
relativas (`base: "./"`), así que funciona en cualquier hosting y bajo cualquier subcarpeta.

### GitHub Pages (así está publicado)

El sitio ya está en vivo en **https://deku368.github.io/recaudo/** (repo: `Deku368/recaudo`).
Se publica compilando y subiendo la versión lista a la rama `gh-pages`. Para actualizarlo
después de cualquier cambio, corre:

```bash
./deploy.sh
```

Eso compila el sitio y lo sube. En 1–2 minutos el cambio aparece en la URL de arriba.
El código fuente vive en la rama `main`; para guardar tus cambios de código también ahí:

```bash
git add -A && git commit -m "describe tu cambio" && git push
```

### Vercel o Netlify

Importa el repo. Configuración: **build command** `npm run build`, **output** `dist`.
(No requiere nada más gracias a la configuración relativa.)

### Manual

```bash
npm run build      # genera dist/
# sube el contenido de dist/ a tu hosting
```

---

## Qué es real y qué es ejemplo

**Confirmado (real):**
- El **productor de quinoa de Tepeyahualco** existe (único productor confirmado). Su nombre exacto,
  su historia y sus fotos están **pendientes** de que Recaudo los comparta.
- Datos de contacto, dirección y redes de Recaudo (en `config.json`).

**Datos de ejemplo — pendientes de confirmar/cambiar con Recaudo:**
- Los **otros 6 productores** (Calpan, Atlixco, Texmelucan, Tochimilco, Cholula-hierbas, Zacatlán):
  nombres, historias, municipios y qué producen. Marcados con el badge "Dato de ejemplo".
- **Precios** por producto y de las canastas (3 kg $180–230 y 5 kg $230–280 son del brief; el resto es ejemplo).
- **Canasta básica:** precio por confirmar.
- **Zavaleta y "fuera de zona":** costo de envío por confirmar.
- **Menús de la cocina** (platillos y precios): carta de ejemplo.
- **Todas las fotos:** hoy son recuadros "Foto pendiente" con tamaño fijo, listos para reemplazar.
- No se incluyen cifras de impacto ni contadores de "productores apoyados" (a propósito).

---

## Notas técnicas

- **Stack:** Vite + React + TypeScript + Tailwind CSS v4 + Motion (animaciones) + dnd-kit (armador).
- **Accesibilidad:** navegación por teclado, foco visible, textos alternativos, HTML semántico,
  contraste cuidado sobre los fondos con textura, y respeto a `prefers-reduced-motion` (si el
  sistema pide menos movimiento, las animaciones se desactivan).
- **Móvil primero:** el diseño se pensó para celular (de donde llegará la mayoría). Revisado sin
  scroll horizontal en pantallas de 390 px.
- **El armador** funciona con **botones + / −** y toque (base para todos, incluido teclado);
  arrastrar es un extra.
- **Ilustraciones propias** en SVG (sin fotos de banco ni librerías de íconos pesadas).
