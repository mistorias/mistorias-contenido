---
name: publicar-historia
description: Guía el flujo completo para publicar una nueva historia editorial en este repositorio (mistorias-contenido) — desde recibir el contenido y la fecha del usuario hasta redactar el cuerpo, pasar el pipeline de marca (Jaime → Martha → Javier → Mario) con subagentes, elegir temas, generar el resumen y dejar la historia lista para commit y PR. Úsalo siempre que el usuario pida publicar, redactar, subir o crear una historia nueva en este repo, aunque solo diga "publica esta historia" o pegue una noticia y un borrador sin pedir el proceso explícitamente.
model: opus
---

# Publicar una historia en Mistorias

**CLAUDE.md, CONTRIBUTING.md y TEMAS.md son la fuente de verdad.** Este documento es
solo el orden de pasos y quién ejecuta cada uno. Si algo aquí contradice a esos
archivos, gana el archivo: vuelve a leerlo, puede haber cambiado.

Todo el resultado —historia, commits, PR— va en **castellano peruano**.

## Quién hace qué

Este skill corre en **Opus** y es **Jaime**: redacta y reescribe con el contexto
completo. Las revisiones son subagentes de `.claude/agents/`, cada uno con su modelo.
Pásales **rutas, no el texto** de la historia.

| Fase | Subagente | Modelo |
|------|-----------|--------|
| Nombres ya usados | `revisor-nombres` | Haiku 5.5 |
| 2 · Ortografía | `martha-ortografia` | Haiku 5.5 |
| 3 · Alineación | `javier-alineacion` | Sonnet 5.5 |
| 4 · Brand Gap | `mario-brand-gap` | Sonnet 5.5 |
| Resumen | `generador-resumen` / `verificador-resumen` | Sonnet 5.5 |

Los subagentes **miden y no aprueban**. Los umbrales de Martha, Javier y Mario viven
en la esencia de marca (`agents/*.md`) y cada subagente te los devuelve en
`umbral_leido`: compáralos tú, no los copies de memoria. Los del resumen están en el
paso 6.

## Paso 0 — Pedir lo que falta

No asumas contenido ni fecha. Si no vinieron en el mensaje que invoca este skill,
pide:

1. **El contenido**: borrador, noticias fuente, notas o enlaces, aunque estén
   desordenados.
2. **La fecha de creación**, `yyyy-mm-dd` (frontmatter `date` y prefijo del archivo,
   CLAUDE.md §7). Si dice "hoy" o usa otro formato, conviértela tú.

No sigas sin las dos.

## Paso 1 — Referencia de marca

Si `/workspace/mistorias-esencia-de-marca` no existe, clónalo:

```bash
GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 \
  https://github.com/mistorias/mistorias-esencia-de-marca /workspace/mistorias-esencia-de-marca
```

Lee `guia-editorial.md` completo antes de escribir. Para el paso 4 basta saber que
`agents/orquestador-lineamientos-marca.md` fija el orden y el tope de vueltas.

## Paso 2 — Nombres ya tomados

Lanza **`revisor-nombres`**. Devuelve los nombres de personaje usados en las 10
historias más recientes; ninguno puede repetirse (CLAUDE.md §4). Hojea de paso las 2-3
historias más recientes para calibrar tono y extensión reales.

## Paso 3 — Redactar (Jaime)

Estructura de `CONTRIBUTING.md`: SIENTE → ENTIENDE → ACTÚA, con `## La historia`,
`## Noticias principales`, `## Conectando los puntos` y `## Acción final`. Combina al
menos 2 de los 3 pilares, idealmente los 3.

Cada fuente va enlazada e **identificada por lo que es**, con sus límites y posibles
sesgos. Aplica CLAUDE.md §6. **No hay red de verificación de cifras**: si una fuente
estaba bloqueada, dilo; no presentes como comprobado lo que solo copiaste (§10).

Todavía **no escribas el `summary`** (paso 6).

## Paso 4 — Pipeline de marca (máx. 3 vueltas)

Orden fijo y **secuencial**, sin saltar fases: Martha → Javier → Mario. Lanza cada
subagente con la ruta de la historia y la del clon de esencia.

1. **`martha-ortografia`**. Si `errores` no cumple su `umbral_leido`, no sigas:
   corrige tú (Jaime) y repite desde Martha.
2. **`javier-alineacion`**. Si `puntaje` queda bajo su umbral, reescribe con
   `mejoras_para_jaime` y repite desde Martha (el cuerpo cambió).
