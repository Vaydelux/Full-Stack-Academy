# Run only in the isolated local project from an initialized repo.
supabase --help
supabase migration --help
supabase migration new add_workspace_table
# Review the generated timestamped SQL file before using a test DB.
supabase start
# Local database reset replays tracked migrations and sample seed data.
supabase db reset
