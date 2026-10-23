# Marcha de Guambra 🗺️

> Mapa animado del recorrido que los cadetes de la Universidad Militar Bolivariana de Venezuela realizan cada año desde **Fuerte Tiuna** hasta **Villa de Cura**, en memoria de la rebelión campesina de Ezequiel Zamora (1846).

🌐 **[Ver sitio en vivo](https://joseal983.github.io/marcha-guambra/)**

---

## ✨ Características

- **Animación del recorrido** en tiempo real sobre mapa interactivo (Leaflet.js)
- **8 puntos históricos** con reseña, fecha y dato destacado de cada lugar
- **5 capas de mapa** intercambiables: Clásico · Relieve · Satélite · Histórico · Topográfico
- **Controles de reproducción**: Play/Pausa, velocidad (0.5× – 4×), modo Auto
- **Navegación por teclado**: `Space` para play/pausa, `←` `→` para saltar puntos
- **Audio ambiental** de marcha con control de silencio
- **Diseño responsive** adaptado a móvil y escritorio
- **Fallback sin conexión**: si el GeoJSON no carga, traza rectas entre puntos

---

## 🗂️ Estructura del proyecto

```
marcha-guambra/
├── .github/workflows/deploy.yml   # Pipeline GitHub Actions → GitHub Pages
├── scripts/build-config.js        # Inyecta CARTO_KEY en build time
├── assets/                        # Fotos de los 8 puntos
├── audio/                         # Música ambiental (MP3)
├── css/styles.css                 # Estilos completos
├── data/ruta.geojson              # Geometría de la ruta (~348 KB)
├── js/
│   ├── app.js                     # Lógica principal (animación, mapa, UI)
│   ├── config.js                  # Generado en build con la API key
│   └── puntos.js                  # Datos de los 8 puntos históricos
└── index.html                     # Shell HTML
```

---

## 🚀 Despliegue

El sitio se despliega automáticamente en **GitHub Pages** mediante GitHub Actions en cada push a `main`.

La API Key de CARTO se almacena como **GitHub Secret** (`CARTO_KEY`) y se inyecta en `js/config.js` durante el build — nunca queda expuesta en el repositorio.

### Desarrollo local

```bash
# 1. Clona el repositorio
git clone https://github.com/joseal983/marcha-guambra.git
cd marcha-guambra

# 2. Crea tu archivo de entorno local
cp .env.example .env
# Edita .env y añade tu CARTO_KEY

# 3. Genera config.js con la key
node scripts/build-config.js

# 4. Abre index.html en el navegador
#    (puedes usar Live Server en VS Code)
```

---

## 🏛️ Los 8 puntos de la ruta

| # | Lugar | Municipio |
|---|-------|-----------|
| 1 | Academia Militar · Fuerte Tiuna | Caracas, D.C. |
| 2 | Peaje de Tazón | Km 0 · Autopista Regional del Centro |
| 3 | Las Tejerías | Santos Michelena, Aragua |
| 4 | El Consejo | José Rafael Revenga, Aragua |
| 5 | La Victoria | José Félix Ribas, Aragua |
| 6 | San Mateo | Bolívar, Aragua |
| 7 | Cagua | Sucre, Aragua |
| 8 | Villa de Cura · Guambra | Zamora, Aragua |

---

## 🛠️ Tecnologías

- [Leaflet.js 1.9.4](https://leafletjs.com/) — Motor de mapas interactivos
- [CARTO Basemaps](https://carto.com/) — Capa base oscura (Clásico)
- [OpenTopoMap](https://opentopomap.org/) — Capa Relieve
- [Esri](https://www.esri.com/) — Capas Satélite, Histórico y Topográfico
- [OSRM](http://project-osrm.org/) — Ruta calculada
- HTML5 + CSS3 + JavaScript ES2020 (sin frameworks, sin bundler)

---

## 📜 Contexto histórico

**Ezequiel Zamora** (1817–1860) fue un militar y político venezolano, figura central de la Guerra Federal. En **septiembre de 1846**, se alzó en las inmediaciones de Villa de Cura (sitio de Guambra) al frente de un ejército de campesinos bajo las consignas:

> *«Tierras y hombres libres · Elección popular · Horror a la oligarquía»*

La **Marcha de Guambra** que realizan los cadetes de la UMBV cada año recorre los ~115 km de esa misma ruta, de Fuerte Tiuna a Villa de Cura, en su memoria.

---

## 📄 Licencia

Mapa base © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors · Ruta calculada con [OSRM](http://project-osrm.org/)
