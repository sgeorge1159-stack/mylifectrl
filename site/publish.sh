#!/usr/bin/env bash
# Publish LIFECTRL site — copy latest builds and restart server on port 3000.
set -euo pipefail
cd "$(dirname "$0")"
umask 002
mkdir -p .run

# Copy latest server and client builds from lifectrl source
cp /home/team/shared/lifectrl/server/dist/index.js ./dist/server/index.js
rm -rf /home/team/shared/client/dist
mkdir -p /home/team/shared/client/dist
cp -r /home/team/shared/lifectrl/client/dist/* /home/team/shared/client/dist/

bun install --silent 2>/dev/null || true
setsid nohup bun run start > .run/server.log 2>&1 < /dev/null &

for _ in $(seq 1 50); do
  if curl -sf -o /dev/null http://localhost:3000; then
    echo "site published; serving on port 3000"
    exit 0
  fi
  sleep 0.2
done
echo "warning: published, but the server isn't responding — check .run/server.log" >&2
exit 1
