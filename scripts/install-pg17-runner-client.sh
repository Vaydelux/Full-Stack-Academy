#!/usr/bin/env bash
# GitHub-hosted Ubuntu 24.04 only. Never modify a learner's machine.
set -euo pipefail
[[ "${GITHUB_ACTIONS:-}" == true && "${RUNNER_OS:-}" == Linux ]]
source /etc/os-release
[[ "$ID" == ubuntu && "$VERSION_CODENAME" == noble ]]
if [[ ! -x /usr/lib/postgresql/17/bin/psql || ! -x /usr/lib/postgresql/17/bin/pg_dump || ! -x /usr/lib/postgresql/17/bin/pg_restore ]]; then
  key=$(mktemp)
  trap 'rm -f "$key"' EXIT
  curl --fail --silent --show-error --location --proto '=https' --tlsv1.2 https://www.postgresql.org/media/keys/ACCC4CF8.asc -o "$key"
  fingerprint=$(gpg --batch --with-colons --show-keys "$key" | awk -F: '$1=="fpr"{print $10;exit}')
  [[ "$fingerprint" == B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8 ]]
  sudo install -d -m 0755 /usr/share/postgresql-common/pgdg
  sudo install -m 0644 "$key" /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
  printf 'Types: deb\nURIs: https://apt.postgresql.org/pub/repos/apt/\nSuites: noble-pgdg\nArchitectures: %s\nComponents: main\nSigned-By: /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc\n' "$(dpkg --print-architecture)" | sudo tee /etc/apt/sources.list.d/academy-pgdg.sources >/dev/null
  sudo apt-get update
  sudo apt-get install -y --no-install-recommends postgresql-client-17
fi
for client in psql pg_dump pg_restore; do
  "/usr/lib/postgresql/17/bin/$client" --version | grep -E 'PostgreSQL\) 17\.'
done
