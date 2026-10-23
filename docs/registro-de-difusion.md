# Registro de difusión en redes

Qué salió en cada red social, cuándo y con qué texto: el registro de la
**difusión** de una historia (el término y su límite con "publicación" están en
el [CONTEXT.md de redes-sociales](https://github.com/mistorias/mistorias-redes-sociales/blob/main/CONTEXT.md)).
Lo escribe el flujo automático de
[mistorias-redes-sociales](https://github.com/mistorias/mistorias-redes-sociales)
(su [ADR 0003](https://github.com/mistorias/mistorias-redes-sociales/blob/main/docs/adr/0003-flujo-de-difusion-automatica.md)),
no una persona.

## Dónde vive

`stories/<slug>/difusion.json`, en la misma carpeta que `principal.jpg`.
Así, todo lo que pertenece a una historia queda junto, y no hay una segunda
lista de slugs que pueda desincronizarse de `stories/`.

- Si la historia no tiene imagen, la carpeta existe solo con
  `difusion.json`. Es válido: los requisitos de imagen miran si existe
  `principal.jpg`, no si existe la carpeta.
- El build de mistorias-web solo admite `principal.jpg` dentro de esa carpeta
  hasta que su gate se amplíe para aceptar también este archivo. **Ningún
  registro se fusiona antes de ese cambio**, porque rompería el build.

## Quién lo escribe

Solo el bot de redes (una GitHub App propia, distinta de la que actualiza el
contenido en mistorias-web), y siempre por PR: nunca un commit directo a `main`.
Una persona revisa y fusiona ese PR. Corregir un registro a mano es posible, pero
también va por PR y explicando el porqué: el registro es lo que respalda qué se
dijo en nombre de Mistorias.

## Esquema

```json
{
  "story": "2026-10-12-dayana-destaca-pero-las-tardanzas-le-pueden-afectar",
  "posts": [
    {
      "network": "instagram",
      "bufferId": "6710a1…",
      "status": "difundido",
      "scheduledAt": "2026-10-20T19:05:00-05:00",
      "publishedAt": "2026-10-20T19:05:12-05:00",
      "text": "Texto exacto que se envió a Buffer.",
      "url": "https://mistorias.pe/historias/2026-10-12-…/?utm_source=instagram&utm_medium=social&utm_campaign=2026-10-12-…",
      "utmCampaign": "2026-10-12-…"
    }
  ]
}
```

Las claves van en inglés, como las del frontmatter, porque las lee un script; los
valores de `status` van en castellano porque son del dominio (ver
[convenciones de scripts](convenciones-de-scripts.md)). El formato es JSON por
las razones del
[ADR 0034 de mistorias-web](https://github.com/mistorias/mistorias-web/blob/main/docs/adr/0034-formato-json-del-registro-de-difusion.md).

Solo se registra lo que salió o falló. Los borradores en Buffer y la aprobación
de la difusión no dejan rastro aquí: la aprobación queda en el historial de
deployments de mistorias-redes-sociales.

| Campo                     | Regla                                                                 | Para qué sirve                                   |
|---------------------------|-----------------------------------------------------------------------|--------------------------------------------------|
| `story`                   | Igual al nombre de la carpeta.                                        | Comprobar que el archivo está donde debe.        |
| `network`                 | Uno de `facebook`, `instagram`, `x`.                                   | No difundir dos veces en la misma red.           |
| `bufferId`                | El id que devolvió Buffer.                                            | No duplicar; rastrear el post en Buffer.         |
| `status`                  | `difundido` o `fallido`.                                              | Auditar qué salió de verdad.                     |
| `scheduledAt`             | ISO 8601 con zona horaria.                                            | Auditar.                                         |
| `publishedAt`             | ISO 8601, o `null` si `status` es `fallido`.                          | Auditar.                                         |
| `text`                    | El texto exacto que se envió a Buffer, enlace incluido.               | Auditar lo que se dijo en nombre de Mistorias.   |
| `url`                     | El enlace con sus parámetros UTM.                                     | Cruzar con las métricas del sitio.               |
| `utmCampaign`             | El valor de `utm_campaign` (hoy, el slug).                            | Filtrar la analítica sin parsear la URL.         |

El flujo no agenda en una red que ya tiene una entrada `difundido`. Un post
`fallido` no se reintenta solo: queda registrado para que el equipo decida. Si se
vuelve a intentar, se agrega una entrada nueva para esa red y la anterior no se
borra.
