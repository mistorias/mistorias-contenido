# mistorias-contenido

Repositorio publico de contenido editorial para [mistorias-web](https://github.com/mistorias/mistorias-web).

## Estructura

- `stories/` — historias en Markdown con frontmatter validado por el sitio.
- `scripts/` — herramientas automatizadas del repositorio
- `docs/` — cómo se validan las historias ([pipeline](docs/pipeline-de-contenido.md)) y las
  convenciones del [frontmatter](docs/convenciones-del-frontmatter.md) y de los
  [scripts](docs/convenciones-de-scripts.md).

## Imagen de una historia

Si una historia lleva imagen, va en `stories/<slug>/principal.jpg`, y tiene que ser
un JPEG **de verdad**: el build de mistorias-web revisa el contenido del archivo, no
la extensión, y falla si le llega un PNG renombrado a `.jpg`.

Las ilustraciones suelen salir en PNG, así que este repositorio trae un script que
las convierte. Solo necesita Node 24; no hace falta clonar mistorias-web.

```bash
npm install                                   # una sola vez
npm run prepare-image -- ~/Descargas/ilustracion.png 2026-10-04-mi-historia
```

- El primer argumento es la imagen de origen; el segundo, el nombre de la historia
  sin `.md`. Si la imagen ya está dentro de `stories/<slug>/` (por ejemplo, un
  `principal.jpg` que en realidad es PNG), el segundo argumento se puede omitir.
- Deja el resultado en `stories/<slug>/principal.jpg`, reduce la imagen si pasa de
  4000 px por lado, rellena la transparencia con el fondo Off-White de la marca y
  verifica que quede por debajo de 5 MB, que son los límites del sitio.
- Si el original quedó dentro de la carpeta de la historia con otro nombre, lo
  borra: la carpeta solo admite `principal.jpg`.

Después, declara `imageAlt`, `imageCredit` e `imageLicense` en el frontmatter.

## Tiempo de lectura

Cada historia declara `readingTimeMinutes` en su frontmatter. No se escribe a mano: lo
calcula un script (palabras de `## La historia` entre 200 por minuto, redondeado hacia
arriba), y la CI verifica en cada PR que el valor declarado coincida.

```bash
npm run reading-time -- --changed            # las historias que git ve nuevas o modificadas
npm run reading-time -- stories/<archivo>.md # solo esa
npm run reading-time -- --check              # verifica todas, sin escribir
```

## Formato básico de una historia

Para adicionar la imagen requiere de otros atributos adicionales.
Ver el esquema completo en el repo de mistorias-web.

```yaml
---
title: "Titulo"
summary: "Resumen breve"
date: "2026-04-26"
author: "Autor"
authorship: "escrito-por-persona"
readingTimeMinutes: 4
themes: ["tag4", "tag2"]
---
Cuerpo en markdown sin HTML crudo.
```
