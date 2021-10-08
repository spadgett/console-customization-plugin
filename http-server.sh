#!/usr/bin/env bash

set -exuo pipefail

PUBLIC_PATH="$1"
shift

./node_modules/.bin/http-server "$PUBLIC_PATH" --port 9001 -c-1 --cors "$@"
