import assert from "node:assert/strict";
import { test } from "node:test";
import { extractStorySection } from "./story-structure.mjs";

const withFrontmatter = (body) => `---\ntitle: "x"\n---\n\n${body}\n`;

test("devuelve el texto entre '## La historia' y la siguiente sección", () => {
  const markdown = withFrontmatter(
    "## La historia\n\nPrimer párrafo.\n\nSegundo párrafo.\n\n## Noticias principales\n\nOtra cosa."
  );

  assert.equal(extractStorySection(markdown, "a.md"), "Primer párrafo.\n\nSegundo párrafo.");
});

test("si es la última sección, llega hasta el final del archivo", () => {
  const markdown = withFrontmatter("## Noticias principales\n\nNo cuenta.\n\n## La historia\n\nSolo esto.");

  assert.equal(extractStorySection(markdown, "a.md"), "Solo esto.");
});

test("no confunde '### ' con el final de la sección", () => {
  const markdown = withFrontmatter("## La historia\n\nUno.\n\n### Subtítulo\n\nDos.\n\n## Fin\n\nNo.");

  assert.equal(extractStorySection(markdown, "a.md"), "Uno.\n\n### Subtítulo\n\nDos.");
});

test("acepta saltos de línea de Windows", () => {
  const markdown = "---\r\ntitle: x\r\n---\r\n\r\n## La historia\r\n\r\nTexto.\r\n";

  assert.equal(extractStorySection(markdown, "a.md"), "Texto.");
});

test("falla nombrando el archivo cuando falta la sección", () => {
  const markdown = withFrontmatter("## Noticias principales\n\nTexto.");

  assert.throws(() => extractStorySection(markdown, "stories/mala.md"), /stories\/mala\.md: falta la sección/);
});

test("falla nombrando el archivo cuando la sección está vacía", () => {
  const markdown = withFrontmatter("## La historia\n\n\n## Noticias principales\n\nTexto.");

  assert.throws(() => extractStorySection(markdown, "stories/vacia.md"), /stories\/vacia\.md: la sección .* está vacía/);
});
