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

## Etiquetas

Entre 3 y 7, apuntando a los puntos más importantes de esa historia en particular.
Reglas de formato y la lista de etiquetas excluidas o de uso excepcional están en
`TAGS.md`.

## Checklist editorial

- [ ] Leí la guía editorial antes de escribir.
- [ ] La historia combina al menos 2 de los 3 pilares (narrativa humana, datos
      explicados, contexto y reflexión).
- [ ] Elegí entre 3 y 7 etiquetas propias de esta historia, sin usar las excluidas
      (ver `TAGS.md`).
- [ ] Cada fuente está enlazada, identificada por lo que es, y con sus límites y
      posibles sesgos explicitados.
- [ ] La acción final ofrece pasos concretos, no una invitación genérica a
      reflexionar.

Para la validación técnica (esquema, build, pipeline de marca, git) ver `CLAUDE.md`.
