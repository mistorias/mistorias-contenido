#!/usr/bin/env bash
# Registra que el resumen de una historia pasó la auditoría del subagente
# verificador-resumen. Guarda el hash del archivo auditado: si el resumen o el
# cuerpo cambian después, el hash deja de coincidir y verificar-resumen.sh vuelve
# a pedir la auditoría.
#
# Lo invoca el subagente verificador-resumen, solo cuando su veredicto es APROBADO.
# Ver .claude/agents/verificador-resumen.md
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CACHE_DIR="$REPO_DIR/.claude/cache/resumenes-verificados"

if [ $# -ne 1 ]; then
  echo "uso: $(basename "$0") stories/<archivo>.md" >&2
  exit 1
fi

# Acepta la ruta relativa al repo o absoluta.
archivo="$1"
case "$archivo" in
  /*) ruta="$archivo" ;;
  *)  ruta="$REPO_DIR/$archivo" ;;
esac

if [ ! -f "$ruta" ]; then
  echo "ERROR: no existe $ruta" >&2
  exit 1
fi

mkdir -p "$CACHE_DIR"
slug="$(basename "$ruta" .md)"
hash="$(sha256sum "$ruta" | awk '{print $1}')"

printf '%s\n' "$hash" > "$CACHE_DIR/$slug.verificado"
# El contador de intentos deja de tener sentido una vez aprobado.
rm -f "$CACHE_DIR/$slug.intentos"

echo "Registrado: $slug verificado en $hash"
