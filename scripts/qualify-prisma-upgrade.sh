#!/usr/bin/env bash
# Execute only the exact reviewed lock in a disposable linked worktree and PostgreSQL 17.
set -euo pipefail
[[ $# -eq 1 ]]
cd "$(dirname "${BASH_SOURCE[0]}")/.."
artifact=$(realpath "$1")
node scripts/verify-p4-prisma-lock.mjs "$artifact"
lock_sha=$(sha256sum "$artifact/package-lock.json" | cut -d ' ' -f 1)
[[ "$(uname -s)" = Linux && -z "${DOCKER_HOST:-}" && -z "${DOCKER_CONTEXT:-}" ]]
[[ "$(docker context inspect --format '{{.Endpoints.docker.Host}}')" = unix://* ]]
node -e 'if(process.version!=="v24.11.1")throw Error("Node 24.11.1 required for exact runtime candidate")'
test -z "$(git status --porcelain=v1 --untracked-files=all)"
head=$(git rev-parse HEAD)
work=''
container=''
cleanup() {
  if [[ -n "$container" ]]; then docker rm -f "$container" >/dev/null || true; fi
  if [[ -n "$work" ]]; then git worktree remove --force "$work" || echo 'Disposable checkout cleanup failed' >&2; fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
work=$(mktemp -d "${TMPDIR:-/tmp}/academy-prisma-review.XXXXXXXX")
git worktree add --detach "$work" "$head"
prefix="$work/examples/p4-runtime/prisma"
if [[ -f "$prefix/package-lock.json" ]]; then cmp "$prefix/package-lock.json" "$artifact/package-lock.json"; else cp "$artifact/package-lock.json" "$prefix/package-lock.json"; fi
# No disposable database credentials exist yet; no GitHub write token in this job.
npm audit --prefix "$prefix" --audit-level=high --registry=https://registry.npmjs.org/
npm ci --prefix "$prefix" --no-audit --no-fund --registry=https://registry.npmjs.org/
cmp "$prefix/package-lock.json" "$artifact/package-lock.json"
secret() { node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))'; }
export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(secret)
prisma_password=$(secret)
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
CREATE ROLE academy_prisma LOGIN PASSWORD '$prisma_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE DATABASE academy_test_prisma OWNER academy_prisma;
REVOKE ALL ON DATABASE academy_test_prisma FROM PUBLIC;
SQL
export ACADEMY_PRISMA_ISOLATED=YES
export ACADEMY_PRISMA_URL="postgres://academy_prisma:${prisma_password}@127.0.0.1:${port}/academy_test_prisma"
unset prisma_password
(cd "$work"; node examples/p4-runtime/prisma/qualify.mjs)
cmp "$prefix/package-lock.json" "$artifact/package-lock.json"
# Only the lock candidate may differ; generated and installed outputs must be ignored.
changes=$(git -C "$work" status --porcelain=v1 --untracked-files=all)
[[ -z "$changes" || "$changes" == '?? examples/p4-runtime/prisma/package-lock.json' ]]
test "$(git -C "$work" rev-parse HEAD)" = "$head"
test "$(git rev-parse HEAD)" = "$head"
test -z "$(git status --porcelain=v1 --untracked-files=all)"
node -e 'console.log(JSON.stringify({commit:process.argv[1],lockSha256:process.argv[2],runtimeQualified:true,scope:"supplemental-prisma-runtime",topicQualification:false,publicationApproved:false}))' "${head}" "$lock_sha"
