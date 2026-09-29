import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateReadingMinutes,
  countWords,
  writeMinutes,
  readDeclaredMinutes,
  storyReadingMinutes
} from "./reading-time.mjs";

const words = (count) => Array.from({ length: count }, () => "palabra").join(" ");

test("countWords cuenta palabras con tildes, ñ y números", () => {
  assert.equal(countWords("Ñandú, año 2026: ¿cuántas comunicaciones?"), 5);
});

test("countWords trata una palabra con guion o apóstrofo como una sola", () => {
  assert.equal(countWords("socio-económico d'Orbigny"), 2);
});

test("countWords cuenta el texto de un enlace y no su URL", () => {
  assert.equal(countWords("Lee [el informe completo](https://ejemplo.pe/informe-2026) hoy"), 5);
});

test("countWords ignora énfasis, código, citas y viñetas", () => {
  assert.equal(countWords("**Uno** _dos_ `tres`\n> cuatro\n- cinco\n1. seis"), 6);
});

test("countWords de un texto sin palabras es 0", () => {
  assert.equal(countWords("*** — ---"), 0);
});

test("una palabra es 1 minuto", () => {
  assert.equal(calculateReadingMinutes("Hola"), 1);
});

test("un texto vacío no baja de 1 minuto", () => {
  assert.equal(calculateReadingMinutes(""), 1);
});

test("exactamente 200 palabras son 1 minuto", () => {
  assert.equal(calculateReadingMinutes(words(200)), 1);
});

test("201 palabras son 2 minutos", () => {
  assert.equal(calculateReadingMinutes(words(201)), 2);
});

test("storyReadingMinutes solo cuenta '## La historia'", () => {
  const markdown = `---\ntitle: "x"\n---\n\n## La historia\n\n${words(200)}\n\n## Noticias principales\n\n${words(500)}\n`;

  assert.equal(storyReadingMinutes(markdown, "a.md"), 1);
});

test("storyReadingMinutes falla si falta la sección (error de estructura)", () => {
  assert.throws(() => storyReadingMinutes("---\ntitle: x\n---\n\nTexto.", "stories/a.md"), /stories\/a\.md: falta la sección/);
});

const baseStory = `---\ntitle: "x"\nauthorship: "escrito-con-ia"\nthemes: ["a"]\n---\n\n## La historia\n\nTexto.\n`;

test("readDeclaredMinutes devuelve null si el campo no está", () => {
  assert.equal(readDeclaredMinutes(baseStory), null);
});

test("readDeclaredMinutes lee el valor del frontmatter", () => {
  assert.equal(readDeclaredMinutes(baseStory.replace('themes:', "readingTimeMinutes: 7\nthemes:")), 7);
});

test("readDeclaredMinutes ignora un campo igual que aparezca en el cuerpo", () => {
  assert.equal(readDeclaredMinutes(`${baseStory}\nreadingTimeMinutes: 9\n`), null);
});

test("writeMinutes inserta el campo justo después de authorship", () => {
  const result = writeMinutes(baseStory, 3, "a.md");

  assert.equal(
    result,
    `---\ntitle: "x"\nauthorship: "escrito-con-ia"\nreadingTimeMinutes: 3\nthemes: ["a"]\n---\n\n## La historia\n\nTexto.\n`
  );
});

test("writeMinutes reemplaza el valor existente sin tocar lo demás", () => {
  const withField = writeMinutes(baseStory, 3, "a.md");

  assert.equal(writeMinutes(withField, 5, "a.md"), withField.replace("readingTimeMinutes: 3", "readingTimeMinutes: 5"));
});

test("writeMinutes es idempotente", () => {
  const once = writeMinutes(baseStory, 3, "a.md");

  assert.equal(writeMinutes(once, 3, "a.md"), once);
});

test("writeMinutes sin authorship agrega el campo al final del frontmatter", () => {
  const markdown = `---\ntitle: "x"\n---\n\nTexto.\n`;

  assert.equal(writeMinutes(markdown, 2, "a.md"), `---\ntitle: "x"\nreadingTimeMinutes: 2\n---\n\nTexto.\n`);
});

test("writeMinutes conserva los saltos de línea de Windows", () => {
  const result = writeMinutes(baseStory.replace(/\n/g, "\r\n"), 3, "a.md");

  assert.ok(result.includes("readingTimeMinutes: 3\r\n"));
  assert.ok(!/[^\r]\n/.test(result));
});

test("writeMinutes falla nombrando el archivo si no hay frontmatter", () => {
  assert.throws(() => writeMinutes("Solo texto.", 1, "stories/a.md"), /stories\/a\.md: no tiene frontmatter/);
});
