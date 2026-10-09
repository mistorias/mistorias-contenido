# Política de temas

Un tema sirve para que el lector encuentre historias **relacionadas entre sí**.
Si un tema aplica a todo el sitio, no separa nada: ocupa uno de los siete
espacios disponibles sin darle al lector ninguna ruta nueva.

Regla general (ver `CLAUDE.md`, §3): entre 3 y 7 temas por historia, apuntando a
los puntos más importantes de esa historia en particular.

## Excluidas siempre — son la identidad del sitio

Todo Mistorias es esto. Ponerlo como tema es repetir el nombre del proyecto.

| Tema | Por qué |
|----------|---------|
| `educacion`, `educativo` | Es el tema del sitio entero. |
| `peru` | Es el alcance de Mistorias: todas las historias son del Perú. |
| `mistorias` | El nombre del proyecto. |
| `historia`, `historias` | El formato de todo lo que se publica. |
| `noticias`, `actualidad`, `semanal` | Describen el formato editorial, no el tema. |
| `datos` | Los datos explicados son uno de los tres pilares: están siempre. |
| `brechas`, `desigualdad` | Es la idea central de la marca; casi ninguna historia queda fuera. |

Estas no tienen excepción: no importa cuán central sea el tema en una historia
puntual, ya está cubierto por ser parte de Mistorias.

## Lugares — un tema cuando la historia los menciona

Mistorias mira todo el Perú, así que un lugar sí distingue unas historias de
otras. Desde que el alcance dejó de ser solo Arequipa, `arequipa` es un tema
como `piura` o `junin`: se usa en toda historia que la mencione, sea porque
ocurre allí o porque la nombra como referencia, y no en las que no la nombran.
Lo mismo vale para cualquier otra región, provincia o ciudad.

## Excepciones — permitidas solo cuando son el eje central

Estos temas sí distinguen unas historias de otras, pero aparecen con tanta
frecuencia que, usados sin criterio, dejan de servir. Se permiten **únicamente**
cuando el tema nombra el eje central de esa historia — no una mención
incidental ni un personaje de paso.

| Tema | Se usa cuando... | No se usa cuando... |
|----------|-------------------|----------------------|
| `docentes` | La historia trata sobre la condición, las demandas o el rol de los docentes (p. ej. un paro, una reforma salarial, una política de formación docente). | Un profesor aparece como personaje narrativo sin que su condición laboral sea el tema. |
| `estudiantes` | La historia trata sobre la condición de los estudiantes como grupo (p. ej. deserción, acceso, bienestar estudiantil). | Un estudiante es la voz narrativa de la historia, como en la mayoría de las ediciones. |
| `escuela`, `colegio` | La historia distingue lo escolar de otros niveles (universitario, inicial, comunitario) o de otro tipo de infraestructura. | Toda historia ocurre por defecto en un contexto escolar. |
| `america-latina` | La historia conecta explícitamente eventos de varios países de la región, y ese alcance regional es parte del argumento. | Se menciona un solo país fuera de Perú como referencia puntual. |

Antes de usar uno de estos cuatro, pregúntate: *si le quito este tema a la
historia, ¿pierde algo el lector para encontrarla?* Si la respuesta es no, no lo
uses.

## Ejemplo aplicado

La historia `2026-08-07-como-se-mueve-la-educacion.md` trata sobre docentes (el paro
argentino), estudiantes (Lucía y sus compañeros) y varios países de la región a la
vez — las tres excepciones aplican legítimamente ahí. Temas propuestos:

```
["junin", "arequipa", "docentes", "estudiantes", "inteligencia-artificial", "america-latina"]
```

Queda fuera `educacion` (excluida siempre) y entra `estudiantes`
porque el eje de la historia no es solo Lucía como narradora sino la condición
estudiantil frente a las cuatro noticias.
