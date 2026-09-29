import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SCRIPTS_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPO_DIRECTORY = dirname(SCRIPTS_DIRECTORY);

// El script escribe en `stories/` del repositorio donde vive, no del directorio
// actual. Por eso cada prueba corre una copia del script en un repositorio de
// mentira: nunca toca las historias reales.
function sandbox() {
  const dir = mkdtempSync(join(tmpdir(), "prepare-image-"));
  mkdirSync(join(dir, "scripts", "lib"), { recursive: true });
  mkdirSync(join(dir, "stories"));
  copyFileSync(join(SCRIPTS_DIRECTORY, "prepare-image.mjs"), join(dir, "scripts", "prepare-image.mjs"));
  copyFileSync(join(SCRIPTS_DIRECTORY, "lib", "run-cli.mjs"), join(dir, "scripts", "lib", "run-cli.mjs"));
  symlinkSync(join(REPO_DIRECTORY, "node_modules"), join(dir, "node_modules"));
  return dir;
}

function addStory(dir, slug) {
  writeFileSync(join(dir, "stories", `${slug}.md`), "---\ntitle: x\n---\n");
}

async function writePng(path, width = 20, height = 10) {
  await sharp({ create: { width, height, channels: 4, background: "#00ff00" } })
    .png()
    .toFile(path);
}

function run(dir, ...args) {
  return spawnSync(process.execPath, [join(dir, "scripts", "prepare-image.mjs"), ...args], {
    cwd: dir,
    encoding: "utf8"
  });
}

test("sin argumentos falla con código 1 y explica el uso", () => {
  const result = run(sandbox());

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ERROR: falta la imagen de origen/);
});

test("una imagen de origen que no existe falla con código 1", () => {
  const result = run(sandbox(), "/tmp/no-existe.png", "2026-01-01-prueba");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ERROR: no existe \/tmp\/no-existe\.png/);
});

test("una historia que no existe falla y no crea la carpeta", async () => {
  const dir = sandbox();
  await writePng(join(dir, "origen.png"));

  const result = run(dir, join(dir, "origen.png"), "2026-01-01-no-existe");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /no existe la historia stories\/2026-01-01-no-existe\.md/);
  assert.equal(existsSync(join(dir, "stories", "2026-01-01-no-existe")), false);
});

test("un archivo que no es una imagen falla como error esperado, sin stack", () => {
  const dir = sandbox();
  addStory(dir, "2026-01-01-prueba");
  writeFileSync(join(dir, "origen.png"), "esto no es una imagen");

  const result = run(dir, join(dir, "origen.png"), "2026-01-01-prueba");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ERROR: no pude leer .* como imagen/);
  assert.doesNotMatch(result.stderr, /\n\s+at /);
});

test("convierte un PNG en el principal.jpg de la historia", async () => {
  const dir = sandbox();
  addStory(dir, "2026-01-01-prueba");
  await writePng(join(dir, "origen.png"));

  const result = run(dir, join(dir, "origen.png"), "2026-01-01-prueba");

  assert.equal(result.status, 0, result.stderr);
  const written = await sharp(join(dir, "stories", "2026-01-01-prueba", "principal.jpg")).metadata();
  assert.equal(written.format, "jpeg");
  assert.equal(written.width, 20);
});

test("reduce una imagen que pasa el máximo de píxeles por lado", async () => {
  const dir = sandbox();
  addStory(dir, "2026-01-01-prueba");
  await writePng(join(dir, "origen.png"), 4400, 8);

  const result = run(dir, join(dir, "origen.png"), "2026-01-01-prueba");

  assert.equal(result.status, 0, result.stderr);
  const written = await sharp(join(dir, "stories", "2026-01-01-prueba", "principal.jpg")).metadata();
  assert.equal(written.width, 4000);
});

test("deduce la historia de la carpeta y borra el original con otro nombre", async () => {
  const dir = sandbox();
  addStory(dir, "2026-01-01-prueba");
  mkdirSync(join(dir, "stories", "2026-01-01-prueba"));
  const original = join(dir, "stories", "2026-01-01-prueba", "ilustracion.png");
  await writePng(original);

  const result = run(dir, original);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(original), false);
  assert.equal(existsSync(join(dir, "stories", "2026-01-01-prueba", "principal.jpg")), true);
});

test("fuera de la carpeta de una historia y sin slug, pide el slug", async () => {
  const dir = sandbox();
  await writePng(join(dir, "origen.png"));

  const result = run(dir, join(dir, "origen.png"));

  assert.equal(result.status, 1);
  assert.match(result.stderr, /no pude deducir la historia/);
});
