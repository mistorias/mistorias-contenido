# CLAUDE.md — Creación de contenido editorial en Mistorias

Guía operativa para asistentes que redactan, revisan o publican historias en este
repositorio. El contenido editorial vive aquí; el sitio que lo consume vive en
[mistorias-web](https://github.com/mistorias/mistorias-web); los criterios de marca
viven en [mistorias-esencia-de-marca](https://github.com/mistorias/mistorias-esencia-de-marca).

Todo el trabajo —historias, mensajes de commit, descripciones de PR y comentarios de
revisión— se redacta en **castellano peruano**.

## 1. Antes de escribir

Clona y lee la esencia de marca. No es opcional ni posterior: es la fuente canónica
de posicionamiento, voz, tono y reglas editoriales, y redactar antes de leerla
produce texto que hay que rehacer.

```bash
GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 \
  https://github.com/mistorias/mistorias-esencia-de-marca /workspace/mistorias-esencia-de-marca
```

Lee al menos `guia-editorial.md`. Para el pipeline de validación, además
`AGENTS.md` y `agents/`.

## 2. Contrato del frontmatter

El sitio valida cada historia contra `storySchema`
(`src/lib/content/schema.ts` en mistorias-web) y la parsea con un lector propio
(`src/lib/content/content-loader.ts`), no con gray-matter. Eso impone límites que
YAML normal no tiene:

```yaml
---
title: "Título de la historia"
summary: "Resumen de una sola línea"
date: "2026-08-07"
author: "Equipo Mistorias"
tags: ["tag-uno", "tag-dos", "tag-tres"]
---
```

| Campo | Regla |
|-------|-------|
| `title` | Obligatorio. **10 a 15 palabras.** Nombra lo que el lector descubre, no un inventario de temas. Sin contar cuántas noticias hay. |
| `summary` | Obligatorio. **Máximo 30 palabras**, una sola línea. |
| `date` | Obligatorio, formato **`yyyy-mm-dd`**. Se convierte con `z.coerce.date()`; el orden de la portada es por fecha descendente. |
| `author` | Obligatorio, texto no vacío. |
| `tags` | **Mínimo 3, máximo 7.** Ver §3. |

Restricciones del parser, que rompen el build si se ignoran:

- **Una línea por campo.** No hay valores multilínea, ni listas en bloque (`- item`), ni anidamiento.
- El valor empieza después del **primer** `:`; si el texto contiene `:`, va entre comillas.
- Los arreglos se escriben en línea: `["a", "b"]`, separados por comas.
- **Nada de HTML crudo**, ni en el frontmatter ni en el cuerpo: `assertNoRawHtml` rechaza
  cualquier `<...>` y falla el build. Los enlaces markdown `[texto](url)` están bien;
  los autoenlaces `<https://…>` **no**.

## 3. Etiquetas

Entre 3 y 7, en minúsculas, sin tildes, separadas por guiones
(`inteligencia-artificial`, no `Inteligencia Artificial`).

Deben apuntar a **los puntos más importantes de esa historia en particular**: lo que
distingue a esta pieza de las demás. Una etiqueta que sirve para cualquier historia
del sitio no aporta nada al lector que navega.

Por eso hay etiquetas que no se usan nunca, porque ya son parte de la identidad del
sitio, y otras que solo se permiten como excepción cuando son el eje central de la
historia: ver `TAGS.md`.

La estructura editorial de una historia (secciones, pilares, cómo tratar las
fuentes) vive en `CONTRIBUTING.md`, no aquí.

## 4. Validación antes de publicar

Dos validaciones distintas, ambas obligatorias.

### 4.1 Contra los agentes de marca

Simula el pipeline de `agents/orquestador-lineamientos-marca.md`, en el orden fijo
que define ese archivo: Jaime → Martha → Javier → Mario. No saltes fases ni las
inviertas.

Los umbrales de cada fase (cuántos errores tolera Martha, qué puntaje mínimo piden
Javier y Mario) están en `agents/martha-ortografia-castellano-peru.md`,
`agents/javier-alineacion-marca.md` y `agents/mario-buenas-practicas-marca.md` —
léelos ahí, no los copies aquí: son criterio editorial del equipo y pueden cambiar
sin que este archivo se entere.

Si una fase no pasa su umbral, no sigas: vuelve a Jaime con el feedback acumulado.

### 4.2 Contra el esquema y el build

Desde un checkout de mistorias-web con el submódulo apuntando al contenido:

```bash
pnpm install --frozen-lockfile
pnpm test    # el cargador y el esquema
pnpm build   # confirma que la historia genera su página
```

Verifica en la salida del build que aparece `/historias/<slug>/index.html`. Un
frontmatter inválido o HTML crudo hacen fallar el build, no lo degradan en silencio.

## 5. Castellano peruano: puntos donde se cae

Las noticias fuente suelen ser de otros países y arrastran léxico que en Perú no se
usa. Revisa siempre:

| No | Sí |
|----|----|
| pupitre, banco (de aula) | **carpeta** |
| paritaria | **acuerdo salarial** — o el término, con su significado entre paréntesis |
| voseo en imperativos (*propone*, *usá*, *tené*) | **propón, usa, ten** |
| terremoto | **sismo** |

Cuando un término técnico o extranjero sea necesario, explícalo en 3-4 palabras entre
paréntesis la primera vez. Lo mismo con palabras que nombran objetos poco familiares
(*"aulas tipo 'domo'"*): entrecomíllalas la primera vez que aparecen.

## 6. Nombre de archivo y dirección pública

El nombre del archivo **es** la dirección de la historia:
`stories/2026-08-07-como-se-mueve-la-educacion.md` → `/historias/2026-08-07-como-se-mueve-la-educacion/`.

- La carpeta del repositorio se llama `stories/`, pero la sección pública es
  `historias/`: el sitio arma la ruta con `rutaHistoria` (`src/lib/rutas.ts` en
  mistorias-web) y el nombre de la sección no sale del nombre de la carpeta.
- Prefijo de fecha `yyyy-mm-dd` para evitar colisiones entre ediciones.
- El resto del nombre debe acompañar al título; si el título cambia, el archivo cambia.
- **Fija el nombre antes del primer push.** Renombrar después cuesta dos commits
  (la API de GitHub no mueve archivos) y deja los comentarios de revisión
  apuntando a una ruta que ya no existe.

## 7. Flujo de git y PR

Reglas completas en `agents/desarrollo-commits-prs.md` de la esencia de marca. Lo
esencial:

- **Commits**: Conventional Commits, en castellano, describiendo **en qué estado
  queda el proyecto** tras el cambio, no lo que hizo la persona. Atómicos. Máximo
  cinco por PR; si hay más, sugiere squash.
- **PR**: título y descripción en castellano; resumen de dos líneas que cubra todo lo
  relevante; sin inventario de archivos por defecto. Si la revisión hace que el
  alcance cambie —se agregan, quitan o renombran archivos—, actualiza título y
  descripción en el mismo momento: no quedan sincronizados solos.
- **Firma GPG**: no se desactiva. Si el entorno tiene `commit.gpgsign=true` sin llave
  disponible, `git commit` falla — y empujar por la API de GitHub **no** resuelve la
  firma: esos commits quedan **sin firmar** y atribuidos a la identidad dueña del
  token, no a quien redactó. Verifícalo con `git log --format='%h %G? %an'` en lugar
  de asumirlo. Si el equipo necesita firma real, los commits se rehacen localmente
  con una llave del equipo.

Verifica siempre que lo empujado es lo que validaste:

```bash
git show FETCH_HEAD:stories/<archivo>.md | md5sum
md5sum stories/<archivo>.md
```

## 8. Trampas del entorno

- **El submódulo llega vacío.** En una sesión fresca de mistorias-web,
  `content/mistorias-contenido/` existe pero está sin inicializar. Escribir ahí no
  commitea nada: git lo trata como gitlink. Para publicar hay que adjuntar este
  repositorio con permiso de escritura y trabajar sobre su propio checkout.
- **La salida de red está restringida.** Los dominios de las fuentes pueden estar
  bloqueados por el proxy, así que **no asumas que puedes verificar una cifra**. Si no
  pudiste abrir la fuente, dilo explícitamente en el PR y deja la verificación al
  equipo. Nunca presentes como comprobado un dato que solo copiaste.

## 9. Antes de dar por terminada una historia

Checklist técnico. El checklist editorial (guía leída, pilares, fuentes, etiquetas
elegidas) está en `CONTRIBUTING.md`.

- [ ] Título de 10 a 15 palabras; resumen de máximo 30; fecha `yyyy-mm-dd`.
- [ ] Nombre de archivo coherente con el título, fijado antes del primer push.
- [ ] Pipeline Jaime → Martha → Javier → Mario, en orden, con los umbrales de
      `agents/martha-*.md`, `agents/javier-*.md` y `agents/mario-*.md`.
- [ ] `pnpm test` y `pnpm build` pasan; la ruta de la historia aparece en el build.
- [ ] Fuentes enlazadas, identificadas por lo que son, con sus límites y posibles
      sesgos explicitados.
- [ ] Si quedaron comentarios de revisión abiertos, están resueltos o dichos uno por uno.
- [ ] El contenido del blob remoto coincide con el que validé.
