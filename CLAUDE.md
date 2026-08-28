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
(`src/lib/content/schema.ts` en mistorias-web) y la parsea con el cargador de
contenido que tenga configurado. Cuál es ese cargador es asunto del sitio y puede
cambiar, así que el frontmatter se escribe en la forma más conservadora que
cualquiera de ellos acepta:

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
| `imageAlt`, `imageCredit`, `imageLicense` | **Opcionales en conjunto**: si la historia tiene carpeta de imagen (`stories/<slug>/principal.jpg`, ver §7), los tres son obligatorios; si no tiene imagen, ninguno debe declararse. El build lo exige así (`story-image-requirements.ts` en mistorias-web) y falla si falta uno de los tres, o si sobra alguno sin imagen. |

Convención de escritura. El cargador de hoy tolera más que esto, pero escribir así
mantiene las historias legibles para cualquier cargador que venga después:

- **Una línea por campo.** Sin valores multilínea, sin listas en bloque (`- item`),
  sin anidamiento.
- Los arreglos se escriben en línea: `["a", "b"]`, separados por comas.

Estas dos sí rompen el build, hoy y con cualquier cargador:

- Si el valor contiene `:`, va **entre comillas**. Sin comillas, el frontmatter no
  parsea y el build falla al sincronizar el contenido.
- **Nada de HTML crudo**, ni en el frontmatter ni en el cuerpo: el sitio rechaza
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

## 4. Nombres de los personajes

**Un nombre propio se usa una sola vez en todo el sitio.** Cada historia estrena a
sus personajes: la niña, la madre, el docente, el vecino. Repetir un nombre entre
ediciones hace que dos personas distintas parezcan la misma —y el lector que llega
por la portada las lee seguidas—, además de volver genérico lo que debería ser
concreto.

Aplica a todo personaje inventado, tenga apellido o no: protagonistas, familia,
docentes, vecinos. **No aplica** a personas reales que aparecen por su cargo o su
declaración en una noticia (autoridades, dirigentes), ni a lugares e instituciones.

Antes de fijar un nombre, revisa cuáles ya están tomados. El skill
`publicar-historia` (`.claude/skills/publicar-historia/SKILL.md`) trae el comando
listo y acota la revisión a las últimas historias publicadas —no a todo
`stories/`— para no forzar nombres poco naturales cuando el fondo se agota;
cuántas exactamente es un detalle que vive en el skill y puede cambiar ahí sin que
esta guía se desactualice.

Si el nombre repetido está en el título, cambia también el nombre del archivo
(ver §6): el título y la dirección pública van juntos.

## 5. Validación antes de publicar

Tres validaciones distintas, las tres obligatorias.

### 5.1 Contra los agentes de marca

Simula el pipeline de `agents/orquestador-lineamientos-marca.md`, en el orden fijo
que define ese archivo: Jaime → Martha → Javier → Mario. No saltes fases ni las
inviertas.

Los umbrales de cada fase (cuántos errores tolera Martha, qué puntaje mínimo piden
Javier y Mario) están en `agents/martha-ortografia-castellano-peru.md`,
`agents/javier-alineacion-marca.md` y `agents/mario-buenas-practicas-marca.md` —
léelos ahí, no los copies aquí: son criterio editorial del equipo y pueden cambiar
sin que este archivo se entere.

Si una fase no pasa su umbral, no sigas: vuelve a Jaime con el feedback acumulado.

### 5.2 Contra el esquema y el build

Desde un checkout de mistorias-web con el submódulo apuntando al contenido:

```bash
pnpm install --frozen-lockfile
pnpm test    # el cargador y el esquema
pnpm build   # confirma que la historia genera su página
```

Verifica en la salida del build que aparece `/historias/<slug>/index.html`. Un
frontmatter inválido o HTML crudo hacen fallar el build, no lo degradan en silencio.

### 5.3 Del resumen: fiel al cuerpo y capaz de invitar a leerlo

Ni el esquema ni el build miran si el `summary` es **cierto**: solo miran que exista,
que sea texto y que no traiga HTML. Un resumen que cuenta una historia distinta a la
del cuerpo pasa las dos validaciones anteriores y se publica igual.

El resumen dice **de qué trata la historia**, no cómo está contada. En particular,
deja fuera el canal por el que el personaje se entera de las noticias (la radio de
la combi, el profesor en el aula): es recurso narrativo del cuerpo, rara vez es el
tema, y al comprimirlo a 30 palabras colapsa varias escenas en un canal único que el
texto no sostiene — que es exactamente cómo se rompió la historia de Lucía.

Y tiene que dar ganas de leer la historia. Es la única línea que ve quien llega a la
portada: un resumen que solo enumera los temas es cierto y no cumple su función. La
curiosidad se genera con lo que la historia sí tiene —**nada de clickbait**: lo que
el resumen insinúa, el cuerpo lo entrega.

