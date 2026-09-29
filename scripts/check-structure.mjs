// Verifica que cada historia tenga la estructura mínima (ver
// scripts/lib/story-structure.mjs). Es el primer paso del pipeline de
// validación: docs/pipeline-de-contenido.md.
//
//   npm run check:structure                       # todas las historias
//   npm run check:structure -- stories/a.md ...   # solo esos archivos

import { readFileSync } from "node:fs";
import { allStories } from "./lib/all-stories.mjs";
import { runCli, UserError } from "./lib/run-cli.mjs";
import { extractStorySection } from "./lib/story-structure.mjs";

async function main() {
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
    throw new UserError(errors.join("\n"));
  }

  console.log(`Estructura correcta en ${files.length} historia(s).`);
}

runCli(main);
