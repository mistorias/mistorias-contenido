import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { allStories } from "./all-stories.mjs";

test("devuelve los .md de primer nivel, ordenados por nombre y con su ruta", () => {
  const dir = mkdtempSync(join(tmpdir(), "all-stories-"));
  writeFileSync(join(dir, "b.md"), "");
  writeFileSync(join(dir, "a.md"), "");

  assert.deepEqual(allStories(dir), [join(dir, "a.md"), join(dir, "b.md")]);
});

test("ignora las carpetas de imagen y los archivos que no son .md", () => {
  const dir = mkdtempSync(join(tmpdir(), "all-stories-"));
  writeFileSync(join(dir, "a.md"), "");
  writeFileSync(join(dir, "notas.txt"), "");
  mkdirSync(join(dir, "a"));
  writeFileSync(join(dir, "a", "principal.jpg"), "");

  assert.deepEqual(allStories(dir), [join(dir, "a.md")]);
});

test("una carpeta sin historias da una lista vacía", () => {
  assert.deepEqual(allStories(mkdtempSync(join(tmpdir(), "all-stories-"))), []);
});
