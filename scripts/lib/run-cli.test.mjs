import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { formatCliError, UserError } from "./run-cli.mjs";

const RUN_CLI_URL = pathToFileURL(new URL("./run-cli.mjs", import.meta.url).pathname).href;

// runCli fija el código de salida del proceso, así que se prueba en un
// proceso aparte: hacerlo aquí cambiaría el código de salida del propio test.
function runInChildProcess(body) {
  const code = `import { runCli, UserError } from "${RUN_CLI_URL}"; runCli(async () => { ${body} });`;
  return spawnSync(process.execPath, ["--input-type=module", "-e", code], { encoding: "utf8" });
}

test("un UserError se muestra solo con su mensaje", () => {
  assert.equal(formatCliError(new UserError("falta el archivo")), "ERROR: falta el archivo");
});

test("un error inesperado se muestra con su stack", () => {
  const error = new TypeError("undefined no es una función");

  assert.match(formatCliError(error), /TypeError: undefined no es una función\n\s+at /);
});

test("un valor que no es Error se muestra como texto", () => {
  assert.equal(formatCliError("texto suelto"), "texto suelto");
});

test("sin errores sale con código 0", () => {
  const result = runInChildProcess('console.log("listo");');

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "listo");
});

test("un UserError sale con código 1 y solo el mensaje", () => {
  const result = runInChildProcess('throw new UserError("mala entrada");');

  assert.equal(result.status, 1);
  assert.equal(result.stderr.trim(), "ERROR: mala entrada");
});

test("un error inesperado sale con código 1 y el stack", () => {
  const result = runInChildProcess("null.propiedad;");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /TypeError/);
});

test("un rechazo asíncrono también sale con código 1", () => {
  const result = runInChildProcess('await Promise.reject(new UserError("tarde"));');

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ERROR: tarde/);
});
