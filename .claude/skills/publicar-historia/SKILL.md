---
name: publicar-historia
description: Guía el flujo completo para publicar una nueva historia editorial en este repositorio (mistorias-contenido) — desde recibir el contenido y la fecha del usuario hasta redactar el frontmatter, elegir etiquetas, verificar nombres de personajes, simular el pipeline de agentes de marca (Jaime → Martha → Javier → Mario) y dejar la historia lista para commit y PR. Úsalo siempre que el usuario pida publicar, redactar, subir o crear una historia nueva en este repo, aunque solo diga "publica esta historia" o pegue una noticia y un borrador sin pedir el proceso explícitamente.
---

# Publicar una historia en Mistorias

Este skill no reemplaza las reglas del repo: **CLAUDE.md, CONTRIBUTING.md y TAGS.md
son la fuente de verdad.** Este documento es el orden de pasos para aplicarlas sin
saltarse ninguna. Si algo aquí contradice a esos archivos, gana el archivo — vuelve
a leerlo, puede haber cambiado.

Todo el resultado —historia, commits, PR— se redacta en **castellano peruano**.

## Paso 0 — Pedir lo que falta

No asumas contenido ni fecha. Si el usuario no los dio ya en el mismo mensaje que
invoca este skill, pídele explícitamente:

1. **El contenido de la historia**: el borrador, las noticias fuente, notas o
   enlaces que tenga — lo que sea que traiga, aunque esté desordenado o incompleto.
   No hace falta que venga ya estructurado.
2. **La fecha en que se creó la historia**, en formato `yyyy-mm-dd`. Se usa para el
   frontmatter `date` y el prefijo del nombre de archivo (CLAUDE.md §7). Si el
   usuario da una fecha en otro formato o solo dice "hoy", conviértela tú.

No sigas al paso 1 sin estas dos cosas.

## Paso 1 — Preparar la referencia de marca

Si `/workspace/mistorias-esencia-de-marca` no existe todavía en este entorno,
clónalo:

```bash
GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 \
  https://github.com/mistorias/mistorias-esencia-de-marca /workspace/mistorias-esencia-de-marca
```

Lee `guia-editorial.md` completo antes de escribir una sola línea de la historia:
es la fuente canónica de voz, tono y estructura, y redactar sin haberla leído
produce texto que hay que rehacer. Para el pipeline del paso 6, lee también
`AGENTS.md` y los archivos dentro de `agents/`.

## Paso 2 — Revisar lo ya publicado

Antes de fijar nombres de personajes o etiquetas, mira qué ya existe en `stories/`.
Limita la búsqueda a las **10 historias más recientes** (ordenadas por fecha
descendente, que es lo mismo que ordenar por nombre de archivo porque todos
empiezan con `yyyy-mm-dd`): más atrás que eso, el fondo de nombres peruanos
disponibles se agota rápido y termina forzando nombres poco naturales.

```bash
LC_ALL=C.UTF-8 grep -rhoP '\p{Lu}\p{Ll}+' \
  $(ls /home/user/mistorias-contenido/stories/*.md | sort -r | head -10) | sort -u
```

El `LC_ALL=C.UTF-8` es obligatorio — sin él, grep parte los nombres con tilde
(*Lucía* sale como *Luc*). La lista trae también topónimos e instituciones; lo que
importa es cruzar los **nombres de persona inventados** (protagonistas, familia,
docentes, vecinos). Un nombre propio se usa una sola vez entre esas 10 historias
más recientes (CLAUDE.md §4) — repetirlo hace que dos personas distintas parezcan
la misma. Esto no aplica a personas reales citadas por su cargo, ni a lugares o
instituciones.

De paso, hojea esas mismas 2-3 historias más recientes para calibrar tono y
extensión reales, no solo lo que dice la guía en abstracto.

## Paso 3 — Redactar la historia

