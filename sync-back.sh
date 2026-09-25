#!/usr/bin/env bash
# Kopierar de delade filerna tillbaka till brfv2-mockup. Samma sökvägar på
# båda sidor, så det är ren kopiering — inget att översätta.
#
#   npm run sync-back          # kopierar hit -> brfv2-mockup/src
#   npm run sync-back -- --diff  # visar bara skillnaderna
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
DIT="$HERE/../brfv2-mockup/src"
DELADE=(
  theme.css
  App.css
  pdfCache.js
  useSlashFocus.js
  components/PdfPane.jsx
  components/TraffMark.jsx
  components/Instrument.jsx
  components/Instrument.css
  components/EmptyState.jsx
  components/datum.js
)
if [[ "${1:-}" == "--diff" ]]; then
  for f in "${DELADE[@]}"; do diff -u "$DIT/$f" "$HERE/src/$f" || true; done
  exit 0
fi
for f in "${DELADE[@]}"; do
  if ! cmp -s "$DIT/$f" "$HERE/src/$f"; then
    cp "$HERE/src/$f" "$DIT/$f"; echo "uppdaterad: src/$f"
  fi
done
echo "Klart. App.jsx och api.js i det här paketet är paketets egna — de kopieras inte."
