#!/usr/bin/env bash
set -euo pipefail
[[ "${GITHUB_ACTIONS:-}" == true && "${RUNNER_OS:-}" == Linux ]]
cd "$(dirname "${BASH_SOURCE[0]}")/.."
[[ -z "${DOCKER_HOST:-}" && -z "${DOCKER_CONTEXT:-}" ]]
[[ "$(docker context inspect --format '{{.Endpoints.docker.Host}}')" == unix://* ]]
test -z "$(git status --porcelain=v1 --untracked-files=all)"
prefix=examples/p4-runtime/prisma
node -e 'if(process.version!=="v24.11.1")throw Error("Node 24.11.1 required")'
test "$(sha256sum "$prefix/package-lock.json" | cut -d' ' -f1)" = 6224c119f414d23df5ad20ccfe69df33b60022ba331006408e6b36eb4177ee7c
npm audit --prefix "$prefix" --audit-level=high
npm ci --prefix "$prefix" --no-audit --no-fund
secret(){ node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))'; }
export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(secret)
owner_password=$(secret)
learner_password=$(secret)
port=$(node -e 'const s=require("node:net").createServer();s.listen(0,"127.0.0.1",()=>{process.stdout.write(String(s.address().port));s.close()})')
container=''
cleanup(){ if [[ -n "$container" ]]; then docker rm -f "$container" >/dev/null; fi; }
trap cleanup EXIT
container=$(docker run --rm -d --network host -e POSTGRES_PASSWORD postgres:17 -c listen_addresses=127.0.0.1 -c "port=$port")
unset POSTGRES_PASSWORD
ready=0
for ((i=0;i<60;i++)); do
 if docker exec "$container" pg_isready -h 127.0.0.1 -p "$port" -U postgres >/dev/null 2>&1; then ready=1;break;fi
 sleep 1
done
test "$ready" = 1
docker exec -i "$container" psql -X -h /var/run/postgresql -p "$port" -v ON_ERROR_STOP=1 -U postgres -d postgres <<SQL
CREATE ROLE academy_prisma_owner LOGIN PASSWORD '$owner_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE ROLE academy_prisma_learner LOGIN PASSWORD '$learner_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE DATABASE academy_test_prisma OWNER academy_prisma_owner;
REVOKE ALL ON DATABASE academy_test_prisma FROM PUBLIC;
GRANT CONNECT ON DATABASE academy_test_prisma TO academy_prisma_learner;
SQL
export ACADEMY_PRISMA_ISOLATED=YES
export ACADEMY_PRISMA_URL="postgres://academy_prisma_owner:${owner_password}@127.0.0.1:${port}/academy_test_prisma"
unset owner_password
(cd "$prefix"; node node_modules/prisma/build/index.js db push --config topic-data/prisma.config.ts; node node_modules/prisma/build/index.js generate --config topic-data/prisma.config.ts)
docker exec -i "$container" psql -X -h /var/run/postgresql -p "$port" -v ON_ERROR_STOP=1 -U postgres -d academy_test_prisma <<SQL
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO academy_prisma_learner;
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO academy_prisma_learner;
SQL
export ACADEMY_PRISMA_URL="postgres://academy_prisma_learner:${learner_password}@127.0.0.1:${port}/academy_test_prisma"
unset learner_password
node --experimental-transform-types --test --test-reporter=tap "$prefix/topic-data/acceptance.test.mjs"
test -z "$(git status --porcelain=v1 --untracked-files=all)"
