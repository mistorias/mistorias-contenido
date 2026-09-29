// Verifica que cada historia tenga la estructura mínima (ver
// scripts/lib/estructura-historia.mjs). Es el primer paso del pipeline de
// validación: docs/pipeline-de-contenido.md.
//
//   npm run verificar:estructura                       # todas las historias
//   npm run verificar:estructura -- stories/a.md ...   # solo esos archivos

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { extraerSeccionHistoria } from "./lib/estructura-historia.mjs";

const DIRECTORIO_HISTORIAS = "stories";

function todasLasHistorias() {
  return readdirSync(DIRECTORIO_HISTORIAS)
    .filter((nombre) => nombre.endsWith(".md"))
    .sort()
    .map((nombre) => join(DIRECTORIO_HISTORIAS, nombre));
}

const argumentos = process.argv.slice(2);
const archivos = argumentos.length > 0 ? argumentos : todasLasHistorias();

const errores = [];
for (const archivo of archivos) {
  try {
    extraerSeccionHistoria(readFileSync(archivo, "utf8"), archivo);
  } catch (error) {
    errores.push(error.message);
  }
}

if (errores.length > 0) {
  console.error(errores.join("\n"));
  process.exit(1);
}

console.log(`Estructura correcta en ${archivos.length} historia(s).`);
