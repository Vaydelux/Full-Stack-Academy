#!/usr/bin/env bash
set -euo pipefail
[[ $# -eq 1 && "${GITHUB_ACTIONS:-}" == true && "${RUNNER_OS:-}" == Linux ]]
cd "$(dirname "${BASH_SOURCE[0]}")/.."
root=$(pwd -P)
out=$(realpath "$1")
[[ "$out" == "$RUNNER_TEMP/"* && -d "$out" ]]
[[ -z "${DOCKER_HOST:-}" && -z "${DOCKER_CONTEXT:-}" ]]
[[ "$(docker context inspect --format '{{.Endpoints.docker.Host}}')" == unix://* ]]
test -z "$(git status --porcelain=v1 --untracked-files=all)"
test -z "$(docker ps -aq)"
head=$(git rev-parse HEAD)
npm ci --prefix examples/p5-distributed-runtime --ignore-scripts --no-audit --no-fund
test -z "$(git status --porcelain=v1 --untracked-files=all)"
work=$(mktemp -d "$RUNNER_TEMP/academy-supabase.XXXXXXXX")
umask 077
cleanup(){
 status=$?
 trap - EXIT
 if [[ -d "$work/supabase" ]]; then (cd "$work"; supabase stop --no-backup >"$work/stop.log" 2>&1) || status=1; fi
 rm -rf -- "$work"
 exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
unset SUPABASE_ACCESS_TOKEN SUPABASE_DB_PASSWORD SUPABASE_PROJECT_ID
supabase --version
supabase init --help >/dev/null
supabase start --help >/dev/null
supabase stop --help >/dev/null
supabase status --help >/dev/null
(cd "$work"; supabase init >"$work/init.log" 2>&1; supabase start >"$work/start.log" 2>&1; supabase status -o json >"$work/status.json" 2>"$work/status.log")
export ACADEMY_DISPOSABLE_SUPABASE_RUNNER=YES
node examples/p5-distributed-runtime/qualify-supabase-local.mjs "$work/status.json" "$out"
test "$(git rev-parse HEAD)" = "$head"
test -z "$(git status --porcelain=v1 --untracked-files=all)"