Sigue la estructura de `CONTRIBUTING.md`: secuencia SIENTE → ENTIENDE → ACTÚA, con
las secciones `## La historia`, `## Noticias principales`, `## Conectando los
puntos` y `## Acción final`. La historia debe combinar al menos 2 de los 3 pilares
(narrativa humana, datos explicados, contexto y reflexión) — idealmente los 3.

Cada fuente va enlazada y **identificada por lo que es** (comunicado gremial, nota
de divulgación, informe original, etc.), con sus límites y posibles sesgos
explicitados — quién la firma, qué interés tiene, qué deja sin responder.

Aplica el castellano peruano de CLAUDE.md §6 (carpeta no pupitre, sismo no
terremoto, imperativos en tú no en vos, términos técnicos explicados entre
paréntesis la primera vez que aparecen).

**No hay red de verificación de cifras**: si una fuente está bloqueada por el
proxy y no pudiste abrirla, dilo explícitamente — no presentes como comprobado un
dato que solo copiaste (CLAUDE.md §10).

## Paso 4 — Frontmatter, etiquetas y nombre de archivo

Redacta el frontmatter según el contrato exacto de CLAUDE.md §2:

```yaml
---
title: "Título de la historia"
summary: "Resumen de una sola línea"
date: "yyyy-mm-dd"
author: "paolo-carrasco"
authorship: "escrito-con-ia"
tags: ["tag-uno", "tag-dos", "tag-tres"]
---
```

- `title`: 10 a 15 palabras, nombra lo que el lector descubre (no un inventario de
  temas, no un conteo de noticias).
- `summary`: máximo 30 palabras, una sola línea. **No lo redactes tú aquí**: sale del
  lazo del paso 5, a partir del cuerpo ya terminado del paso 3. Deja el campo para
  el final y llénalo con el texto que salga de ese lazo. Escribirlo antes es de donde
  vienen los resúmenes falsos: describen una versión de la historia que ya no es la
  que se publica.
- `date`: la que dio el usuario en el paso 0, formato `yyyy-mm-dd`.
- `author`: el **slug** de una ficha existente en `authors/`, no el nombre de la
  persona. Si la ficha todavía no existe, créala primero siguiendo CLAUDE.md §8;
  un `author` sin ficha rompe el build de mistorias-web.
- `authorship`: `escrito-por-persona`, `editado-con-ia` o `escrito-con-ia`, según
  lo que de verdad pasó al escribir **esta** historia (CLAUDE.md §8.2). No se
  hereda de la historia anterior ni se elige por costumbre.
- `tags`: 3 a 7, minúsculas, sin tildes, separadas por guiones. Antes de elegirlas,
  lee `TAGS.md` completo — tiene una lista de etiquetas **siempre excluidas**
  (`educacion`, `arequipa`, `peru`, `datos`, etc., porque son la identidad del
  sitio entera) y otra de **excepciones** que solo valen cuando son el eje central
  de esa historia puntual, no una mención de paso.
- Cualquier valor con `:` va entre comillas, o el build falla al parsear.
- Nada de HTML crudo ni en el frontmatter ni en el cuerpo — ni siquiera autoenlaces
  `<https://...>`; los enlaces markdown `[texto](url)` sí están bien.

Fija el nombre de archivo **ahora**, antes del primer push: `stories/yyyy-mm-dd-slug.md`,
con la fecha del paso 0 y un slug que acompañe al título. Renombrar después cuesta
dos commits y deja comentarios de revisión apuntando a una ruta que ya no existe
(CLAUDE.md §7).

## Paso 5 — Generar y evaluar el resumen (lazo hasta 80 / 90)

El resumen es el único campo del frontmatter que **afirma cosas sobre el texto**, y
por eso es el único que puede ser válido y falso a la vez: el esquema lo acepta y el
build genera la página aunque el resumen cuente otra historia. Y es, además, la única
línea que decide si alguien entra a leer. Ninguna de las cuatro fases del paso 6
revisa nada de eso — Martha ve ortografía, Javier alineación de marca, Mario buenas
prácticas. Este paso llena ese hueco, con dos subagentes y un lazo entre ellos.

