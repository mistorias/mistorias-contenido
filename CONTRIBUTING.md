# Contribuir con una historia

Guía para quien escribe, edita o revisa una historia en este repositorio. Si buscas
las reglas técnicas del frontmatter o el flujo de git, están en `CLAUDE.md`; aquí va
el proceso editorial.

## Antes de escribir

Lee la [guía editorial](https://github.com/mistorias/mistorias-esencia-de-marca/blob/main/guia-editorial.md)
de Mistorias. Es la fuente canónica de posicionamiento, voz, tono y reglas
editoriales — escribir antes de leerla produce texto que hay que rehacer.

## Estructura de una historia

La secuencia de marca es **SIENTE → ENTIENDE → ACTÚA**, y la regla de oro de la guía
editorial dice que el contenido falla si informa sin conectar, conecta sin explicar,
o explica sin movilizar. La estructura que viene funcionando:

- `## La historia` — narrativa humana, anclada en una persona concreta (SIENTE).
- `## Noticias principales` — cada ítem dice qué pasó, **qué significa el dato** y de
  dónde sale, con la fuente enlazada e identificada por lo que es (ENTIENDE).
- `## Conectando los puntos` — contexto y reflexión, más un párrafo explícito sobre
  **los límites de los datos**: qué no responden todavía.
- `## Acción final` — acciones concretas, en imperativo, diferenciadas por tipo de
  lector (ACTÚA).

Toda historia combina al menos 2 de los 3 pilares (historias humanas, datos
explicados, contexto y reflexión); idealmente los 3.

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

## Etiquetas

Entre 3 y 7, apuntando a los puntos más importantes de esa historia en particular.
Reglas de formato y la lista de etiquetas excluidas o de uso excepcional están en
`TAGS.md`.

## Checklist editorial

- [ ] Leí la guía editorial antes de escribir.
- [ ] Mi ficha existe en `authors/` y la historia la referencia en `author`.
- [ ] Elegí la etiqueta de `authorship` que describe lo que de verdad pasó al
      escribir esta historia.
- [ ] La historia combina al menos 2 de los 3 pilares (narrativa humana, datos
      explicados, contexto y reflexión).
- [ ] Elegí entre 3 y 7 etiquetas propias de esta historia, sin usar las excluidas
      (ver `TAGS.md`).
- [ ] Cada fuente está enlazada, identificada por lo que es, y con sus límites y
      posibles sesgos explicitados.
- [ ] La acción final ofrece pasos concretos, no una invitación genérica a
      reflexionar.

Para la validación técnica (esquema, build, pipeline de marca, git) ver `CLAUDE.md`.
