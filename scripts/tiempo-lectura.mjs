// Calcula el tiempo de lectura de las historias y lo deja en su frontmatter
// (`readingTimeMinutes`). Es la fuente de verdad del dato: ver
// docs/pipeline-de-contenido.md.
//
//   npm run tiempo-lectura                          # todas las historias
//   npm run tiempo-lectura -- stories/a.md ...      # solo esos archivos
//   npm run tiempo-lectura -- --modificados         # solo las que git ve modificadas
//   npm run tiempo-lectura -- --verificar [...]     # no escribe: falla si algo no coincide

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { historiasModificadas } from "./lib/historias-modificadas.mjs";
import {
  CLAVE_TIEMPO_LECTURA,
  escribirMinutos,
  leerMinutosDeclarados,
  minutosDeHistoria
} from "./lib/tiempo-lectura.mjs";

const DIRECTORIO_HISTORIAS = "stories";

function todasLasHistorias() {
  return readdirSync(DIRECTORIO_HISTORIAS)
    .filter((nombre) => nombre.endsWith(".md"))
    .sort()
    .map((nombre) => join(DIRECTORIO_HISTORIAS, nombre));
}

function modificadasSegunGit() {
  const salida = execFileSync("git", ["status", "--porcelain", "--", `${DIRECTORIO_HISTORIAS}/*.md`], {
    encoding: "utf8"
  });
  return historiasModificadas(salida);
}

function salirConError(mensaje) {
  console.error(mensaje);
  process.exit(1);
}

const argumentos = process.argv.slice(2);
const verificar = argumentos.includes("--verificar");
const soloModificadas = argumentos.includes("--modificados");
const archivosPedidos = argumentos.filter((argumento) => !argumento.startsWith("--"));
const desconocidos = argumentos.filter(
  (argumento) => argumento.startsWith("--") && !["--verificar", "--modificados"].includes(argumento)
);

if (desconocidos.length > 0) {
  salirConError(`Opción desconocida: ${desconocidos.join(", ")}. Opciones: --modificados, --verificar.`);
}

if (soloModificadas && archivosPedidos.length > 0) {
  salirConError("Usa --modificados o una lista de archivos, no las dos a la vez.");
}

const archivos = soloModificadas
  ? modificadasSegunGit()
  : archivosPedidos.length > 0
    ? archivosPedidos
    : todasLasHistorias();

if (archivos.length === 0) {
  console.log("No hay historias modificadas.");
  process.exit(0);
}

const errores = [];
let actualizadas = 0;

for (const archivo of archivos) {
  try {
    const markdown = readFileSync(archivo, "utf8");
    const esperado = minutosDeHistoria(markdown, archivo);
    const declarado = leerMinutosDeclarados(markdown);

    if (declarado === esperado) continue;

    if (verificar) {
      errores.push(
        `${archivo}: ${CLAVE_TIEMPO_LECTURA} es ${declarado ?? "inexistente"} y debería ser ${esperado}. ` +
          `Corrígelo con: npm run tiempo-lectura -- ${archivo}`
      );
      continue;
    }

    writeFileSync(archivo, escribirMinutos(markdown, esperado, archivo));
    actualizadas += 1;
    console.log(`${archivo}: ${CLAVE_TIEMPO_LECTURA} ${declarado ?? "(nuevo)"} → ${esperado}`);
  } catch (error) {
    errores.push(error.message);
  }
}

if (errores.length > 0) {
  salirConError(errores.join("\n"));
}

console.log(
  verificar
    ? `Tiempo de lectura correcto en ${archivos.length} historia(s).`
    : `${actualizadas} de ${archivos.length} historia(s) actualizada(s).`
);
