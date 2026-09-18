#!/usr/bin/env bash
# Publica el sitio en GitHub Pages (https://deku368.github.io/recaudo/).
# Uso: ./deploy.sh   (compila y sube la versión lista a la rama gh-pages)
set -e

echo "→ Compilando…"
npm run build
touch dist/.nojekyll

echo "→ Publicando en gh-pages…"
cd dist
rm -rf .git
git init -b gh-pages -q
git config user.email "robindedragon@gmail.com"
git config user.name "Deku368"
git add -A
git commit -q -m "Sitio compilado de Recaudo"
git push -f https://github.com/Deku368/recaudo.git gh-pages
cd ..
rm -rf dist/.git

echo "✓ Publicado. En 1–2 minutos estará en https://deku368.github.io/recaudo/"
