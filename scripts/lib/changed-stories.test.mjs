import assert from "node:assert/strict";
import { test } from "node:test";
import { changedStories } from "./changed-stories.mjs";

test("incluye historias modificadas, en stage y sin seguimiento", () => {
  const output = [" M stories/a.md", "M  stories/b.md", "?? stories/c.md", "AM stories/d.md"].join("\n");

  assert.deepEqual(changedStories(output), [
    "stories/a.md",
    "stories/b.md",
    "stories/c.md",
    "stories/d.md"
  ]);
});

test("descarta eliminadas", () => {
  assert.deepEqual(changedStories(" D stories/a.md\nD  stories/b.md"), []);
});

test("una renombrada cuenta con su nombre nuevo", () => {
  assert.deepEqual(changedStories("R  stories/vieja.md -> stories/nueva.md"), ["stories/nueva.md"]);
});

test("descarta lo que no es una historia: imágenes, otras carpetas, subcarpetas", () => {
  const output = [
    "?? stories/a/principal.jpg",
    "?? stories/a/",
    " M authors/paolo-carrasco.md",
    " M README.md"
  ].join("\n");

  assert.deepEqual(changedStories(output), []);
});

test("una salida vacía no da historias", () => {
  assert.deepEqual(changedStories(""), []);
});
