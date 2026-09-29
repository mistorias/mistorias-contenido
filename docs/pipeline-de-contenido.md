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
| Estructura de historias | `npm run verificar:estructura` | Que cada historia tiene la sección `## La historia` y no está vacía. |

El orden importa: cada paso da por cierto lo que verifica el anterior.

## Correr los pasos en local

```bash
npm test
npm run verificar:estructura                       # todas las historias
npm run verificar:estructura -- stories/<archivo>.md   # solo esa
```

## Cómo corregir un fallo

- **`falta la sección "## La historia"`**: el cuerpo tiene que abrir con ese
  encabezado exacto (dos `#`, un espacio). Otros clientes leen esa sección como
  el texto de la historia.
- **`la sección "## La historia" está vacía`**: la sección existe pero no tiene
  texto antes del siguiente `## `.

La CI no corrige ni hace commits por su cuenta: los commits de este repositorio
van firmados (ver CLAUDE.md §9).
