// Estructura mínima que toda historia tiene que cumplir para que el resto del
// pipeline (tiempo de lectura, redes sociales) pueda leerla sin adivinar.

export const STORY_SECTION_TITLE = "## La historia";

/**
 * Devuelve el texto de la sección `## La historia`: lo que hay entre ese
 * encabezado y el siguiente `## ` (o el final del archivo).
 *
 * Falla si la sección no existe o está vacía. Es una función aparte, y no un
 * detalle del cálculo del tiempo de lectura, para que "la historia está mal
 * armada" y "el tiempo declarado no coincide" sean dos fallas distintas, con
 * dos mensajes distintos.
 */
export function extractStorySection(markdown, file) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((line) => line.trim() === STORY_SECTION_TITLE);

  if (start === -1) {
    throw new Error(
      `${file}: falta la sección "${STORY_SECTION_TITLE}". Sin ella no se puede calcular el tiempo de lectura.`
    );
  }

  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^## /.test(line));
  const body = (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();

  if (body === "") {
    throw new Error(`${file}: la sección "${STORY_SECTION_TITLE}" está vacía.`);
  }

  return body;
}
