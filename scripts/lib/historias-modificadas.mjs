/**
 * Historias (`stories/*.md`) nuevas o modificadas según la salida de
 * `git status --porcelain`: en stage, sin stage o sin seguimiento. Las
 * eliminadas se descartan (no hay archivo que leer) y las renombradas cuentan
 * con su nombre nuevo.
 */
export function historiasModificadas(salidaPorcelain) {
  return salidaPorcelain
    .split("\n")
    .filter((linea) => linea.length > 3)
    .filter((linea) => !linea.slice(0, 2).includes("D"))
    .map((linea) => linea.slice(3).split(" -> ").pop().replace(/^"|"$/g, ""))
    .filter((ruta) => /^stories\/[^/]+\.md$/.test(ruta));
}
