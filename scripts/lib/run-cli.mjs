// Patrón de entrada de todos los scripts de línea de comandos: cada script
// define `async function main()` y la invoca con `runCli(main)`. Es el único
// lugar que convierte un error en salida y en código de salida; las funciones
// de scripts/lib/ solo lanzan `throw`. Ver docs/convenciones-de-scripts.md.

/**
 * Error esperado: algo que quien ejecuta el script puede corregir (falta un
 * archivo, una historia mal armada, una opción inválida). Se muestra solo su
 * mensaje. Cualquier otro error es un bug del script y se muestra con su stack.
 */
export class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserError";
  }
}

export function formatCliError(error) {
  if (error instanceof UserError) {
    return `ERROR: ${error.message}`;
  }

  return error instanceof Error ? (error.stack ?? error.message) : String(error);
}

export function runCli(main) {
  main().catch((error) => {
    console.error(formatCliError(error));
    // exitCode y no process.exit(): exit() puede cortar la salida que aún no
    // se escribió cuando va por un pipe, como en la CI.
    process.exitCode = 1;
  });
}
