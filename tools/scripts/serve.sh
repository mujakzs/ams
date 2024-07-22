#!/bin/bash

set -e

APPS=(api static app-ws app)

for app in "${APPS[@]}"; do
    echo "Serving: "$app""
    APP="$app" pm2 start pnpm --name "$app" -- run serve
done
