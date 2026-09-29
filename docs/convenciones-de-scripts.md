# Convenciones de los scripts

Aplica a todo lo que vive en `scripts/` y a los scripts de `package.json`. Es la
misma regla de idioma que sigue mistorias-web.

## Idioma

| Va en inglés | Va en castellano |
|--------------|------------------|
| Identificadores: funciones, variables, constantes, parámetros. | Comentarios y docstrings. |
| Nombres de archivo (`story-structure.mjs`). | Mensajes al usuario: salida, errores, ayuda. |
| Nombres de los scripts de npm (`check:structure`). | Documentación y descripciones de tests. |
| Flags del CLI (`--changed`, `--check`). | Mensajes de commit y descripciones de PR. |

Los **valores del dominio editorial** se quedan en castellano aunque aparezcan
dentro del código: `## La historia`, los valores de `authorship`
(`escrito-con-ia`) y los nombres de las secciones. Son contenido de las
historias, no código, y cambiarlos cambiaría las historias.

## Por qué

Quien lee el código tiene que poder buscarlo, y el código de este ecosistema (la
web, las herramientas) ya está en inglés. Los textos que lee una persona del
equipo o quien colabora —comentarios, mensajes, docs— se escriben en el
castellano peruano del resto del repositorio.

## Estructura de un script de línea de comandos

Todo script que se ejecuta con `node` o `npm run` sigue el mismo patrón:

```js
import { runCli, UserError } from "./lib/run-cli.mjs";

async function main() {
  // ...la lógica del script; ante un problema que quien ejecuta puede
  // corregir, lanza un UserError con el mensaje en castellano.
  throw new UserError("falta el archivo de origen");
}

runCli(main);
```

- **Un solo punto de salida.** `runCli` es el único lugar que convierte un error
  en salida y en código de salida (1). Los scripts no llaman a `process.exit`.
- **Las funciones de `scripts/lib/` solo lanzan `throw`.** Nunca terminan el
  proceso: así se prueban con `node --test` sin matar al test.
- **`UserError` es lo esperado; el resto es un bug.** Un archivo que falta, una
  historia mal armada o una opción inválida se lanzan como `UserError` y se
  muestran solo con su mensaje (`ERROR: ...`). Cualquier otro error se muestra con
  su stack, para que un bug del script no quede escondido detrás de un mensaje.
- **Se usa `process.exitCode`, no `process.exit()`.** `exit()` puede cortar la
  salida que aún no se escribió cuando va por un pipe, como en la CI.
- **Varios errores, un solo fallo.** Si el script revisa muchos archivos, junta
  los errores y lanza un único `UserError` al final, para que quien ejecuta vea
  todo lo que hay que corregir de una vez.

## Pruebas

- Las funciones de `scripts/lib/` se prueban directamente, en `*.test.mjs` junto
  al módulo.
- Un script de línea de comandos se prueba ejecutándolo en un proceso aparte, con
  `cwd` en un repositorio de mentira, y comprobando código de salida y mensajes
  (ver `scripts/reading-time.test.mjs`). Nunca sobre las historias reales.