Por eso el resumen tiene su propio circuito, con dos subagentes:

- **`generador-resumen`** (`.claude/agents/generador-resumen.md`) lo redacta a partir
  del cuerpo ya terminado y devuelve el texto. No escribe el archivo.
- **`verificador-resumen`** (`.claude/agents/verificador-resumen.md`) mide ese texto
  contra el cuerpo y devuelve un JSON con dos puntajes de 0 a 100:
  `evaluacion_sintesis` (qué tan fielmente sintetiza el contenido; una afirmación no
  soportada lo topa en 60) y `evaluacion_enganche` (curiosidad, concreción, promesa
  que el cuerpo cumple, voz de marca). **No aprueba ni rechaza: solo mide.**

Los umbrales —`evaluacion_sintesis` ≥ **80** y `evaluacion_enganche` ≥ **90**— y el
lazo entre ambos agentes viven en el skill `publicar-historia`: si un puntaje queda
corto, el resumen se vuelve a generar con las observaciones de la evaluación, hasta
cinco vueltas. Si a la quinta no pasa, el problema suele estar en el cuerpo y la
decisión es del equipo.

El hook `Stop` `.claude/scripts/verificar-resumen.sh` cierra el lazo: revisa las
palabras y el formato del resumen, y exige que exista una auditoría vigente para el
contenido actual del archivo. La auditoría se registra con el hash del archivo, así
que **tocar el resumen o el cuerpo la vence** y hay que repetirla.

## 6. Castellano peruano: puntos donde se cae

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

## 7. Nombre de archivo y dirección pública

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
- **Imagen de la historia (opcional).** Si una historia tiene imagen, va en
  `stories/<slug>/principal.jpg` —una carpeta con el mismo nombre exacto del
  archivo `.md`, y ese único nombre de archivo dentro—. No hay otra ubicación
  ni otro nombre válidos: el build de mistorias-web los rechaza (ver §2 para
  las tres claves de frontmatter que acompañan a la imagen, y el
  [ADR 0005](https://github.com/mistorias/mistorias-web/blob/main/docs/adr/0005-imagenes-en-historias.md)
  de mistorias-web para el porqué).

## 8. Flujo de git y PR

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

## 9. Trampas del entorno

- **El submódulo llega vacío.** En una sesión fresca de mistorias-web,
  `content/mistorias-contenido/` existe pero está sin inicializar. Escribir ahí no
  commitea nada: git lo trata como gitlink. Para publicar hay que adjuntar este
  repositorio con permiso de escritura y trabajar sobre su propio checkout.
- **La salida de red está restringida.** Los dominios de las fuentes pueden estar
  bloqueados por el proxy, así que **no asumas que puedes verificar una cifra**. Si no
  pudiste abrir la fuente, dilo explícitamente en el PR y deja la verificación al
  equipo. Nunca presentes como comprobado un dato que solo copiaste.
- **No hay canal para que el lector responda.** El sitio todavía no tiene redes
  sociales activas ni formularios, así que ninguna historia debe pedirle al lector
  o lectora una interacción (comentar, contarnos qué eligió, escribirnos, etc.).
  Los cierres invitan a actuar en su propia vida —la lista "Elige una y hazla esta
  semana"—, no a responderle a Mistorias. Revisa esta regla cuando existan esos
  canales.

## 10. Antes de dar por terminada una historia

Checklist técnico. El checklist editorial (guía leída, pilares, fuentes, etiquetas
elegidas) está en `CONTRIBUTING.md`.

- [ ] Título de 10 a 15 palabras; resumen de máximo 30; fecha `yyyy-mm-dd`.
- [ ] El resumen se generó desde el cuerpo ya terminado, dice de qué trata la
      historia y no por qué canal se entera el personaje, e invita a leerla sin
      prometer nada que el cuerpo no entregue; `verificador-resumen` le dio
      `evaluacion_sintesis` ≥ 80 y `evaluacion_enganche` ≥ 90, con la auditoría
      registrada (§5.3).
- [ ] Nombre de archivo coherente con el título, fijado antes del primer push.
- [ ] Ningún nombre de personaje se repite con historias ya publicadas (§4).
- [ ] Pipeline Jaime → Martha → Javier → Mario, en orden, con los umbrales de
      `agents/martha-*.md`, `agents/javier-*.md` y `agents/mario-*.md`.
- [ ] `pnpm test` y `pnpm build` pasan; la ruta de la historia aparece en el build.
- [ ] Fuentes enlazadas, identificadas por lo que son, con sus límites y posibles
      sesgos explicitados.
- [ ] Si quedaron comentarios de revisión abiertos, están resueltos o dichos uno por uno.
- [ ] El contenido del blob remoto coincide con el que validé.
