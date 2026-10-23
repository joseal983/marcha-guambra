(() => {
  "use strict";

  const PUNTOS = window.PUNTOS;
  const BASE_LEG_MS = 3000;     
  const MS_PER_METER = 0.25;    
  const AUTO_DELAY = 9;         

  const CARTO_KEY = (window.__ENV__ && window.__ENV__.CARTO_KEY) || "";
  
  // 👉 1. ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ AQUÍ ARRIBA
  const $ = (id) => document.getElementById(id);
  
  const fmtKm = (m) => (m / 1000).toLocaleString("es-VE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " km";

  // ---------- Control de Audio Definitivo ----------
  let bgAudio = null;
  let isMuted = false;

  try {
    bgAudio = new Audio("audio/marcha_ambiente.mp3");
    bgAudio.loop = true;
    bgAudio.volume = 0.8;
    bgAudio.load();
  } catch (e) {
    console.log("Error al inicializar el audio:", e);
  }

  // Ahora sí, esto usará la función $() sin problemas
  const soundBtn = $("btn-sound");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      if (bgAudio) {
        bgAudio.muted = isMuted;
        bgAudio.volume = isMuted ? 0 : 0.8;
      }
      soundBtn.classList.toggle("muted", isMuted);
      const iconSpan = soundBtn.querySelector(".icon");
      if (iconSpan) {
        iconSpan.innerText = isMuted ? "🔇" : "🔊";
      }
    });
  }

  // ---------- Mapa ----------
  const map = L.map("map", { zoomControl: false, attributionControl: true }).setView([10.25, -67.2], 10);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  const basemaps = {
    clasico: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" + (CARTO_KEY ? "?key=" + encodeURIComponent(CARTO_KEY) : ""), {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
    }),
    relieve: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17, subdomains: "abc",
      attribution: '&copy; OpenStreetMap &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
    }),
    satelite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: "Imágenes &copy; Esri, Maxar, Earthstar Geographics"
    }),

    historico: L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
              attribution: 'Tiles © Esri — Source: Esri'
    }),
    topografico:  L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
              attribution: 'Tiles © Esri — Source: Esri'
    }),
    }

  let activeBase = basemaps.clasico.addTo(map);

  document.querySelectorAll(".basemaps button").forEach((btn) => {
    btn.addEventListener("click", () => {
      map.removeLayer(activeBase);
      activeBase = basemaps[btn.dataset.base].addTo(map);
      document.querySelectorAll(".basemaps button").forEach((b) => b.classList.toggle("active", b === btn));
      document.body.dataset.base = btn.dataset.base;
    });
  });

  // ---------- Estado ----------
  const state = {
    legs: [],          // [{ coords: LatLng[], cum: number[], length, start }]
    total: 0,
    stop: 0,           // índice del último punto alcanzado
    leg: -1,           // tramo en curso (-1 = detenido en un punto)
    legDist: 0,        // metros recorridos dentro del tramo en curso
    playing: false,
    lastTs: 0,
    autoTimer: null
  };

  

  // ---------- Capas ----------
  const ghost = L.polyline([], { color: "#3b2f1e", weight: 3, opacity: 0.45, dashArray: "2 8", lineCap: "round" }).addTo(map);
  const trailCasing = L.polyline([], { color: "#fff7e6", weight: 9, opacity: 0.9, lineCap: "round", lineJoin: "round" }).addTo(map);
  const trail = L.polyline([], { color: "#b3261e", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" }).addTo(map);

  const marcherIcon = L.divIcon({
    className: "marcher",
    html: '<span class="marcher__pulse"></span><span class="marcher__dot">★</span>',
    iconSize: [34, 34], iconAnchor: [17, 17]
  });
  const marcher = L.marker(PUNTOS[0].coords, { icon: marcherIcon, zIndexOffset: 1000, interactive: false }).addTo(map);

  const stopMarkers = PUNTOS.map((p, i) => {
    const m = L.marker(p.coords, {
      icon: L.divIcon({ className: "stop", html: `<span>${p.id}</span>`, iconSize: [28, 28], iconAnchor: [14, 14] }),
      title: p.nombre
    }).addTo(map);
    m.bindTooltip(`<strong>${p.nombre}</strong><br>${p.lugar}`, { direction: "top", offset: [0, -14], className: "stop-tip" });
    m.on("click", () => jumpTo(i));
    return m;
  });

function buildTopTimeline() {
    const container = $("topStops");
    if (!container) return;
    container.innerHTML = "";

    PUNTOS.forEach((p, i) => {
      const btn = document.createElement("button");
      btn.className = "top-stop-btn";
      btn.title = p.nombre;
      btn.setAttribute("aria-label", `Ir a ${p.nombre}`);
      
      // Ajusta la ruta y extensión según el nombre de tus archivos en la carpeta assets/
      btn.innerHTML = `<img src="assets/punto${p.id}.jpg" alt="${p.nombre}">`;
      
      btn.addEventListener("click", () => jumpTo(i));
      container.appendChild(btn);
    });
  }
  

  // ---------- Geometría ----------
  function buildLegs(geojson) {
    let start = 0;
    state.legs = geojson.features
      .sort((a, b) => a.properties.leg - b.properties.leg)
      .map((f) => {
        const coords = f.geometry.coordinates.map(([lng, lat]) => L.latLng(lat, lng));
        const cum = [0];
        for (let i = 1; i < coords.length; i++) cum.push(cum[i - 1] + coords[i - 1].distanceTo(coords[i]));
        const leg = { coords, cum, length: cum[cum.length - 1], start };
        start += leg.length;
        return leg;
      });
    state.total = start;
    ghost.setLatLngs(state.legs.flatMap((l) => l.coords));
  }

  // Punto interpolado y vértices recorridos a una distancia d del tramo
  function pointAt(leg, d) {
    const { coords, cum } = leg;
    if (d <= 0) return { idx: 0, pt: coords[0] };
    if (d >= leg.length) return { idx: coords.length - 1, pt: coords[coords.length - 1] };
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= d) lo = mid; else hi = mid;
    }
    const t = (d - cum[lo]) / (cum[hi] - cum[lo] || 1);
    const a = coords[lo], b = coords[hi];
    return { idx: lo, pt: L.latLng(a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t) };
  }

  function completedCoords(upToStop) {
    return state.legs.slice(0, upToStop).flatMap((l) => l.coords);
  }

  function setTrail(latlngs) {
    trail.setLatLngs(latlngs);
    trailCasing.setLatLngs(latlngs);
  }

  // ---------- UI ----------
  function buildTimeline() {
    const ol = $("stops");
    ol.innerHTML = "";
    PUNTOS.forEach((p, i) => {
      const at = i === 0 ? 0 : state.legs[i - 1].start + state.legs[i - 1].length;
      const li = document.createElement("li");
      li.style.left = (at / state.total) * 100 + "%";
      li.innerHTML = `<button title="${p.nombre}" aria-label="Ir a ${p.nombre}">${p.id}</button>`;
      li.querySelector("button").addEventListener("click", () => jumpTo(i));
      ol.appendChild(li);
    });
    $("introKm").textContent = "~" + Math.round(state.total / 1000);
  }

  function updateStats(doneMeters) {
    $("kmDone").textContent = fmtKm(doneMeters);
    $("kmLeft").textContent = fmtKm(Math.max(0, state.total - doneMeters));
    $("fill").style.width = (doneMeters / state.total) * 100 + "%";
    const reached = state.stop;
    $("stopCount").textContent = `${reached + 1} / ${PUNTOS.length}`;
    document.querySelectorAll("#stops li").forEach((li, i) => {
      li.classList.toggle("reached", i <= reached);
      li.classList.toggle("current", i === reached && state.leg === -1);
    });
    stopMarkers.forEach((m, i) => {
      const el = m.getElement();
      if (!el) return;
      el.classList.toggle("reached", i <= reached);
      el.classList.toggle("current", i === reached && state.leg === -1);
    });
  }

  function showPanel(i) {
    const p = PUNTOS[i];
    const panel = $("panel");
    panel.classList.remove("show");
    void panel.offsetWidth; // reinicia la animación de entrada
    $("pNum").textContent = String(p.id).padStart(2, "0");
    $("pTag").textContent = p.etiqueta;
    $("pTitle").textContent = p.nombre;
    $("pPlace").textContent = p.lugar;
    $("pDate").textContent = p.fecha;
    $("pBody").innerHTML = p.resena.map((t) => `<p>${t}</p>`).join("");
    $("pDato").textContent = p.dato;
    $("prevBtn").disabled = i === 0;
    $("nextBtn").disabled = i === PUNTOS.length - 1;
    $("continueBtn").textContent = i === PUNTOS.length - 1 ? "Reiniciar la marcha ↺" : i === 0 ? "Iniciar la marcha ▸" : "Continuar la marcha ▸";
    panel.classList.add("show", "open");
    $("panelToggle").textContent = "–";
  }

  function setPlaying(on) {
    state.playing = on;
    $("playBtn").textContent = on ? "❚❚" : "▶";
    $("playBtn").setAttribute("aria-label", on ? "Pausar" : "Reproducir");
    document.body.classList.toggle("is-playing", on);
  }

  function clearAuto() {
    if (state.autoTimer) clearInterval(state.autoTimer);
    state.autoTimer = null;
  }

  function scheduleAuto() {
    clearAuto();
    if (!$("autoplay").checked || state.stop >= PUNTOS.length - 1) return;
    let left = AUTO_DELAY;
    const btn = $("continueBtn");
    btn.textContent = `Continuar en ${left} s ▸`;
    state.autoTimer = setInterval(() => {
      left -= 1;
      if (left <= 0) { clearAuto(); startLeg(); }
      else btn.textContent = `Continuar en ${left} s ▸`;
    }, 1000);
  }

  // ---------- Animación ----------
  function legDuration(leg) {
    return (BASE_LEG_MS + leg.length * MS_PER_METER) / Number($("speed").value);
  }

  function startLeg() {
    clearAuto();
    if (state.stop >= PUNTOS.length - 1) { restart(); return; }
    state.leg = state.stop;
    state.legDist = 0;
    const leg = state.legs[state.leg];
    map.flyToBounds(L.latLngBounds(leg.coords), { padding: padding(), duration: 1.1, maxZoom: 14 });
    $("panel").classList.remove("open");
    setPlaying(true);
    state.lastTs = 0;
    requestAnimationFrame(tick);
  }

  function tick(ts) {
    if (!state.playing || state.leg < 0) return;
    if (!state.lastTs) state.lastTs = ts;
    const dt = Math.min(64, ts - state.lastTs);
    state.lastTs = ts;

    const leg = state.legs[state.leg];
    state.legDist = Math.min(leg.length, state.legDist + (leg.length / legDuration(leg)) * dt);
    const { idx, pt } = pointAt(leg, state.legDist);

    marcher.setLatLng(pt);
    setTrail(completedCoords(state.leg).concat(leg.coords.slice(0, idx + 1), [pt]));
    updateStats(leg.start + state.legDist);

    if (!map.getBounds().pad(-0.1).contains(pt)) map.panTo(pt, { animate: true, duration: 0.5 });

    if (state.legDist >= leg.length) arrive(state.leg + 1);
    else requestAnimationFrame(tick);
  }

  function arrive(i) {
    state.stop = i;
    state.leg = -1;
    setPlaying(false);
    const p = PUNTOS[i];
    marcher.setLatLng(p.coords);
    map.flyTo(p.coords, 14, { duration: 1.2 });
    const el = stopMarkers[i].getElement();
    if (el) { el.classList.remove("arrive"); void el.offsetWidth; el.classList.add("arrive"); }
    updateStats(i === 0 ? 0 : state.legs[i - 1].start + state.legs[i - 1].length);
    showPanel(i);
    scheduleAuto();
  }

  function jumpTo(i) {
    clearAuto();
    setPlaying(false);
    state.leg = -1;
    setTrail(completedCoords(i));
    arrive(i);
    clearAuto(); // un salto manual no dispara el modo Auto
    $("continueBtn").textContent = i === PUNTOS.length - 1 ? "Reiniciar la marcha ↺" : "Continuar la marcha ▸";
  }

  function restart() {
    jumpTo(0);
    map.flyToBounds(ghost.getBounds(), { padding: padding(), duration: 1.2 });
  }

  function togglePlay() {
    if (state.playing) { setPlaying(false); return; }
    if (state.leg >= 0) { setPlaying(true); state.lastTs = 0; requestAnimationFrame(tick); return; }
    startLeg();
  }

  function padding() {
    const wide = window.innerWidth > 900;
    return wide ? [80, 80] : [40, 40];
  }

