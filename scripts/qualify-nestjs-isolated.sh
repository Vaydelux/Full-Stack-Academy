#!/usr/bin/env bash
# Explicit local/hosted runtime qualification, never publication or deployment.
set -euo pipefail
if [[ $# -ne 0 ]]; then echo 'No arguments accepted' >&2; exit 2; fi
cd "$(dirname "${BASH_SOURCE[0]}")/.."
command -v docker >/dev/null
command -v node >/dev/null
node -e 'if(!/^v24\.(?:9|[1-9]\d+)\.\d+$/.test(process.version))throw Error("Node 24.9+ required")'
test -z "$(git status --porcelain=v1 --untracked-files=all)"
head=$(git rev-parse HEAD)
container=''
cleanup() {
  if [[ -n "$container" ]]; then docker rm -f "$container" >/dev/null || true; fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
# All credentials are ephemeral hex strings, never production secrets.
export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))')
test_password=$(node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))')
container=$(docker run --rm -d --publish 127.0.0.1::5432 -e POSTGRES_PASSWORD postgres:17)
unset POSTGRES_PASSWORD
ready=0
for ((i=0;i<60;i++)); do
  if docker exec "$container" pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
test "$ready" = 1
# Provision the least-privilege role in this new container only.
docker exec -i "$container" psql -X -v ON_ERROR_STOP=1 -U postgres -d postgres <<SQL
CREATE ROLE academy_nest LOGIN PASSWORD '$test_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE DATABASE academy_test_nest;
REVOKE ALL ON DATABASE academy_test_nest FROM PUBLIC;
GRANT CONNECT, TEMPORARY ON DATABASE academy_test_nest TO academy_nest;
SQL
mapping=$(docker port "$container" 5432/tcp)
[[ "$mapping" =~ ^127\.0\.0\.1:([0-9]+)$ ]]
port="${BASH_REMATCH[1]}"
export ACADEMY_ISOLATED_PG=YES
export PG_TEST_URL="postgres://academy_nest:${test_password}@127.0.0.1:${port}/academy_test_nest"
unset test_password
for module in 11.01 11.02 11.03 11.04; do
  npm run qualify:nestjs:module -- --run "$module"
done
test "$(git rev-parse HEAD)" = "$head"
test -z "$(git status --porcelain=v1 --untracked-files=all)"
unset PG_TEST_URL ACADEMY_ISOLATED_PG
echo 'NestJS four-module runtime qualification passed; publicationApproved=false'
