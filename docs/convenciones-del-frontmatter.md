# Convenciones del frontmatter

Reglas para nombrar y mantener los campos del frontmatter de las historias. El
contrato completo de cada campo (obligatorio o no, límites, formato) está en
[CLAUDE.md §2](../CLAUDE.md); aquí van las reglas que valen para cualquier campo,
también para los que se agreguen después.

## Un atributo con unidad lleva la unidad en el nombre

Si el valor de un campo es una cantidad medida en algo, esa unidad va en el nombre
del campo, en inglés y en `camelCase`, y el valor es solo el número.

| Campo | Unidad | Ejemplo |
|-------|--------|---------|
| `readingTimeMinutes` | minutos | `readingTimeMinutes: 4` |

Y para los que puedan venir: `…Words`, `…Bytes`, `…Px`, `…Seconds`.

**Por qué.** Este repositorio lo leen clientes que no pasan por mistorias-web
(por ejemplo, la publicación en redes sociales). Quien lee el archivo tal cual no
tiene un esquema a la mano que le diga si `readingTime: 4` son minutos, segundos o
páginas, y adivinar mal la unidad no falla: publica un dato equivocado. Con la
unidad en el nombre, el archivo se explica solo.

No se usa texto en el valor (`readingTime: "4 min"`): obligaría a cada cliente a
interpretarlo, y un número es lo único que un esquema puede validar sin ambigüedad.

## Campos derivados: los calcula un script, no una persona

Un campo que se puede calcular del texto de la historia no se escribe a mano. Se
calcula con un script de `scripts/`, y el pipeline de contenido
([pipeline-de-contenido.md](pipeline-de-contenido.md)) verifica en cada PR que el
valor declarado coincide con el calculado. Así el dato es correcto para todos los
clientes, no solo para el sitio.

Hoy hay uno:

- **`readingTimeMinutes`**: `npm run reading-time`. Cuenta las palabras de
  `## La historia`, las divide entre 200 por minuto y redondea hacia arriba, con un
  mínimo de 1.

Dónde se corre en el flujo de publicar una historia: cuando el cuerpo está
terminado y **antes** de registrar la verificación del resumen. Esa verificación
firma el archivo entero, frontmatter incluido, así que si `readingTimeMinutes`
cambia después, la verificación vence y hay que repetirla (ver el skill
`publicar-historia`).

## Agregar un campo nuevo

1. Nómbralo con su unidad si la tiene, según la regla de arriba.
2. Si se puede calcular del texto, escribe el script con las convenciones de
   [convenciones-de-scripts.md](convenciones-de-scripts.md) y agrégalo al
   pipeline, con su verificación.
3. Agrégalo al esquema de mistorias-web (`src/lib/content/schema.ts`), en el mismo
   orden de entrega: primero el contenido con el campo ya en todas las historias,
   después el esquema que lo exige.
4. Documéntalo en CLAUDE.md §2 y, si tiene unidad, en la tabla de este documento.