Ninguno de los dos decide nada: **los umbrales viven acá**. `generador-resumen`
escribe, `verificador-resumen` mide, y este paso compara contra los umbrales y decide
si hay otra vuelta.

### 5.1 — Generar

Lanza **`generador-resumen`** (`.claude/agents/generador-resumen.md`) sobre el cuerpo
ya terminado:

> Redacta el resumen de `stories/<archivo>.md` a partir del cuerpo.

Devuelve el texto del resumen en un bloque de código, con su conteo de palabras y el
sustento. **No escribe el archivo**: eso lo haces tú, y recién cuando el lazo cierre.

### 5.2 — Evaluar

Lanza **`verificador-resumen`** (`.claude/agents/verificador-resumen.md`) con el
texto que acaba de salir y el archivo:

> Evalúa este resumen contra el cuerpo de `stories/<archivo>.md`:
> "<el texto del resumen>"

Devuelve un JSON con dos puntajes de 0 a 100 y la evidencia de cada uno:

| Puntaje | Qué mide | Umbral |
|---------|----------|--------|
| `evaluacion_sintesis` | Qué tan fielmente el resumen sintetiza el contenido: cada afirmación ocurre así en el cuerpo, y apunta al eje de la historia. | **≥ 80** |
| `evaluacion_enganche` | Qué tan bien invita a explorar la historia: curiosidad, concreción, promesa que el cuerpo cumple, voz de marca. | **≥ 90** |

El verificador **no aprueba ni rechaza** — solo mide. La comparación contra los
umbrales la haces tú, acá.

### 5.3 — Iterar

Si cualquiera de los dos puntajes queda por debajo de su umbral, vuelve a 5.1 y lanza
`generador-resumen` pasándole **el historial completo de la vuelta actual y todas
las anteriores** — no solo el intento y el JSON más recientes: cada resumen que ya
se probó, sus dos puntajes, y las `observaciones` de esa evaluación. Pasar solo la
última observación no alcanza: el lazo deja de recordar qué ya se probó y qué ya
funcionaba, y una corrección aislada puede arreglar lo que señaló esa vuelta y
deshacer sin darse cuenta un acierto de dos vueltas atrás — la corrección oscila en
vez de converger. Con el historial completo, `generador-resumen` puede combinar lo
que sí funcionó de cada intento anterior en vez de tantear a ciegas.

**Máximo 5 vueltas.** Si a la quinta no llega, para y dile al usuario qué puntaje se
quedó corto y qué observación no se pudo resolver: a esa altura el problema ya no
suele estar en el resumen sino en el cuerpo —una historia sin eje claro no se deja
resumir— y esa decisión es editorial, no tuya.

Los dos puntajes son exigentes a propósito y en direcciones distintas. Síntesis en 80
tolera un matiz a medias, pero el verificador topa en 60 cualquier resumen con una
afirmación no soportada: algo falso no llega al umbral por más bien escrito que esté.
Enganche en 90 deja apenas 10 puntos de margen sobre cuatro criterios, porque un
resumen cierto que nadie lee cumple el esquema y no cumple su función.

### 5.4 — Escribir y registrar

Recién cuando los dos puntajes pasan:

1. Verifica a mano que el texto es **una sola línea de máximo 30 palabras** y sin
   HTML crudo. Los puntajes no miden eso; el hook sí lo bloquea.
2. Escribe el texto en el `summary` del frontmatter, entre comillas.
3. Registra la verificación:

   ```bash
   .claude/scripts/registrar-resumen-verificado.sh stories/<archivo>.md
   ```

El registro guarda el hash del archivo **después** de escribir el resumen: si más
tarde tocas el resumen o el cuerpo, la verificación vence y hay que repetir el paso
completo. No lo esquives editando "solo una palabra" — y no registres antes de
escribir, porque el hash quedaría firmando un archivo que ya cambió.

