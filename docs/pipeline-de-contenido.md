# Pipeline de contenido

Este repositorio no es solo la fuente del sitio: otros clientes (por ejemplo, la
publicación en redes sociales) leen las historias directamente, sin pasar por
mistorias-web. Por eso lo que garantiza que una historia esté bien armada vive
aquí, en la CI de este repositorio, y no en el build del sitio.

Workflow: `.github/workflows/validar-contenido.yml`. Corre en cada PR y en cada
push a `main`, con los pasos en este orden:

| Paso | Comando | Qué valida |
|------|---------|------------|
| Pruebas de los scripts | `npm test` | Que los propios scripts del pipeline funcionan. |
| Estructura de historias | `npm run check:structure` | Que cada historia tiene la sección `## La historia` y no está vacía. |
| Tiempo de lectura | `npm run reading-time -- --check` | Que `readingTimeMinutes` de cada historia coincide con el que se calcula del texto. |

El orden importa: cada paso da por cierto lo que verifica el anterior.

## Correr los pasos en local

```bash
npm test
npm run check:structure                       # todas las historias
npm run check:structure -- stories/<archivo>.md   # solo esa
npm run reading-time -- --check                   # verifica, no escribe
```

## Cómo corregir un fallo

- **`falta la sección "## La historia"`**: el cuerpo tiene que abrir con ese
  encabezado exacto (dos `#`, un espacio). Otros clientes leen esa sección como
  el texto de la historia.
- **`la sección "## La historia" está vacía`**: la sección existe pero no tiene
  texto antes del siguiente `## `.

- **`readingTimeMinutes es ... y debería ser N`**: el texto de `## La historia`
  cambió y el tiempo declarado quedó viejo, o falta el campo. Corrígelo con
  `npm run reading-time -- stories/<archivo>.md`, o con
  `npm run reading-time -- --changed` para todas las historias que git ve
  modificadas. Se calcula a 200 palabras por minuto, redondeado hacia arriba.

La CI no corrige ni hace commits por su cuenta: los commits de este repositorio
van firmados (ver CLAUDE.md §9).

## Actions fijados por commit

Los actions del workflow se referencian por su SHA completo de commit y no por
una etiqueta como `@v4`: una etiqueta se puede mover a otro código, un SHA no.
Al lado va un comentario con la versión que corresponde, para que se lea.

Para actualizar uno, busca el SHA de la versión nueva (por ejemplo
`git ls-remote --tags https://github.com/actions/checkout 'v4*'`; si la etiqueta
es anotada, usa la línea `^{}`, que es la del commit) y cambia SHA y comentario
juntos.

Las convenciones para escribir o cambiar estos scripts (idioma del código, de los
comentarios y de los mensajes) están en
[convenciones-de-scripts.md](convenciones-de-scripts.md).
