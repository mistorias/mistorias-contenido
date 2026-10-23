# Contribuir con una historia

Guía para quien escribe, edita o revisa una historia en Mistorias. Con este
documento basta para armar una historia completa, sin conocimientos técnicos.

## Antes de escribir

Lee la [guía editorial](https://github.com/mistorias/mistorias-esencia-de-marca/blob/main/guia-editorial.md)
de Mistorias. Es la fuente canónica de posicionamiento, voz, tono y reglas
editoriales — escribir antes de leerla produce texto que hay que rehacer.

## Estructura de una historia

Una historia es **un solo archivo de texto** con dos partes: la **cabecera** y el
**cuerpo**. Piénsalo como una carta dentro de su sobre. El sobre lleva los datos
—título, fecha, quién la manda— y lo lee el sitio para ordenar y mostrar la
historia; la carta es la historia que lee la persona.

### El nombre del archivo

Fecha, guion y unas palabras del título, todo en minúsculas, sin tildes y con
guiones en lugar de espacios: `2026-10-16-dayana-es-la-mejor-en-matematica.md`.
Ese nombre se convierte en la dirección de la historia en la web
(`/historias/2026-10-16-dayana-es-la-mejor-en-matematica/`), así que si el título
cambia, el nombre cambia con él. Las historias se guardan en la carpeta `stories/`.

La imagen es opcional. Si la hay, va en formato JPG, en una carpeta con el mismo
nombre de la historia (sin el `.md` final) y con el nombre `principal.jpg`.

### Plantilla

Copia esto, cambia el texto que está entre comillas y borra las tres últimas líneas
de la cabecera si tu historia no lleva imagen. Las palabras antes de los dos puntos
(`title`, `summary`…) son etiquetas que el sitio necesita escritas tal cual, en
inglés: no las traduzcas ni las cambies.

```markdown
---
title: "Lo que el lector descubre, en 10 a 15 palabras"
summary: "Una sola línea de 70 a 200 caracteres que plantea la situación sin contar el final."
date: "2026-10-23"
author: "tu-nombre"
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

### La cabecera

Es todo lo que va entre las dos líneas `---`, un dato por línea:

| Etiqueta | Qué poner |
|----------|-----------|
| `title` | El título: 10 a 15 palabras. Nombra lo que el lector descubre, no la lista de temas. |
| `summary` | El resumen: 70 a 200 caracteres, en una sola línea. Ver [El resumen](#el-resumen). |
| `date` | La fecha, en el orden año-mes-día (`2026-10-23`), la misma del nombre del archivo. |
| `author` | Tu nombre en minúsculas, sin tildes y con guiones, igual que en tu ficha de autor: `paolo-carrasco` (ver [Tu firma](#tu-firma)). |
| `authorship` | Qué hizo la inteligencia artificial en esta historia: `escrito-por-persona`, `editado-con-ia` o `escrito-con-ia` (ver [Tu firma](#tu-firma)). |
| `readingTimeMinutes` | Los minutos de lectura. Déjalo en `1`: nosotros lo calculamos. |
| `themes` | Los temas, entre 3 y 7 (ver [Temas](#temas)). |
| `imageAlt` | Si hay imagen: qué se ve en ella, para quien no puede verla. |
| `imageCredit` | Si hay imagen: quién la hizo. |
| `imageLicense` | Si hay imagen: con qué licencia se puede usar. |

Dos cuidados de escritura, porque si no se cumplen la historia no se puede
publicar:

- Cada dato va **entre comillas**, sobre todo si lleva dos puntos (`:`).
- Nada de código de páginas web —texto entre `<` y `>`—, ni en la cabecera ni en el
  cuerpo. Para enlazar una fuente escribe `[texto que se ve](https://dirección)`.

### El resumen

Es lo único que se ve de la historia en la portada, y es también el texto que se
publica en redes para invitar a leerla. Por eso:

- Dice de qué trata **la historia del personaje**, no las noticias ni sus cifras.
- Despierta curiosidad y **no cuenta el final**.
- Lo que insinúa, el cuerpo lo tiene que entregar.
- Se escribe al final, con el cuerpo ya terminado.

Antes de publicar, revisamos cada resumen con agentes de inteligencia artificial
que miden si es fiel a la historia y si invita a leerla. Si el tuyo no llega a
nuestro estándar, podemos proponerte otro que sí llegue. Y si no sabes qué poner,
déjalo vacío (`summary: ""`): nosotros lo completamos.

### El cuerpo

La secuencia de marca es **SIENTE → ENTIENDE → ACTÚA**, y la regla de oro de la guía
editorial dice que el contenido falla si informa sin conectar, conecta sin explicar,
o explica sin movilizar. El cuerpo tiene cuatro secciones, en este orden. Cada una
empieza con su título precedido de `## `, escrito exactamente así:

- `## La historia` — narrativa humana, anclada en una persona concreta (SIENTE).
  Ficción verosímil en el Perú de hoy, donde las noticias de la semana le pasan a
  alguien. Las publicadas tienen entre 400 y 1000 palabras. Con esta sección se
  calcula el tiempo de lectura, así que su título no puede cambiar.
- `## Noticias principales` — una lista; cada punto empieza con `- ` y dice qué
  pasó, **qué significa el dato** y de dónde sale, con la fuente enlazada e
  identificada por lo que es (ENTIENDE). Ver [Sobre las fuentes](#sobre-las-fuentes).
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
las cuatro secciones, imagen y todos los datos de la cabecera.

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
El equipo te ayuda a darle el formato.

Lo que **no** te vamos a pedir: tu correo, tu empleador, tu cargo, tu dirección ni
una foto. No los necesitamos y no los queremos. Si quieres que quien lee pueda
verificar que existes, danos un enlace a un perfil que **ya sea público y que tú
controles** (redes, tu web, la página de tu institución): así puedes borrarlo o
cambiarlo cuando quieras, sin pedirle permiso a nadie.

Y una advertencia que preferimos darte antes y no después: **este proyecto es
público y su historial de cambios es permanente**. Podemos quitar tu ficha del sitio en un día,
pero no de ese historial — lo que ya se publicó se puede haber copiado. Es como
un periódico impreso: se deja de imprimir, no se recogen los ejemplares que ya
circulan. Por eso te pedimos poco. Para pedir que se quite algo, escribe a
`support@mistorias.pe`.

También te vamos a preguntar qué parte del trabajo hizo una inteligencia artificial,
y la historia lo va a decir en su pie. No es una trampa ni resta mérito: se elige una
de tres etiquetas (`escrito-por-persona`, `editado-con-ia`, `escrito-con-ia`) y listo.
Quien firma sigues siendo tú.

## Temas

Entre 3 y 7, apuntando a los puntos más importantes de esa historia en particular.
Se escriben en minúsculas, sin tildes y con guiones en lugar de espacios
(`inteligencia-artificial`). La lista de temas que no se usan, o solo como
excepción, está en `TEMAS.md`.

## Checklist editorial

- [ ] Leí la guía editorial antes de escribir.
- [ ] Mi ficha de autor existe y la historia la nombra en `author`.
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

Las comprobaciones técnicas que hacemos antes de publicar están descritas en
`CLAUDE.md`, para quien quiera el detalle; no necesitas leerlas para contribuir.
