import assert from "node:assert/strict";
import { test } from "node:test";
import { historiasModificadas } from "./historias-modificadas.mjs";

test("incluye historias modificadas, en stage y sin seguimiento", () => {
  const salida = [" M stories/a.md", "M  stories/b.md", "?? stories/c.md", "AM stories/d.md"].join("\n");

  assert.deepEqual(historiasModificadas(salida), [
    "stories/a.md",
    "stories/b.md",
    "stories/c.md",
    "stories/d.md"
  ]);
});

test("descarta eliminadas", () => {
  assert.deepEqual(historiasModificadas(" D stories/a.md\nD  stories/b.md"), []);
});

test("una renombrada cuenta con su nombre nuevo", () => {
  assert.deepEqual(historiasModificadas("R  stories/vieja.md -> stories/nueva.md"), ["stories/nueva.md"]);
});

test("descarta lo que no es una historia: imágenes, otras carpetas, subcarpetas", () => {
  const salida = [
    "?? stories/a/principal.jpg",
    "?? stories/a/",
    " M authors/paolo-carrasco.md",
    " M README.md"
  ].join("\n");

  assert.deepEqual(historiasModificadas(salida), []);
});

test("una salida vacía no da historias", () => {
  assert.deepEqual(historiasModificadas(""), []);
});
