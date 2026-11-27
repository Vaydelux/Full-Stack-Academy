#!/usr/bin/env bash
# Independent P3 runtime; only freshly created disposable PostgreSQL resources.
set -euo pipefail
mode=runtime
if [[ $# -eq 1 && "$1" == --automated-batch ]]; then mode=automated
elif [[ $# -eq 1 && "$1" == --rehearse-sql ]]; then mode=rehearse
elif [[ $# -ne 0 ]]; then echo 'Usage: qualify-p3-isolated.sh [--rehearse-sql|--automated-batch]' >&2; exit 2; fi
cd "$(dirname "${BASH_SOURCE[0]}")/.."
[[ "$(uname -s)" = Linux && -z "${DOCKER_HOST:-}" && -z "${DOCKER_CONTEXT:-}" ]]
[[ "$(docker context inspect --format '{{.Endpoints.docker.Host}}')" = unix://* ]]
node -e 'if(!/^v24\.(?:9|[1-9]\d+)\.\d+$/.test(process.version))throw Error("Node 24.9+ required")'
for client in psql pg_dump pg_restore; do
  "$client" --version | grep -Eq 'PostgreSQL\) 17\.'
done
test -z "$(git status --porcelain=v1 --untracked-files=all)"
head=$(git rev-parse HEAD)
if [[ "$mode" == runtime ]]; then npm ci --prefix examples/p5-distributed-runtime; fi
test -z "$(git status --porcelain=v1 --untracked-files=all)"
container=''
review=''
cleanup() { if [[ -n "$review" ]]; then git worktree remove --force "$review" || echo 'Review cleanup failed' >&2; fi; if [[ -n "$container" ]]; then docker rm -f "$container" >/dev/null || true; fi; }
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
secret() { node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))'; }
export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(secret)
sql_password=$(secret)
distributed_password=$(secret)
restore_password=$(secret)
nest_password=$(secret)
port=$(node -e 'const net=require("node:net");const s=net.createServer();s.listen(0,"127.0.0.1",()=>{process.stdout.write(String(s.address().port));s.close()})')
[[ "$port" =~ ^[0-9]+$ ]]
container=$(docker run --rm -d --network host -e POSTGRES_PASSWORD postgres:17 -c listen_addresses=127.0.0.1 -c "port=$port")
unset POSTGRES_PASSWORD
ready=0
for ((i=0;i<60;i++)); do
  if docker exec "$container" pg_isready -h 127.0.0.1 -p "$port" -U postgres >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
test "$ready" = 1
docker exec -i "$container" psql -X -h /var/run/postgresql -p "$port" -v ON_ERROR_STOP=1 -U postgres -d postgres <<SQL
CREATE ROLE academy_sql LOGIN PASSWORD '$sql_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE ROLE academy_dist LOGIN PASSWORD '$distributed_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE ROLE academy_restore LOGIN PASSWORD '$restore_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE ROLE academy_nest LOGIN PASSWORD '$nest_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE DATABASE academy_test_nest;
REVOKE ALL ON DATABASE academy_test_nest FROM PUBLIC;
GRANT CONNECT,TEMPORARY ON DATABASE academy_test_nest TO academy_nest;
CREATE DATABASE academy_test_sql;
CREATE DATABASE academy_test_distributed;
CREATE DATABASE academy_test_backup;
CREATE DATABASE academy_test_restore;
REVOKE ALL ON DATABASE academy_test_sql FROM PUBLIC;
REVOKE ALL ON DATABASE academy_test_distributed FROM PUBLIC;
REVOKE ALL ON DATABASE academy_test_backup FROM PUBLIC;
REVOKE ALL ON DATABASE academy_test_restore FROM PUBLIC;
GRANT CONNECT,TEMPORARY ON DATABASE academy_test_sql TO academy_sql;
GRANT CONNECT,TEMPORARY,CREATE ON DATABASE academy_test_distributed TO academy_dist;
GRANT CONNECT,TEMPORARY,CREATE ON DATABASE academy_test_backup TO academy_restore;
GRANT CONNECT,TEMPORARY,CREATE ON DATABASE academy_test_restore TO academy_restore;
SQL
export ACADEMY_ISOLATED_PG=YES ACADEMY_DISTRIBUTED_PG_ISOLATED=YES ACADEMY_PG_RESTORE_ISOLATED=YES
export PG_TEST_URL="postgres://academy_sql:${sql_password}@127.0.0.1:${port}/academy_test_sql"
export ACADEMY_DISTRIBUTED_PG_URL="postgres://academy_dist:${distributed_password}@127.0.0.1:${port}/academy_test_distributed"
export ACADEMY_PG_BACKUP_URL="postgres://academy_restore:${restore_password}@127.0.0.1:${port}/academy_test_backup"
export PG_RESTORE_TEST_URL="postgres://academy_restore:${restore_password}@127.0.0.1:${port}/academy_test_restore"
export ACADEMY_NEST_PG_TEST_URL="postgres://academy_nest:${nest_password}@127.0.0.1:${port}/academy_test_nest"
unset sql_password distributed_password restore_password nest_password
if [[ "$mode" != runtime ]]; then
  review=$(mktemp -d "${TMPDIR:-/tmp}/academy-p3-review.XXXXXXXX")
  git worktree add --detach "$review" "$head"
  if [[ "$mode" == automated ]]; then
    (cd "$review"; node --test tests/p3-source-rehearsal.test.mjs tests/automated-batch-release.test.mjs; node scripts/rehearse-p1-p2-publication.mjs --automated-batch)
  else
    (cd "$review"; node --test tests/p3-source-rehearsal.test.mjs; node scripts/rehearse-p1-p2-publication.mjs --through-p3-sql)
  fi
  git worktree remove --force "$review"
  review=''
else
  node scripts/qualify-p3-runtime.mjs
fi
test "$(git rev-parse HEAD)" = "$head"
test -z "$(git status --porcelain=v1 --untracked-files=all)"
