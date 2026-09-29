import { extractStorySection } from "./story-structure.mjs";

// 200 palabras por minuto: lectura atenta en el celular de alguien que no es
// especialista en el tema. Es conservadora a propósito: preferimos prometer
// un poco más de lo que tarda antes que un tiempo que la mayoría no alcanza.
// Cambiarla cambia el tiempo de todas las historias, así que la CI verifica
// todas y no solo las modificadas.
export const WORDS_PER_MINUTE = 200;

export const READING_TIME_KEY = "readingTimeMinutes";

const WORD = /[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu;

/**
 * Cuenta las palabras de un texto en Markdown. El formato no cuenta: un
 * enlace `[texto](url)` aporta las palabras de `texto` y nunca las de la URL,
 * y los marcadores (`*`, `_`, `` ` ``, `>`, viñetas) no son palabras.
 */
export function countWords(text) {
  const withoutLinks = text.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1");
  const withoutMarkers = withoutLinks
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\s*>+\s?/gm, "")
    .replace(/[*_`]/g, "");

  return withoutMarkers.match(WORD)?.length ?? 0;
}

/** Minutos de lectura de un texto: redondea hacia arriba y nunca baja de 1. */
export function calculateReadingMinutes(text) {
  return Math.max(1, Math.ceil(countWords(text) / WORDS_PER_MINUTE));
}

/**
 * Minutos de lectura de una historia completa: solo cuenta `## La historia`.
 * Falla (con el error de `extractStorySection`) si la historia no tiene esa
 * sección.
 */
export function storyReadingMinutes(markdown, file) {
  return calculateReadingMinutes(extractStorySection(markdown, file));
}

function frontmatterBounds(lines) {
  if (lines[0]?.trim() !== "---") return null;

  const close = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  return close === -1 ? null : { open: 0, close };
}

/** Valor de `readingTimeMinutes` declarado en el frontmatter, o `null`. */
export function readDeclaredMinutes(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const bounds = frontmatterBounds(lines);
  if (bounds === null) return null;

  for (const line of lines.slice(1, bounds.close)) {
    const match = line.match(new RegExp(`^${READING_TIME_KEY}:\\s*(\\S+)\\s*$`));
    if (match) return Number(match[1]);
  }

  return null;
}

/**
 * Deja `readingTimeMinutes: N` en el frontmatter tocando solo esa línea: si
 * existe la reemplaza; si no, la agrega después de `authorship` (o al final
 * del frontmatter). No reescribe el YAML, así se respeta la convención de una
 * línea por campo y no cambia nada más del archivo.
 */
export function writeMinutes(markdown, minutes, file) {
  const lineBreak = markdown.includes("\r\n") ? "\r\n" : "\n";
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const bounds = frontmatterBounds(lines);

  if (bounds === null) {
    throw new Error(`${file}: no tiene frontmatter (bloque entre "---").`);
  }

  const newLine = `${READING_TIME_KEY}: ${minutes}`;
  const inFrontmatter = (index) => index > 0 && index < bounds.close;
  const existing = lines.findIndex((line, index) => inFrontmatter(index) && line.startsWith(`${READING_TIME_KEY}:`));

  if (existing !== -1) {
    lines[existing] = newLine;
  } else {
    const authorship = lines.findIndex((line, index) => inFrontmatter(index) && line.startsWith("authorship:"));
    lines.splice(authorship === -1 ? bounds.close : authorship + 1, 0, newLine);
  }

  return lines.join(lineBreak);
}
