#!/bin/bash

set -o errexit -o nounset

rm -rf dist || exit 0;
mkdir dist;

grunt   #build the project

cd dist
git init
git config user.name "Travis CI"
git config user.email "<you>@<your-email>"

git add .
git commit -m "Deploy to GitHub Pages"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