El hook `Stop` (`.claude/scripts/verificar-resumen.sh`) revisa lo mismo al cerrar la
sesión y bloquea si falta. Es una red, no el mecanismo: llegar al final del trabajo
y que el hook te devuelva es señal de que te saltaste este paso, no de que el hook
esté haciendo su trabajo por ti.

## Paso 6 — Simular el pipeline de agentes de marca

En `/workspace/mistorias-esencia-de-marca/agents/orquestador-lineamientos-marca.md`
está el orden fijo: **Jaime → Martha → Javier → Mario**. Pasa por las cuatro fases,
en ese orden, **sin saltarte ninguna** — tampoco Jaime: aunque es quien redacta y no
tiene un umbral numérico que superar (ver abajo), su paso es igual de obligatorio
que los de control de calidad, porque es la fase donde se produce el borrador que
las otras tres van a auditar.

Jaime no aparece en la lista de umbrales porque su rol no es evaluar contra un
criterio de aprobado/reprobado: es quien escribe o reescribe la historia, con la
guía editorial como referencia. El umbral llega después, con quien sí audita ese
trabajo: los umbrales de cada fase de control (errores que tolera Martha, puntaje
mínimo de Javier y Mario) están en sus respectivos archivos
(`martha-ortografia-castellano-peru.md`, `javier-alineacion-marca.md`,
`mario-buenas-practicas-marca.md`) — léelos ahí en el momento, no los repitas de
memoria: son criterio editorial del equipo y pueden cambiar sin que este skill se
entere.

Simula cada fase sobre el borrador real. Si una fase de control no pasa su umbral,
no avances — vuelve a Jaime con el feedback acumulado y reescribe antes de seguir.

## Paso 7 — Antes de dar la historia por lista

Repasa el checklist de CLAUDE.md §11 contra lo que acabas de producir:

- [ ] Título 10-15 palabras; resumen ≤30 palabras; fecha `yyyy-mm-dd`.
- [ ] Resumen generado por `generador-resumen` desde el cuerpo terminado y medido por
      `verificador-resumen` en `evaluacion_sintesis` ≥ 80 y `evaluacion_enganche` ≥ 90,
      ya escrito en el frontmatter y registrado (paso 5).
- [ ] Nombre de archivo coherente con el título, ya fijado.
- [ ] Ningún nombre de personaje inventado se repite con las 10 historias más
      recientes (paso 2).
- [ ] Pipeline Jaime → Martha → Javier → Mario completo, en orden, con umbrales.
- [ ] Fuentes enlazadas, identificadas por lo que son, con límites y sesgos.
- [ ] Etiquetas (3-7) revisadas contra `TAGS.md`.

Todavía no valides contra el build de mistorias-web ni prepares el commit — eso es
el paso 8, y solo si el usuario lo pide.

## Paso 8 — Build, git y PR (solo si el usuario lo pide)

Esto **no** es automático al terminar de escribir: pregunta o espera a que el
usuario confirme que quiere seguir hasta acá.

- **Validación contra el esquema y el build**: requiere un checkout de
  mistorias-web con el submódulo apuntando a este contenido. Sigue CLAUDE.md §5.2
  (`pnpm install --frozen-lockfile`, `pnpm test`, `pnpm build`, y confirmar que
  aparece `/historias/<slug>/index.html` en la salida).
- **Git y PR**: sigue CLAUDE.md §9 al pie de la letra — Conventional Commits en
  castellano describiendo el estado resultante (no lo que hiciste), atómicos,
  máximo cinco por PR. No desactives la firma GPG. Verifica con
  `git log --format='%h %G? %an'` que el commit quedó firmado, y compara el blob
  remoto contra el local (`git show FETCH_HEAD:stories/<archivo>.md | md5sum` vs.
  `md5sum stories/<archivo>.md`) antes de dar el push por bueno.
- Recuerda la trampa de CLAUDE.md §10: el submódulo de mistorias-web llega vacío en
  una sesión fresca — escribir ahí no commitea nada.
