# Política de etiquetas

Una etiqueta sirve para que el lector encuentre historias **relacionadas entre sí**.
Si una etiqueta aplica a todo el sitio, no separa nada: ocupa uno de los siete
espacios disponibles sin darle al lector ninguna ruta nueva.

Regla general (ver `CLAUDE.md`, §3): entre 3 y 7 etiquetas por historia, apuntando a
los puntos más importantes de esa historia en particular.

## Excluidas siempre — son la identidad del sitio

Todo Mistorias es esto. Etiquetarlo es repetir el nombre del proyecto.

| Etiqueta | Por qué |
|----------|---------|
| `educacion`, `educativo` | Es el tema del sitio entero. |
| `arequipa` | Es el lugar desde el que mira la marca, presente en toda historia. |
| `peru` | Igual que el anterior, un grado más amplio. |
| `mistorias` | El nombre del proyecto. |
| `historia`, `historias` | El formato de todo lo que se publica. |
| `noticias`, `actualidad`, `semanal` | Describen el formato editorial, no el tema. |
| `datos` | Los datos explicados son uno de los tres pilares: están siempre. |
| `brechas`, `desigualdad` | Es la idea central de la marca; casi ninguna historia queda fuera. |

Estas no tienen excepción: no importa cuán central sea el tema en una historia
puntual, ya está cubierto por ser parte de Mistorias.

## Excepciones — permitidas solo cuando son el eje central

Estas etiquetas sí distinguen unas historias de otras, pero aparecen con tanta
frecuencia que, usadas sin criterio, dejan de servir. Se permiten **únicamente**
cuando la etiqueta nombra el eje central de esa historia — no una mención
incidental ni un personaje de paso.

| Etiqueta | Se usa cuando... | No se usa cuando... |
|----------|-------------------|----------------------|
| `docentes` | La historia trata sobre la condición, las demandas o el rol de los docentes (p. ej. un paro, una reforma salarial, una política de formación docente). | Un profesor aparece como personaje narrativo sin que su condición laboral sea el tema. |
| `estudiantes` | La historia trata sobre la condición de los estudiantes como grupo (p. ej. deserción, acceso, bienestar estudiantil). | Un estudiante es la voz narrativa de la historia, como en la mayoría de las ediciones. |
| `escuela`, `colegio` | La historia distingue lo escolar de otros niveles (universitario, inicial, comunitario) o de otro tipo de infraestructura. | Toda historia ocurre por defecto en un contexto escolar. |
| `america-latina` | La historia conecta explícitamente eventos de varios países de la región, y ese alcance regional es parte del argumento. | Se menciona un solo país fuera de Perú como referencia puntual. |

Antes de usar una de estas cuatro, pregúntate: *si le quito esta etiqueta a la
historia, ¿pierde algo el lector para encontrarla?* Si la respuesta es no, no la
uses.

## Ejemplo aplicado

La historia `2026-08-07-como-se-mueve-la-educacion.md` trata sobre docentes (el paro
argentino), estudiantes (Lucía y sus compañeros) y varios países de la región a la
vez — las tres excepciones aplican legítimamente ahí. Etiquetas propuestas:

```
["junin", "docentes", "estudiantes", "inteligencia-artificial", "america-latina"]
```

Quedan fuera `educacion` y `arequipa` (excluidas siempre) y entra `estudiantes`
porque el eje de la historia no es solo Lucía como narradora sino la condición
estudiantil frente a las cuatro noticias.
