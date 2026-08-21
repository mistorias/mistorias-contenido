#!/usr/bin/env bash
# Cierra el lazo de verificación del resumen de las historias modificadas.
#
# Hace dos cosas distintas:
#   1. Chequeos mecánicos que un script sí puede juzgar: que el `summary` exista,
#      esté en una sola línea y no pase de 30 palabras (CLAUDE.md §2).
#   2. Chequeo de estado: que el lazo de generación y evaluación del resumen haya
#      corrido sobre el archivo **en su contenido actual**. Qué tan fiel al cuerpo y
#      qué tan atractivo es el resumen son juicios semánticos que este script no
#      evalúa — solo exige que la auditoría haya ocurrido y no esté vencida.
#
# Se invoca desde el hook Stop de .claude/settings.json. Si falta algo, devuelve
# decision=block para que la sesión siga trabajando en vez de terminar.
# Ver .claude/skills/publicar-historia/SKILL.md §5 y CLAUDE.md §10.
set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CACHE_DIR="$REPO_DIR/.claude/cache/resumenes-verificados"
MAX_INTENTOS="${MISTORIAS_MAX_INTENTOS_RESUMEN:-3}"

cd "$REPO_DIR" || exit 0

changed=$(git status --porcelain -- 'stories/*.md' 2>/dev/null | awk '{print $NF}')

if [ -z "$changed" ]; then
  echo '{"suppressOutput": true}'
  exit 0
fi

mkdir -p "$CACHE_DIR"

# Devuelve el valor del campo summary del frontmatter (primer bloque ---).
extraer_summary() {
  awk '
    NR == 1 && $0 == "---" { dentro = 1; next }
    dentro && $0 == "---"   { exit }
    dentro && /^summary:/   { sub(/^summary:[[:space:]]*/, ""); print; exit }
  ' "$1"
}

problemas=""
pendientes=""

for f in $changed; do
  [ -f "$f" ] || continue
  slug="$(basename "$f" .md)"

  valor="$(extraer_summary "$f")"

  if [ -z "$valor" ]; then
    problemas="${problemas}- ${f}: el frontmatter no tiene un \`summary\` con valor en la misma línea (CLAUDE.md §2: una línea por campo, sin valores multilínea).\n"
    continue
  fi

  # Quita las comillas envolventes para contar solo las palabras del texto.
  texto="$(printf '%s' "$valor" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
  palabras="$(printf '%s' "$texto" | wc -w | tr -d ' ')"

  if [ "$palabras" -gt 30 ]; then
    problemas="${problemas}- ${f}: el resumen tiene ${palabras} palabras y el máximo es 30 (CLAUDE.md §2).\n"
    continue
  fi

  hash_actual="$(sha256sum "$f" | awk '{print $1}')"
  registro="$CACHE_DIR/$slug.verificado"

  if [ -f "$registro" ] && [ "$(cat "$registro")" = "$hash_actual" ]; then
    continue
  fi

  if [ -f "$registro" ]; then
    pendientes="${pendientes}- ${f}: el archivo cambió desde la última auditoría; hay que verificar el resumen de nuevo.\n"
  else
    pendientes="${pendientes}- ${f}: el resumen todavía no fue auditado contra el cuerpo.\n"
  fi
done

if [ -z "$problemas" ] && [ -z "$pendientes" ]; then
  echo '{"systemMessage": "Resúmenes verificados: todas las historias modificadas tienen su resumen auditado contra el cuerpo."}'
  exit 0
fi

# Tope de intentos: se cuenta contra el conjunto de historias modificadas, para no
# dejar la sesión girando si el umbral no se alcanza. Se reinicia solo cuando ese
# conjunto cambia de contenido.
firma="$(printf '%s' "$changed" | xargs -r sha256sum 2>/dev/null | sha256sum | awk '{print $1}')"
contador="$CACHE_DIR/.intentos"
previa=""
n=0
if [ -f "$contador" ]; then
  previa="$(awk 'NR==1{print $1}' "$contador")"
  n="$(awk 'NR==1{print $2}' "$contador")"
fi
if [ "$previa" != "$firma" ]; then
  n=0
fi
n=$((n + 1))
printf '%s %s\n' "$firma" "$n" > "$contador"

detalle=""
[ -n "$problemas" ]  && detalle="${detalle}Problemas mecánicos del frontmatter:\n${problemas}"
[ -n "$pendientes" ] && detalle="${detalle}Resúmenes sin auditoría vigente:\n${pendientes}"

if [ "$n" -ge "$MAX_INTENTOS" ]; then
  msg="Verificación de resúmenes: se alcanzó el tope de ${MAX_INTENTOS} intentos sin cerrar. Queda pendiente:\n${detalle}\nRevisar a mano antes de publicar."
  printf '{"systemMessage": "%s"}\n' "$(printf '%b' "$msg" | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}')"
  exit 0
fi

razon="La verificación del resumen no está cerrada (intento ${n} de ${MAX_INTENTOS}).\n\n${detalle}\nPara cada historia pendiente: corrige lo mecánico si aplica y corre el lazo del paso 5 de .claude/skills/publicar-historia/SKILL.md. Lanza \`generador-resumen\` sobre el cuerpo para obtener el texto del resumen, pásaselo a \`verificador-resumen\` junto con el archivo, y compara su JSON contra los umbrales: evaluacion_sintesis >= 80 y evaluacion_enganche >= 90. Si alguno queda corto, vuelve a generar pasándole el resumen anterior y las observaciones de la evaluación (hasta 5 vueltas). Cuando ambos pasen, escribe el resumen en el frontmatter y recién ahí registra con .claude/scripts/registrar-resumen-verificado.sh. No termines el turno hasta que este hook pase o se agote el tope de intentos."

printf '{"decision": "block", "reason": "%s"}\n' "$(printf '%b' "$razon" | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}')"
exit 0
