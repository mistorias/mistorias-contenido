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

Copia la [plantilla de historia](plantillas/historia.md), guárdala con el nombre
que explicamos arriba y reemplaza el texto de ejemplo. Dentro encontrarás, en cada
campo y en cada sección, las instrucciones detalladas: tenla abierta mientras
escribes y borra esas instrucciones al terminar.

### La cabecera

Es lo que va entre las dos líneas `---`, un dato por línea. Las palabras antes de
los dos puntos (`title`, `summary`…) son etiquetas que el sitio necesita escritas
tal cual, en inglés: no las traduzcas ni las cambies. Lo que debes saber:

- **Título y resumen.** El resumen es lo único que se ve de la historia en la
  portada y en redes, así que se escribe al final, con el cuerpo terminado. Antes de
  publicar lo revisamos con agentes de inteligencia artificial que miden si es fiel
  a la historia y si invita a leerla; si no llega a nuestro estándar, podemos
  proponerte otro. Y si no sabes qué poner, déjalo vacío (`summary: ""`): nosotros
  lo completamos.
- **Fecha y autor.** La fecha va en el orden año-mes-día y es la del nombre del
  archivo. El autor es el nombre de tu ficha (ver [Tu firma](#tu-firma)).
- **Qué hizo la inteligencia artificial.** `authorship` lleva una de tres
  etiquetas, que explicamos en [Tu firma](#tu-firma).
- **Tiempo de lectura.** Déjalo en `1`: nosotros lo calculamos.
- **Temas.** Entre 3 y 7 (ver [Temas](#temas)).
- **Imagen.** Los tres datos de imagen van juntos: o los tres o ninguno.

Dos cuidados, porque si no se cumplen la historia no se puede publicar: cada dato
va **entre comillas** (sobre todo si lleva dos puntos), y no puede haber código de
páginas web —texto entre `<` y `>`— ni en la cabecera ni en el cuerpo. Para enlazar
una fuente se escribe `[texto que se ve](https://dirección)`.

### El cuerpo

La secuencia de marca es **SIENTE → ENTIENDE → ACTÚA**, y la regla de oro de la guía
editorial dice que el contenido falla si informa sin conectar, conecta sin explicar,
o explica sin movilizar. El cuerpo tiene cuatro secciones, en este orden, con estos
títulos exactos (empiezan con `## `). Lo que va en cada una está explicado dentro de
la [plantilla](plantillas/historia.md).

Cuatro secciones no son cuatro pilares. La guía editorial define **tres pilares de
contenido** —historias humanas, datos explicados, y contexto y reflexión— y pide que
toda historia combine al menos dos. La cuarta sección no es un pilar, sino el cierre
que convierte lo entendido en algo que hacer:

| Sección | Pilar | Paso de la secuencia |
|---------|-------|----------------------|
| La historia | Historias humanas | SIENTE |
| Noticias principales | Datos explicados | ENTIENDE |
| Conectando los puntos | Contexto y reflexión | ENTIENDE |
| Acción final | — | ACTÚA |

Para ver todo junto, la
[historia de Dayana](stories/2026-10-16-dayana-es-la-mejor-en-matematica.md) tiene
las cuatro secciones, imagen y todos los datos de la cabecera.

## Tu firma

Cada historia la firma una persona. No es un formalismo: quien lee tiene que poder
llegar a alguien que responde por lo que acaba de leer, y eso es lo que hace que una
historia se pueda creer.

Por eso, antes de publicar tu primera historia, escribes tu propia ficha —tú, no el
equipo—: tu nombre, una línea que se muestra al pie de tus historias, y una
biografía corta que diga **por qué te importa el tema** y algo de ti como persona.

Para eso está la [plantilla de ficha de autor](plantillas/autor.md): cópiala,
cambia los textos y sigue las instrucciones que trae dentro. El archivo se guarda en
la carpeta `authors/` con tu nombre en minúsculas, sin tildes y con guiones
(`paolo-carrasco.md`), y ese mismo nombre, sin el `.md`, es el que pones en
`author` en cada historia. Como ejemplo real, mira la
[ficha de Paolo Carrasco](authors/paolo-carrasco.md). El equipo te ayuda con el
formato si lo necesitas.

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

- [ ] Lee la guía editorial antes de escribir.
- [ ] Ten tu ficha de autor y pon su nombre en `author`.
- [ ] Usa en `authorship` la etiqueta que describe lo que de verdad pasó al
      escribir esta historia.
- [ ] Escribe las cuatro secciones, para que la historia combine al menos 2 de los
      3 pilares (historias humanas, datos explicados, contexto y reflexión).
- [ ] Escoge entre 3 y 7 temas propios de esta historia, sin usar los excluidos
      (ver `TEMAS.md`).
- [ ] Enlaza cada fuente, di qué es y explica sus límites y posibles sesgos.
- [ ] Cierra con pasos concretos, no con una invitación genérica a reflexionar.

Las comprobaciones técnicas que hacemos antes de publicar están descritas en
`CLAUDE.md`, para quien quiera el detalle; no necesitas leerlas para contribuir.
