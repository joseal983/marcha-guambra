#!/usr/bin/env node
/**
 * scripts/build-config.js
 * Genera js/config.js inyectando CARTO_KEY desde las variables de entorno.
 * Uso local:
 *   1. Copia .env.example → .env  y rellena CARTO_KEY=tu_key
 *   2. node scripts/build-config.js
 * En Netlify/Vercel se ejecuta automáticamente antes del deploy.
 */

const fs   = require("fs");
const path = require("path");

// Soporte opcional para archivo .env local (sin instalar dotenv)
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    });
}

const cartoKey = process.env.CARTO_KEY || "";

if (!cartoKey) {
  console.warn("⚠️  CARTO_KEY no definida — el mapa usará tiles sin autenticación.");
}

const output = `// ⚠️  ARCHIVO GENERADO — no editar manualmente.
// Generado el ${new Date().toISOString()} por scripts/build-config.js
window.__ENV__ = {
  CARTO_KEY: ${JSON.stringify(cartoKey)}
};
`;

const dest = path.resolve(__dirname, "../js/config.js");
fs.writeFileSync(dest, output, "utf8");
console.log(`✅  js/config.js generado (key ${cartoKey ? "presente" : "vacía"}).`);
