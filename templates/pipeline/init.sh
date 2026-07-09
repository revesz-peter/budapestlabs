#!/usr/bin/env bash
set -euo pipefail

# Budapest Labs | New client project from the golden template.
# Clones the template repo, renames the workspace, starts fresh git history.

LABS_DIR="/Users/mac/labs"
TEMPLATE_REPO="${TEMPLATE_REPO:-git@github.com:gaited-community/bl-template.git}"
FALLBACK_REPO="git@github.com:gaited-community/gaited-monorepo.git"

echo ""
echo "Budapest Labs | New Client Project"
echo "=================================="
echo ""

read -rp "Business name (e.g. Peti Pékség): " BUSINESS_NAME
if [[ -z "$BUSINESS_NAME" ]]; then
  echo "Error: business name is required."
  exit 1
fi

# kebab-case slug: strip accents, lowercase, dashes
PROJECT_NAME=$(echo "$BUSINESS_NAME" \
  | sed 's/[áÁ]/a/g; s/[éÉ]/e/g; s/[íÍ]/i/g; s/[óÓöÖőŐ]/o/g; s/[úÚüÜűŰ]/u/g' \
  | tr '[:upper:]' '[:lower:]' \
  | sed 's/[^a-z0-9]/-/g; s/-\{2,\}/-/g; s/^-//; s/-$//')

TARGET="$LABS_DIR/$PROJECT_NAME"
if [[ -d "$TARGET" ]]; then
  echo "Error: $TARGET already exists."
  exit 1
fi

echo ""
echo "Project: $TARGET"
echo "Template: $TEMPLATE_REPO"
echo ""

if ! git clone --depth 1 "$TEMPLATE_REPO" "$TARGET" 2>/dev/null; then
  echo "Template repo not reachable. Falling back to the reference architecture:"
  echo "  $FALLBACK_REPO"
  echo "After cloning, strip product-specific surfaces per templates/pipeline/PLAYBOOK.md"
  echo "(one-time setup section) before customizing for the client."
  git clone --depth 1 "$FALLBACK_REPO" "$TARGET"
fi

cd "$TARGET"
rm -rf .git
git init -q

# Rename workspace occurrences of the template name
if command -v rg >/dev/null 2>&1; then
  rg -l --hidden -g '!node_modules' -g '!.git' 'bl-template|gaited' . 2>/dev/null \
    | while read -r f; do
        sed -i '' "s/bl-template/$PROJECT_NAME/g" "$f" 2>/dev/null || true
      done
fi

git add -A
git commit -qm "chore: init $PROJECT_NAME from template"

echo ""
echo "Done. Next steps (templates/pipeline/PLAYBOOK.md):"
echo "  1. pnpm install"
echo "  2. Theme tokens in packages/ui"
echo "  3. Content per CLIENT.md"
echo "  4. Tier activation, legal, deploy"
