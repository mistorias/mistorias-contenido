/**
 * Historias (`stories/*.md`) nuevas o modificadas según la salida de
 * `git status --porcelain`: en stage, sin stage o sin seguimiento. Las
 * eliminadas se descartan (no hay archivo que leer) y las renombradas cuentan
 * con su nombre nuevo.
 */
export function changedStories(porcelainOutput) {
  return porcelainOutput
    .split("\n")
    .filter((line) => line.length > 3)
    .filter((line) => !line.slice(0, 2).includes("D"))
    .map((line) => line.slice(3).split(" -> ").pop().replace(/^"|"$/g, ""))
    .filter((path) => /^stories\/[^/]+\.md$/.test(path));
}
