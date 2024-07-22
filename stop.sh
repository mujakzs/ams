#!/bin/bash

set -e

docker ps -a | awk 'NR>1 {print $NF}' | xargs -I {} docker rm -f {}
echo "y" | docker system prune -a && echo "y" | docker volume prune -a && docker system df

rm -rf dist/ tmp/ node_modules/