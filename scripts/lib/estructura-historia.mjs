// Estructura mínima que toda historia tiene que cumplir para que el resto del
// pipeline (tiempo de lectura, redes sociales) pueda leerla sin adivinar.

export const TITULO_SECCION_HISTORIA = "## La historia";

/**
 * Devuelve el texto de la sección `## La historia`: lo que hay entre ese
 * encabezado y el siguiente `## ` (o el final del archivo).
 *
 * Falla si la sección no existe o está vacía. Es una función aparte, y no un
 * detalle del cálculo del tiempo de lectura, para que "la historia está mal
 * armada" y "el tiempo declarado no coincide" sean dos fallas distintas, con
 * dos mensajes distintos.
 */
export function extraerSeccionHistoria(markdown, archivo) {
  const lineas = markdown.replace(/\r\n/g, "\n").split("\n");
  const inicio = lineas.findIndex((linea) => linea.trim() === TITULO_SECCION_HISTORIA);

  if (inicio === -1) {
    throw new Error(
      `${archivo}: falta la sección "${TITULO_SECCION_HISTORIA}". Sin ella no se puede calcular el tiempo de lectura.`
    );
  }

  const resto = lineas.slice(inicio + 1);
  const fin = resto.findIndex((linea) => /^## /.test(linea));
  const cuerpo = (fin === -1 ? resto : resto.slice(0, fin)).join("\n").trim();

  if (cuerpo === "") {
    throw new Error(`${archivo}: la sección "${TITULO_SECCION_HISTORIA}" está vacía.`);
  }

  return cuerpo;
}