3. **`mario-brand-gap`**. Igual que Javier.

Pasa a Jaime el feedback **acumulado** de las vueltas anteriores, no solo el último.
**Máximo 3 reescrituras.** Si a la tercera una fase no pasa, para y dile al usuario
qué fase, qué puntaje y qué mejora no se pudo resolver: la decisión es del equipo.

Este paso va **antes** del resumen a propósito: cualquier cambio posterior en el
cuerpo vence la auditoría del resumen y obliga a repetir el lazo.

## Paso 5 — Frontmatter, temas y nombre de archivo

Contrato exacto en CLAUDE.md §2. Con el cuerpo ya final:

- `title`: 10 a 15 palabras, nombra lo que el lector descubre.
- `date`: la del paso 0.
- `author`: **slug** de una ficha existente en `authors/` (si falta, créala según
  CLAUDE.md §8; sin ficha el build falla).
- `authorship`: según lo que de verdad pasó en **esta** historia (§8.2).
- `themes`: 3 a 7. Lee `TEMAS.md` completo antes de elegir.
- `readingTimeMinutes`: no a mano. Córrelo con el cuerpo terminado y **antes** de
  registrar el resumen:

  ```bash
  npm run reading-time -- stories/<archivo>.md
  ```

- **Nombre de archivo ahora**, antes del primer push: `stories/yyyy-mm-dd-slug.md`
  (§7).

Valores con `:` entre comillas; nada de HTML crudo ni autoenlaces `<https://…>`.

## Paso 6 — Resumen (lazo hasta 80 / 90, máx. 5 vueltas)

El resumen es el único campo que **afirma cosas sobre el texto** y puede ser válido
y falso a la vez; además es la única línea que decide si alguien entra a leer. Ni el
esquema ni las fases del paso 4 lo revisan. Los umbrales viven aquí.

1. **Generar.** Lanza `generador-resumen` sobre `stories/<archivo>.md`. Devuelve el
   texto en un bloque de código; no escribe el archivo.
2. **Evaluar.** Lanza `verificador-resumen` con el texto y el archivo. Devuelve JSON:

   | Puntaje | Umbral |
   |---------|--------|
   | `evaluacion_sintesis` | **≥ 80** |
   | `evaluacion_enganche` | **≥ 90** |

3. **Iterar.** Si algún puntaje queda corto, relanza `generador-resumen` con el
   **historial completo** (cada resumen probado, sus dos puntajes y sus
   `observaciones`), no solo la última vuelta: con solo la última la corrección
   oscila. **Máximo 5 vueltas**; si a la quinta no pasa, el problema suele estar en
   el cuerpo: para y díselo al usuario.
4. **Escribir y registrar**, recién con los dos puntajes en verde:
   1. Verifica **una línea de 70 a 200 caracteres** sin HTML:
      `printf '%s' "<texto>" | LC_ALL=C.UTF-8 wc -m`.
   2. Escríbelo en `summary`, entre comillas.
   3. Registra:

      ```bash
      .claude/scripts/registrar-resumen-verificado.sh stories/<archivo>.md
      ```

El registro firma el hash del archivo entero. Si después tocas resumen, cuerpo o
`readingTimeMinutes`, vence y hay que repetir este paso. El hook `Stop`
(`.claude/scripts/verificar-resumen.sh`) es una red, no el mecanismo: que te
devuelva es señal de que te saltaste este paso.

## Paso 7 — Checklist

Repasa CLAUDE.md §11 contra lo producido: título, resumen y fecha; resumen medido y
registrado; nombre de archivo; `readingTimeMinutes` (`npm run reading-time -- --check`);
nombres sin repetir; pipeline completo con umbrales; fuentes; temas contra `TEMAS.md`.

No valides contra el build ni prepares el commit hasta que el usuario lo pida.

## Paso 8 — Build, git y PR (solo si el usuario lo pide)

- **Esquema y build**: checkout de mistorias-web con el submódulo apuntando a este
  contenido; sigue CLAUDE.md §5.2 y confirma `/historias/<slug>/index.html` en la
  salida.
- **Git y PR**: CLAUDE.md §9 al pie de la letra (Conventional Commits en castellano,
  atómicos, máx. cinco por PR; no desactives la firma GPG; verifica con
  `git log --format='%h %G? %an'`; compara el blob remoto contra el local con `md5sum`).
- Trampa de §10: el submódulo de mistorias-web llega vacío en una sesión fresca;
  escribir ahí no commitea nada.
