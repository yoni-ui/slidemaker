-- Add is_draft to decks
alter table public.decks add column if not exists is_draft boolean not null default true;

-- user_usage: track AI generations per user per day (free tier limit)
create table if not exists public.user_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  generations_count int not null default 0,
  unique(user_id, usage_date)
);

create index if not exists user_usage_user_date_idx on public.user_usage(user_id, usage_date);

alter table public.user_usage enable row level security;

create policy "Users can read own usage"
  on public.user_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.user_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.user_usage for update
  using (auth.uid() = user_id);

-- Service role can upsert for API (RLS allows user to read own)
-- API will use service role or run as user via supabase client
