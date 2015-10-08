#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)
grunt   #build the project
cd dist

git init
git config user.name "Tuomas Salmi"
git config user.email "salmi.tuomas@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/Tumetsu/saaksi"
git fetch upstream
git reset upstream/gh-pages

#echo "saaksi" > CNAME

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
