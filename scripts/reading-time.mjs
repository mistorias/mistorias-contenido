// Calcula el tiempo de lectura de las historias y lo deja en su frontmatter
// (`readingTimeMinutes`). Es la fuente de verdad del dato: ver
// docs/pipeline-de-contenido.md.
//
//   npm run reading-time                          # todas las historias
//   npm run reading-time -- stories/a.md ...      # solo esos archivos
//   npm run reading-time -- --changed             # solo las que git ve modificadas
//   npm run reading-time -- --check [...]         # no escribe: falla si algo no coincide

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { changedStories } from "./lib/changed-stories.mjs";
import {
  READING_TIME_KEY,
  readDeclaredMinutes,
  storyReadingMinutes,
  writeMinutes
} from "./lib/reading-time.mjs";

const STORIES_DIRECTORY = "stories";
const KNOWN_FLAGS = ["--check", "--changed"];

function allStories() {
  return readdirSync(STORIES_DIRECTORY)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => join(STORIES_DIRECTORY, name));
}

function storiesChangedInGit() {
  const output = execFileSync("git", ["status", "--porcelain", "--", `${STORIES_DIRECTORY}/*.md`], {
    encoding: "utf8"
  });
  return changedStories(output);
}

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

const args = process.argv.slice(2);
const check = args.includes("--check");
const onlyChanged = args.includes("--changed");
const requestedFiles = args.filter((arg) => !arg.startsWith("--"));
const unknownFlags = args.filter((arg) => arg.startsWith("--") && !KNOWN_FLAGS.includes(arg));

if (unknownFlags.length > 0) {
  exitWithError(`Opción desconocida: ${unknownFlags.join(", ")}. Opciones: --changed, --check.`);
}

if (onlyChanged && requestedFiles.length > 0) {
  exitWithError("Usa --changed o una lista de archivos, no las dos a la vez.");
}

const files = onlyChanged
  ? storiesChangedInGit()
  : requestedFiles.length > 0
    ? requestedFiles
    : allStories();

if (files.length === 0) {
  console.log("No hay historias modificadas.");
  process.exit(0);
}

const errors = [];
let updated = 0;

for (const file of files) {
  try {
    const markdown = readFileSync(file, "utf8");
    const expected = storyReadingMinutes(markdown, file);
    const declared = readDeclaredMinutes(markdown);

    if (declared === expected) continue;

    if (check) {
      errors.push(
        `${file}: ${READING_TIME_KEY} es ${declared ?? "inexistente"} y debería ser ${expected}. ` +
          `Corrígelo con: npm run reading-time -- ${file}`
      );
      continue;
    }

    writeFileSync(file, writeMinutes(markdown, expected, file));
    updated += 1;
    console.log(`${file}: ${READING_TIME_KEY} ${declared ?? "(nuevo)"} → ${expected}`);
  } catch (error) {
    errors.push(error.message);
  }
}

if (errors.length > 0) {
  exitWithError(errors.join("\n"));
}

console.log(
  check
    ? `Tiempo de lectura correcto en ${files.length} historia(s).`
    : `${updated} de ${files.length} historia(s) actualizada(s).`
);
