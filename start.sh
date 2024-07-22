#!/bin/bash

set -e

git checkout .
git pull origin main

rm -rf dist/ tmp/
nx reset

pnpm install --frozen-lockfile
pnpm run build
pnpm run docker
pnpm run prod:all

echo "Waiting for database to initialize."
sleep 30

docker restart migrations
echo "Inserting initial data."
sleep 30

docker restart api
echo "Done"
