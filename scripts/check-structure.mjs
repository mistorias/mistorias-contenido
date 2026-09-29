// Verifica que cada historia tenga la estructura mínima (ver
// scripts/lib/story-structure.mjs). Es el primer paso del pipeline de
// validación: docs/pipeline-de-contenido.md.
//
//   npm run check:structure                       # todas las historias
//   npm run check:structure -- stories/a.md ...   # solo esos archivos

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { extractStorySection } from "./lib/story-structure.mjs";

const STORIES_DIRECTORY = "stories";

function allStories() {
  return readdirSync(STORIES_DIRECTORY)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => join(STORIES_DIRECTORY, name));
}

const args = process.argv.slice(2);
const files = args.length > 0 ? args : allStories();

const errors = [];
for (const file of files) {
  try {
    extractStorySection(readFileSync(file, "utf8"), file);
  } catch (error) {
    errors.push(error.message);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Estructura correcta en ${files.length} historia(s).`);
