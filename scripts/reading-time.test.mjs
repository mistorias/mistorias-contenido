import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("./reading-time.mjs", import.meta.url));

const words = (count) => Array.from({ length: count }, () => "palabra").join(" ");
const story = (count) => `---\ntitle: "x"\nauthorship: "escrito-con-ia"\n---\n\n## La historia\n\n${words(count)}\n`;

// Un repositorio de mentira: el script trabaja sobre `stories/` del directorio
// actual, así que cada prueba corre en el suyo y no toca las historias reales.
function fixtureRepo(stories) {
  const dir = mkdtempSync(join(tmpdir(), "reading-time-"));
  mkdirSync(join(dir, "stories"));
  for (const [name, content] of Object.entries(stories)) {
    writeFileSync(join(dir, "stories", name), content);
  }
  const git = (...args) => execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", ...args], { cwd: dir });
  git("init", "-q");
  git("add", "-A");
  git("commit", "-q", "-m", "base");
  return dir;
}

function run(dir, ...args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { cwd: dir, encoding: "utf8" });
}

test("--check falla con código 1 si falta el campo, y dice el valor y el comando", () => {
  const dir = fixtureRepo({ "a.md": story(250) });

  const result = run(dir, "--check");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ERROR: stories\/a\.md: .* inexistente y debería ser 2/);
  assert.match(result.stderr, /npm run reading-time -- stories\/a\.md/);
});

test("escribir deja el campo y después --check pasa", () => {
  const dir = fixtureRepo({ "a.md": story(250) });

  assert.equal(run(dir).status, 0);
  assert.match(readFileSync(join(dir, "stories", "a.md"), "utf8"), /authorship: "escrito-con-ia"\nreadingTimeMinutes: 2\n/);
  assert.equal(run(dir, "--check").status, 0);
});

test("con archivos, solo toca esos", () => {
  const dir = fixtureRepo({ "a.md": story(10), "b.md": story(10) });

  run(dir, "stories/a.md");

  assert.match(readFileSync(join(dir, "stories", "a.md"), "utf8"), /readingTimeMinutes: 1/);
  assert.doesNotMatch(readFileSync(join(dir, "stories", "b.md"), "utf8"), /readingTimeMinutes/);
});

test("--changed solo toca las historias que git ve modificadas o nuevas", () => {
  const dir = fixtureRepo({ "a.md": story(10), "b.md": story(10) });
  writeFileSync(join(dir, "stories", "a.md"), story(10) + "\nOtra línea.\n");
  writeFileSync(join(dir, "stories", "c.md"), story(10));

  const result = run(dir, "--changed");

  assert.equal(result.status, 0);
  assert.match(readFileSync(join(dir, "stories", "a.md"), "utf8"), /readingTimeMinutes: 1/);
  assert.match(readFileSync(join(dir, "stories", "c.md"), "utf8"), /readingTimeMinutes: 1/);
  assert.doesNotMatch(readFileSync(join(dir, "stories", "b.md"), "utf8"), /readingTimeMinutes/);
});

test("--changed sin cambios no hace nada y sale con código 0", () => {
  const dir = fixtureRepo({ "a.md": story(10) });

  const result = run(dir, "--changed");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /No hay historias modificadas/);
});

test("una historia sin '## La historia' falla con el error de estructura", () => {
  const dir = fixtureRepo({ "a.md": "---\ntitle: x\n---\n\nSolo texto.\n" });

  const result = run(dir, "--check");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /stories\/a\.md: falta la sección/);
});

test("una opción desconocida sale con código 1", () => {
  const result = run(fixtureRepo({ "a.md": story(10) }), "--verificar");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Opción desconocida: --verificar/);
});

test("--changed junto con archivos sale con código 1", () => {
  const result = run(fixtureRepo({ "a.md": story(10) }), "--changed", "stories/a.md");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /no las dos a la vez/);
});
