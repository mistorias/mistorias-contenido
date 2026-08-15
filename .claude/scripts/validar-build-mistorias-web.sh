#!/usr/bin/env bash
# Valida las historias modificadas de este repo contra el build real de
# mistorias-web (submódulo de contenido apuntado a este checkout).
# Se invoca desde el hook Stop de .claude/settings.json — ver CLAUDE.md §5.2.
set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WEB_DIR="${MISTORIAS_WEB_DIR:-/tmp/claude-hooks/mistorias-web}"
LOG_FILE="${MISTORIAS_WEB_LOG:-/tmp/claude-hooks/validar-build.log}"
mkdir -p "$(dirname "$LOG_FILE")"

# Historias nuevas o modificadas (staged, sin stage, o sin trackear) desde la
# última vez que se validaron.
changed=$(cd "$REPO_DIR" && git status --porcelain -- stories/*.md 2>/dev/null | awk '{print $NF}')

if [ -z "$changed" ]; then
  echo '{"suppressOutput": true}'
  exit 0
fi

{
  echo "=== validar-build-mistorias-web $(date -u +%FT%TZ) ==="
  echo "Historias a validar:"
  echo "$changed"
  echo

  if [ ! -d "$WEB_DIR/.git" ]; then
    echo "Clonando mistorias-web en $WEB_DIR..."
    if ! git clone --depth 1 https://github.com/mistorias/mistorias-web "$WEB_DIR"; then
      echo "ERROR: no se pudo clonar mistorias-web. La salida de red puede estar restringida (CLAUDE.md §9)."
      exit 1
    fi
  fi

  cd "$WEB_DIR" || exit 1

  echo "Apuntando el submódulo de contenido a este checkout ($REPO_DIR)..."
  if ! git submodule set-url content/mistorias-contenido "file://$REPO_DIR" 2>>"$LOG_FILE"; then
    echo "ERROR: no encontré el submódulo content/mistorias-contenido en mistorias-web. Revisa la ruta con el equipo."
    exit 1
  fi
  git submodule sync content/mistorias-contenido
  # git bloquea clonar submódulos por file:// por defecto (protocol.file.allow);
  # es seguro habilitarlo aquí porque el único remoto local que usamos es este repo.
  git -c protocol.file.allow=always submodule update --init content/mistorias-contenido

  echo "Instalando dependencias..."
  if ! pnpm install --frozen-lockfile; then
    echo "ERROR: pnpm install falló."
    exit 1
  fi

  echo "Corriendo pnpm test..."
  if ! pnpm test; then
    echo "ERROR: pnpm test falló."
    exit 1
  fi

  echo "Corriendo pnpm build..."
  build_output="$(pnpm build 2>&1)"
  echo "$build_output"

  fail=0
  for f in $changed; do
    slug="$(basename "$f" .md)"
    if echo "$build_output" | grep -q "/historias/${slug}/index.html"; then
      echo "OK: /historias/${slug}/index.html generado para ${f}"
    else
      echo "FALTA: /historias/${slug}/index.html no aparece en la salida del build para ${f}"
      fail=1
    fi
  done

  exit "$fail"
} >>"$LOG_FILE" 2>&1

status=$?
if [ "$status" -ne 0 ]; then
  echo "{\"systemMessage\": \"Validación de build de mistorias-web FALLÓ para una o más historias. Detalle en $LOG_FILE\"}"
  exit 2
else
  echo "{\"systemMessage\": \"Validación de build de mistorias-web OK para todas las historias modificadas. Detalle en $LOG_FILE\"}"
  exit 0
fi
