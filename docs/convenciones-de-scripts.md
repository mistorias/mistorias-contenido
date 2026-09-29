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
