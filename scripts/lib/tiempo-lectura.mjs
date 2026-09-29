import { extraerSeccionHistoria } from "./estructura-historia.mjs";

// 200 palabras por minuto: lectura atenta en el celular de alguien que no es
// especialista en el tema. Es conservadora a propósito: preferimos prometer
// un poco más de lo que tarda antes que un tiempo que la mayoría no alcanza.
// Cambiarla cambia el tiempo de todas las historias, así que la CI verifica
// todas y no solo las modificadas.
export const PALABRAS_POR_MINUTO = 200;

export const CLAVE_TIEMPO_LECTURA = "readingTimeMinutes";

const PALABRA = /[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu;

/**
 * Cuenta las palabras de un texto en Markdown. El formato no cuenta: un
 * enlace `[texto](url)` aporta las palabras de `texto` y nunca las de la URL,
 * y los marcadores (`*`, `_`, `` ` ``, `>`, viñetas) no son palabras.
 */
export function contarPalabras(texto) {
  const sinEnlaces = texto.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1");
  const sinMarcadores = sinEnlaces
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\s*>+\s?/gm, "")
    .replace(/[*_`]/g, "");

  return sinMarcadores.match(PALABRA)?.length ?? 0;
}

/** Minutos de lectura de un texto: redondea hacia arriba y nunca baja de 1. */
export function calcularMinutosLectura(texto) {
  return Math.max(1, Math.ceil(contarPalabras(texto) / PALABRAS_POR_MINUTO));
}

/**
 * Minutos de lectura de una historia completa: solo cuenta `## La historia`.
 * Falla (con el error de `extraerSeccionHistoria`) si la historia no tiene esa
 * sección.
 */
export function minutosDeHistoria(markdown, archivo) {
  return calcularMinutosLectura(extraerSeccionHistoria(markdown, archivo));
}

function limitesDelFrontmatter(lineas) {
  if (lineas[0]?.trim() !== "---") return null;

  const cierre = lineas.findIndex((linea, indice) => indice > 0 && linea.trim() === "---");
  return cierre === -1 ? null : { inicio: 0, cierre };
}

/** Valor de `readingTimeMinutes` declarado en el frontmatter, o `null`. */
export function leerMinutosDeclarados(markdown) {
  const lineas = markdown.replace(/\r\n/g, "\n").split("\n");
  const limites = limitesDelFrontmatter(lineas);
  if (limites === null) return null;

  for (const linea of lineas.slice(1, limites.cierre)) {
    const coincidencia = linea.match(new RegExp(`^${CLAVE_TIEMPO_LECTURA}:\\s*(\\S+)\\s*$`));
    if (coincidencia) return Number(coincidencia[1]);
  }

  return null;
}

/**
 * Deja `readingTimeMinutes: N` en el frontmatter tocando solo esa línea: si
 * existe la reemplaza; si no, la agrega después de `authorship` (o al final
 * del frontmatter). No reescribe el YAML, así se respeta la convención de una
 * línea por campo y no cambia nada más del archivo.
 */
export function escribirMinutos(markdown, minutos, archivo) {
  const finDeLinea = markdown.includes("\r\n") ? "\r\n" : "\n";
  const lineas = markdown.replace(/\r\n/g, "\n").split("\n");
  const limites = limitesDelFrontmatter(lineas);

  if (limites === null) {
    throw new Error(`${archivo}: no tiene frontmatter (bloque entre "---").`);
  }

  const nuevaLinea = `${CLAVE_TIEMPO_LECTURA}: ${minutos}`;
  const existente = lineas.findIndex(
    (linea, indice) => indice > 0 && indice < limites.cierre && linea.startsWith(`${CLAVE_TIEMPO_LECTURA}:`)
  );

  if (existente !== -1) {
    lineas[existente] = nuevaLinea;
  } else {
    const autoria = lineas.findIndex(
      (linea, indice) => indice > 0 && indice < limites.cierre && linea.startsWith("authorship:")
    );
    lineas.splice(autoria === -1 ? limites.cierre : autoria + 1, 0, nuevaLinea);
  }

  return lineas.join(finDeLinea);
}
