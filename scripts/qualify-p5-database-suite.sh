#!/usr/bin/env bash
# Hosted qualification only: fresh PostgreSQL container per suite.
set -euo pipefail
[[ $# -eq 1 && "${GITHUB_ACTIONS:-}" == true && "${RUNNER_OS:-}" == Linux ]]
mode=$1
case "$mode" in
  auth-sql|rls|http-db|search|inbox-sql|inbox-live) ;;
  *) exit 2 ;;
esac
cd "$(dirname "${BASH_SOURCE[0]}")/.."
[[ -z "${DOCKER_HOST:-}" && -z "${DOCKER_CONTEXT:-}" ]]
[[ "$(docker context inspect --format '{{.Endpoints.docker.Host}}')" == unix://* ]]
test -z "$(git status --porcelain=v1 --untracked-files=all)"
head=$(git rev-parse HEAD)
for name in psql pg_dump pg_restore; do "$name" --version | grep -Eq 'PostgreSQL\) 17\.'; done
link=''
container=''
cleanup(){
 local status=$?
 trap - EXIT
 if [[ -n "$link" ]]; then rm -f -- "$link" || status=1; fi
 if [[ -n "$container" ]]; then docker rm -f "$container" >/dev/null || status=1; fi
 exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
if [[ "$mode" == inbox-live ]]; then
 prefix=examples/p5-distributed-runtime
 npm audit --prefix "$prefix" --audit-level=high
 npm ci --prefix "$prefix" --ignore-scripts --no-audit --no-fund
 target="$(pwd -P)/examples/p5-integrations/postgres-inbox/node_modules"
 [[ ! -e "$target" && ! -L "$target" ]]
 ln -s "$(pwd -P)/$prefix/node_modules" "$target"
 link=$target
fi
secret(){ node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))'; }
export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(secret)
password=$(secret)
echo "::add-mask::$POSTGRES_PASSWORD"
echo "::add-mask::$password"
port=$(node -e 'const s=require("node:net").createServer();s.listen(0,"127.0.0.1",()=>{process.stdout.write(String(s.address().port));s.close()})')
[[ "$port" =~ ^[0-9]+$ ]]
db=p5_lab_security
roleflag=NOCREATEROLE
case "$mode" in
 rls|http-db) roleflag=CREATEROLE ;;
 search) db=p5_lab_search_training ;;
 inbox-sql|inbox-live) db=p5_lab_inbox_training ;;
esac
container=$(docker run --rm -d --network host -e POSTGRES_PASSWORD postgres:17 -c listen_addresses=127.0.0.1 -c "port=$port")
unset POSTGRES_PASSWORD
ready=0
for ((i=0;i<60;i++)); do
 if docker exec "$container" pg_isready -h 127.0.0.1 -p "$port" -U postgres >/dev/null 2>&1; then ready=1;break;fi
 sleep 1
done
test "$ready" = 1
docker exec -i "$container" psql -X -h /var/run/postgresql -p "$port" -v ON_ERROR_STOP=1 -U postgres -d postgres <<SQL
CREATE ROLE academy_p5 LOGIN PASSWORD '$password' NOSUPERUSER NOCREATEDB $roleflag NOREPLICATION NOBYPASSRLS;
CREATE DATABASE $db OWNER academy_p5;
REVOKE ALL ON DATABASE $db FROM PUBLIC;
SQL
# Remove ambient connection overrides before constructing explicit local settings.
while IFS= read -r key; do unset "$key"; done < <(compgen -e | grep -E '^PG[A-Z_]*$' || true)
export P5_LAB_CONFIRM=DISPOSABLE_ONLY P5_LAB_RLS_CONFIRM=ALLOW_ROLES P5_HTTP_DB_CONFIRM=ISOLATED_CLUSTER
export P5_LAB_DATABASE_URL="postgres://academy_p5:${password}@127.0.0.1:${port}/${db}"
export PGPASSWORD="$password"
export P5_SEARCH_DB="$db" P5_SEARCH_HOST=127.0.0.1 P5_SEARCH_PORT="$port" P5_SEARCH_USER=academy_p5 P5_SEARCH_CONFIRM=I_UNDERSTAND_DISPOSABLE_DB P5_SEARCH_CONFIRM_DB="$db"
export P5_INBOX_DB="$db" P5_INBOX_HOST=127.0.0.1 P5_INBOX_PORT="$port" P5_INBOX_USER=academy_p5 P5_INBOX_PASSWORD="$password" P5_INBOX_CONFIRM=I_UNDERSTAND_DISPOSABLE_DB P5_INBOX_CONFIRM_DB="$db" P5_INBOX_LIVE_CONFIRM=ALLOW_TEMPORARY_SCHEMA
unset password
case "$mode" in
 auth-sql) command=qualify:p5:postgresql ;;
 rls) command=qualify:p5:rls ;;
 http-db) command=qualify:p5:http-db ;;
 search) command=qualify:p5:postgres-search ;;
 inbox-sql) command=qualify:p5:inbox-sql ;;
 inbox-live) command=qualify:p5:inbox-live ;;
esac
timeout --signal=TERM --kill-after=10s 240s npm run "$command"
if [[ -n "$link" ]]; then rm -f -- "$link"; link=''; fi
test "$(git rev-parse HEAD)" = "$head"
test -z "$(git status --porcelain=v1 --untracked-files=all)"
node -e 'console.log(JSON.stringify({commit:process.argv[1],suite:process.argv[2],runtimeQualified:true,topicQualification:false,publicationApproved:false}))' "$head" "$mode"
