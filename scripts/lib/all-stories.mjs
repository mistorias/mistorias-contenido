import { readdirSync } from "node:fs";
import { join } from "node:path";

export const STORIES_DIRECTORY = "stories";

/**
 * Rutas de todas las historias (`stories/*.md`), ordenadas por nombre. Solo los
 * `.md` de primer nivel: las carpetas de imagen de cada historia no cuentan.
 */
export function allStories(directory = STORIES_DIRECTORY) {
  return readdirSync(directory)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => join(directory, name));
}