// ---------- Eventos ----------
  $("playBtn").addEventListener("click", togglePlay);
  $("restartBtn").addEventListener("click", restart);
  $("continueBtn").addEventListener("click", startLeg);
  $("prevBtn").addEventListener("click", () => jumpTo(Math.max(0, state.stop - 1)));
  $("nextBtn").addEventListener("click", () => jumpTo(Math.min(PUNTOS.length - 1, state.stop + 1)));
  $("autoplay").addEventListener("change", () => { if (state.leg === -1) { if ($("autoplay").checked) scheduleAuto(); else { clearAuto(); showPanel(state.stop); } } });
  $("panelToggle").addEventListener("click", () => {
    const open = $("panel").classList.toggle("open");
    $("panelToggle").textContent = open ? "–" : "+";
  });
  document.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("intro-open")) return;
    if (e.code === "Space" && e.target.tagName !== "BUTTON" && e.target.tagName !== "SELECT") { e.preventDefault(); togglePlay(); }
    if (e.key === "ArrowRight") jumpTo(Math.min(PUNTOS.length - 1, state.stop + 1));
    if (e.key === "ArrowLeft") jumpTo(Math.max(0, state.stop - 1));
  });

  // 👇 Actualiza este bloque de startBtn para que reproduzca el audio
  $("startBtn").addEventListener("click", () => {
    document.body.classList.remove("intro-open");
    $("intro").classList.add("hide");
    map.invalidateSize();
    map.flyToBounds(ghost.getBounds(), { padding: padding(), duration: 1.4 });
    
    // 🎵 Reproducir el audio aquí
    if (bgAudio) {
      bgAudio.play().catch(err => console.log("Audio bloqueado:", err));
    }

    setTimeout(() => showPanel(0), 900);
  });

  // ---------- Inicio ----------
  document.body.classList.add("intro-open");
  fetch("data/ruta.geojson")
    .then((r) => r.json())
    .then((geo) => {
      buildLegs(geo);
      buildTimeline();
      buildTopTimeline();
      map.fitBounds(ghost.getBounds(), { padding: padding() });
      updateStats(0);
    })
    .catch(() => {
      // Sin la geometría, la ruta se traza en línea recta entre los puntos
      buildLegs({
        features: PUNTOS.slice(1).map((p, i) => ({
          properties: { leg: i + 1 },
          geometry: { coordinates: [PUNTOS[i].coords.slice().reverse(), p.coords.slice().reverse()] }
        }))
      });
      buildTimeline();
      map.fitBounds(ghost.getBounds(), { padding: padding() });
      updateStats(0);
    });
})();