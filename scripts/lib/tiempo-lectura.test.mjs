import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calcularMinutosLectura,
  contarPalabras,
  escribirMinutos,
  leerMinutosDeclarados,
  minutosDeHistoria
} from "./tiempo-lectura.mjs";

const palabras = (cantidad) => Array.from({ length: cantidad }, () => "palabra").join(" ");

test("contarPalabras cuenta palabras con tildes, ñ y números", () => {
  assert.equal(contarPalabras("Ñandú, año 2026: ¿cuántas comunicaciones?"), 5);
});

test("contarPalabras trata una palabra con guion o apóstrofo como una sola", () => {
  assert.equal(contarPalabras("socio-económico d'Orbigny"), 2);
});

test("contarPalabras cuenta el texto de un enlace y no su URL", () => {
  assert.equal(contarPalabras("Lee [el informe completo](https://ejemplo.pe/informe-2026) hoy"), 5);
});

test("contarPalabras ignora énfasis, código, citas y viñetas", () => {
  assert.equal(contarPalabras("**Uno** _dos_ `tres`\n> cuatro\n- cinco\n1. seis"), 6);
});

test("contarPalabras de un texto sin palabras es 0", () => {
  assert.equal(contarPalabras("*** — ---"), 0);
});

test("una palabra es 1 minuto", () => {
  assert.equal(calcularMinutosLectura("Hola"), 1);
});

test("un texto vacío no baja de 1 minuto", () => {
  assert.equal(calcularMinutosLectura(""), 1);
});

test("exactamente 200 palabras son 1 minuto", () => {
  assert.equal(calcularMinutosLectura(palabras(200)), 1);
});

test("201 palabras son 2 minutos", () => {
  assert.equal(calcularMinutosLectura(palabras(201)), 2);
});

test("minutosDeHistoria solo cuenta '## La historia'", () => {
  const md = `---\ntitle: "x"\n---\n\n## La historia\n\n${palabras(200)}\n\n## Noticias principales\n\n${palabras(500)}\n`;

  assert.equal(minutosDeHistoria(md, "a.md"), 1);
});

test("minutosDeHistoria falla si falta la sección (error de estructura)", () => {
  assert.throws(() => minutosDeHistoria("---\ntitle: x\n---\n\nTexto.", "stories/a.md"), /stories\/a\.md: falta la sección/);
});

const base = `---\ntitle: "x"\nauthorship: "escrito-con-ia"\nthemes: ["a"]\n---\n\n## La historia\n\nTexto.\n`;

test("leerMinutosDeclarados devuelve null si el campo no está", () => {
  assert.equal(leerMinutosDeclarados(base), null);
});

test("leerMinutosDeclarados lee el valor del frontmatter", () => {
  assert.equal(leerMinutosDeclarados(base.replace('themes:', "readingTimeMinutes: 7\nthemes:")), 7);
});

test("leerMinutosDeclarados ignora un campo igual que aparezca en el cuerpo", () => {
  assert.equal(leerMinutosDeclarados(`${base}\nreadingTimeMinutes: 9\n`), null);
});

test("escribirMinutos inserta el campo justo después de authorship", () => {
  const resultado = escribirMinutos(base, 3, "a.md");

  assert.equal(
    resultado,
    `---\ntitle: "x"\nauthorship: "escrito-con-ia"\nreadingTimeMinutes: 3\nthemes: ["a"]\n---\n\n## La historia\n\nTexto.\n`
  );
});

test("escribirMinutos reemplaza el valor existente sin tocar lo demás", () => {
  const conCampo = escribirMinutos(base, 3, "a.md");

  assert.equal(escribirMinutos(conCampo, 5, "a.md"), conCampo.replace("readingTimeMinutes: 3", "readingTimeMinutes: 5"));
});

test("escribirMinutos es idempotente", () => {
  const una = escribirMinutos(base, 3, "a.md");

  assert.equal(escribirMinutos(una, 3, "a.md"), una);
});

test("escribirMinutos sin authorship agrega el campo al final del frontmatter", () => {
  const md = `---\ntitle: "x"\n---\n\nTexto.\n`;

  assert.equal(escribirMinutos(md, 2, "a.md"), `---\ntitle: "x"\nreadingTimeMinutes: 2\n---\n\nTexto.\n`);
});

test("escribirMinutos conserva los saltos de línea de Windows", () => {
  const resultado = escribirMinutos(base.replace(/\n/g, "\r\n"), 3, "a.md");

  assert.ok(resultado.includes("readingTimeMinutes: 3\r\n"));
  assert.ok(!/[^\r]\n/.test(resultado));
});

test("escribirMinutos falla nombrando el archivo si no hay frontmatter", () => {
  assert.throws(() => escribirMinutos("Solo texto.", 1, "stories/a.md"), /stories\/a\.md: no tiene frontmatter/);
});
