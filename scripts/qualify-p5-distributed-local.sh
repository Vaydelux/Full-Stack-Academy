#!/usr/bin/env bash
set -euo pipefail
[[ "${GITHUB_ACTIONS:-}" == true && "${RUNNER_OS:-}" == Linux ]]
cd "$(dirname "${BASH_SOURCE[0]}")/.."
[[ -z "${DOCKER_HOST:-}" && -z "${DOCKER_CONTEXT:-}" ]]
[[ "$(docker context inspect --format '{{.Endpoints.docker.Host}}')" == unix://* ]]
test -z "$(git status --porcelain=v1 --untracked-files=all)"
head=$(git rev-parse HEAD)
prefix=examples/p5-distributed-runtime
npm audit --prefix "$prefix" --audit-level=high
npm ci --prefix "$prefix" --ignore-scripts --no-audit --no-fund
secret(){ node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))'; }
port(){ node -e 'const s=require("node:net").createServer();s.listen(0,"127.0.0.1",()=>{process.stdout.write(String(s.address().port));s.close()})'; }
export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(secret)
pg_password=$(secret)
pg_port=$(port)
redis_port=$(port)
[[ "$pg_port" != "$redis_port" ]]
pg_container=''
redis_container=''
cleanup(){
 local status=$?
 trap - EXIT
 if [[ -n "$redis_container" ]]; then docker rm -f "$redis_container" >/dev/null || status=1; fi
 if [[ -n "$pg_container" ]]; then docker rm -f "$pg_container" >/dev/null || status=1; fi
 exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
pg_container=$(docker run --rm -d --network host -e POSTGRES_PASSWORD postgres:17 -c listen_addresses=127.0.0.1 -c "port=$pg_port")
unset POSTGRES_PASSWORD
redis_container=$(docker run --rm -d --network host redis:7.4 redis-server --bind 127.0.0.1 --port "$redis_port" --protected-mode yes --maxmemory-policy noeviction --save "" --appendonly no)
ready=0
for ((i=0;i<60;i++)); do
 if docker exec "$pg_container" pg_isready -h 127.0.0.1 -p "$pg_port" -U postgres >/dev/null 2>&1 && [[ "$(docker exec "$redis_container" redis-cli -h 127.0.0.1 -p "$redis_port" ping 2>/dev/null)" == PONG ]]; then ready=1;break;fi
 sleep 1
done
test "$ready" = 1
docker exec -i "$pg_container" psql -X -h /var/run/postgresql -p "$pg_port" -v ON_ERROR_STOP=1 -U postgres -d postgres <<SQL
CREATE ROLE academy_dist LOGIN PASSWORD '$pg_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE DATABASE academy_test_distributed;
REVOKE ALL ON DATABASE academy_test_distributed FROM PUBLIC;
GRANT CONNECT,TEMPORARY,CREATE ON DATABASE academy_test_distributed TO academy_dist;
SQL
export ACADEMY_DISTRIBUTED_PG_ISOLATED=YES ACADEMY_REDIS_ISOLATED=YES
export ACADEMY_DISTRIBUTED_PG_URL="postgres://academy_dist:${pg_password}@127.0.0.1:${pg_port}/academy_test_distributed"
export ACADEMY_REDIS_URL="redis://127.0.0.1:${redis_port}/0"
unset pg_password
for mode in postgres redis queue; do
 timeout --signal=TERM --kill-after=10s 180s node "$prefix/run.mjs" "$mode"
done
test "$(git rev-parse HEAD)" = "$head"
test -z "$(git status --porcelain=v1 --untracked-files=all)"
node -e 'console.log(JSON.stringify({commit:process.argv[1],suites:["postgres","redis","queue"],runtimeQualified:true,topicQualification:false,publicationApproved:false}))' "$head"
