# Dedicated, disposable local repository. Docker engine required.
supabase --help
supabase init
supabase start
supabase status
# WARNING: only on disposable local data; this drops/recreates local DB.
supabase db reset
