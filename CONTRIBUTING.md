# Contribuir con una historia

Guía para quien escribe, edita o revisa una historia en este repositorio. Con este
documento basta para armar una historia completa; el detalle técnico de cada regla
(validaciones, build, flujo de git) está en `CLAUDE.md`.

## Antes de escribir

Lee la [guía editorial](https://github.com/mistorias/mistorias-esencia-de-marca/blob/main/guia-editorial.md)
de Mistorias. Es la fuente canónica de posicionamiento, voz, tono y reglas
editoriales — escribir antes de leerla produce texto que hay que rehacer.

## Estructura de una historia

Una historia es **un solo archivo Markdown** en `stories/`, con dos partes: el
frontmatter (los datos entre las dos líneas `---`) y el cuerpo, con cuatro
secciones fijas. Piénsalo como una ficha de biblioteca pegada a la tapa de un
libro: la ficha la lee el sitio para ordenar y mostrar la historia; el libro lo lee
la persona.

### El archivo

`stories/yyyy-mm-dd-palabras-del-titulo.md`. El nombre **es** la dirección pública:
`stories/2026-10-16-dayana-es-la-mejor-en-matematica.md` se publica en
`/historias/2026-10-16-dayana-es-la-mejor-en-matematica/`. La fecha va primero; el
resto acompaña al título. Si el título cambia, el nombre del archivo cambia con él.

La imagen es opcional. Si la hay, va en `stories/<mismo-nombre-sin-.md>/principal.jpg`
y tiene que ser un JPEG real; el README explica cómo convertirla.

### Plantilla

Copia esto, reemplaza lo que está entre comillas y borra las líneas de imagen si
tu historia no lleva:

```markdown
---
title: "Lo que el lector descubre, en 10 a 15 palabras"
summary: "Una sola línea de 70 a 200 caracteres que plantea la situación sin contar el final."
date: "2026-10-23"
author: "tu-slug"
authorship: "escrito-por-persona"
readingTimeMinutes: 1
themes: ["tema-propio", "otro-tema", "un-tercero"]
imageAlt: "Qué se ve en la imagen, para quien no puede verla"
imageCredit: "Quién hizo la imagen"
imageLicense: "CC BY-NC 4.0"
---

## La historia

## Noticias principales

## Conectando los puntos

## Acción final
```

### El frontmatter

| Campo | Qué poner |
|-------|-----------|
| `title` | 10 a 15 palabras. Nombra lo que el lector descubre, no la lista de temas. |
| `summary` | 70 a 200 caracteres, una línea. Es lo único que se ve en la portada y en redes: dice de qué trata **la historia del personaje** (no las noticias ni sus cifras), crea curiosidad y **no cuenta el final**. Lo que insinúa, el cuerpo lo tiene que entregar. Escríbelo al final, con el cuerpo ya terminado. |
| `date` | `yyyy-mm-dd`, la misma fecha del nombre del archivo. |
| `author` | El nombre de tu ficha en `authors/`, sin `.md` (ver [Tu firma](#tu-firma)). |
| `authorship` | `escrito-por-persona`, `editado-con-ia` o `escrito-con-ia` (ver [Tu firma](#tu-firma)). |
| `readingTimeMinutes` | No lo calcules tú: deja cualquier número y corre `npm run reading-time -- stories/<archivo>.md`. |
| `themes` | Entre 3 y 7 (ver [Temas](#temas)). |
| `imageAlt`, `imageCredit`, `imageLicense` | Los tres si hay imagen; ninguno si no la hay. |

Dos errores que rompen la publicación: un valor con `:` sin comillas, y cualquier
HTML (`<...>`), en el frontmatter o en el cuerpo. Los enlaces se escriben
`[texto](https://…)`.

### El cuerpo

La secuencia de marca es **SIENTE → ENTIENDE → ACTÚA**, y la regla de oro de la guía
editorial dice que el contenido falla si informa sin conectar, conecta sin explicar,
o explica sin movilizar. Las cuatro secciones, con esos títulos exactos y en ese
orden:

- `## La historia` — narrativa humana, anclada en una persona concreta (SIENTE).
  Ficción verosímil en el Perú de hoy, donde las noticias de la semana le pasan a
  alguien. Las publicadas tienen entre 400 y 1000 palabras. Es la sección que mide
  el tiempo de lectura, así que su título no puede cambiar.
- `## Noticias principales` — una lista; cada ítem dice qué pasó, **qué significa el
  dato** y de dónde sale, con la fuente enlazada e identificada por lo que es
  (ENTIENDE). Ver [Sobre las fuentes](#sobre-las-fuentes).
- `## Conectando los puntos` — un par de párrafos de contexto y reflexión que unen
  la historia con las noticias, más algo explícito sobre **los límites de los
  datos**: qué no responden todavía.
- `## Acción final` — acciones concretas, en imperativo, diferenciadas por tipo de
  lector (ACTÚA). Invitan a hacer algo en la propia vida; no piden comentar ni
  escribirnos, porque el sitio aún no tiene ese canal.

Toda historia combina al menos 2 de los 3 pilares (historias humanas, datos
explicados, contexto y reflexión); idealmente los 3.

Dos cuidados más al escribir el cuerpo:

- **Nombres nuevos.** Cada personaje inventado estrena su nombre: no repitas uno de
  las historias recientes, o el lector que las lee seguidas creerá que es la misma
  persona. No aplica a personas reales (autoridades, dirigentes).
- **Castellano peruano.** Las noticias de otros países traen palabras que aquí no se
  usan: *carpeta*, no *pupitre*; *sismo*, no *terremoto*; *propón*, no *proponé*.
  Un término técnico se explica entre paréntesis la primera vez.

Para ver todo junto, la
[historia de Dayana](stories/2026-10-16-dayana-es-la-mejor-en-matematica.md) tiene
las cuatro secciones, imagen y todos los campos.

### Sobre las fuentes

Enlázalas y **di qué son**. Un comunicado gremial es parte del conflicto que
reporta; una nota de divulgación no es el informe original. Esa honestidad es el
principio de transparencia aplicado, no un adorno.

Además de qué tipo de fuente es, indica sus **límites y posibles sesgos**: quién la
firma, qué interés directo tiene en el asunto que reporta, y qué preguntas deja sin
responder. Un dato correcto presentado sin ese contexto puede seguir siendo
engañoso.

## Tu firma

Cada historia la firma una persona. No es un formalismo: quien lee tiene que poder
llegar a alguien que responde por lo que acaba de leer, y eso es lo que hace que una
historia se pueda creer.

Por eso, antes de publicar tu primera historia, escribes tu propia ficha —tú, no el
equipo—: tu nombre, una línea que se muestra al pie de tus historias, y una
biografía corta que diga **por qué te importa el tema** y algo de ti como persona.
El formato exacto está en `CLAUDE.md` §8.

Lo que **no** te vamos a pedir: tu correo, tu empleador, tu cargo, tu dirección ni
una foto. No los necesitamos y no los queremos. Si quieres que quien lee pueda
verificar que existes, danos un enlace a un perfil que **ya sea público y que tú
controles** (redes, tu web, la página de tu institución): así puedes borrarlo o
cambiarlo cuando quieras, sin pedirle permiso a nadie.

Y una advertencia que preferimos darte antes y no después: **este repositorio es
público y su historial es permanente**. Podemos quitar tu ficha del sitio en un día,
pero no del historial de Git — lo que ya se publicó se puede haber clonado. Es como
un periódico impreso: se deja de imprimir, no se recogen los ejemplares que ya
circulan. Por eso te pedimos poco. Para pedir que se quite algo, escribe a
`support@mistorias.pe`.

También te vamos a preguntar qué parte del trabajo hizo una inteligencia artificial,
y la historia lo va a decir en su pie. No es una trampa ni resta mérito: se elige una
de tres etiquetas (`escrito-por-persona`, `editado-con-ia`, `escrito-con-ia`) y listo.
Quien firma sigues siendo tú.

## Temas

Entre 3 y 7, apuntando a los puntos más importantes de esa historia en particular.
Reglas de formato y la lista de temas excluidos o de uso excepcional están en
`TEMAS.md`.

## Checklist editorial

- [ ] Leí la guía editorial antes de escribir.
- [ ] Mi ficha existe en `authors/` y la historia la referencia en `author`.
- [ ] Elegí la etiqueta de `authorship` que describe lo que de verdad pasó al
      escribir esta historia.
- [ ] La historia combina al menos 2 de los 3 pilares (narrativa humana, datos
      explicados, contexto y reflexión).
- [ ] Elegí entre 3 y 7 temas propios de esta historia, sin usar los excluidos
      (ver `TEMAS.md`).
- [ ] Cada fuente está enlazada, identificada por lo que es, y con sus límites y
      posibles sesgos explicitados.
- [ ] La acción final ofrece pasos concretos, no una invitación genérica a
      reflexionar.

Para la validación técnica (esquema, build, pipeline de marca, git) ver `CLAUDE.md`.
