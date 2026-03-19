-- decks table for SlideMaker
create table if not exists public.decks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Deck',
  slides jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists decks_user_id_idx on public.decks(user_id);
create index if not exists decks_updated_at_idx on public.decks(updated_at desc);
create index if not exists decks_deleted_at_idx on public.decks(deleted_at) where deleted_at is not null;

alter table public.decks enable row level security;

create policy "Users can read own decks"
  on public.decks for select
  using (auth.uid() = user_id);

create policy "Users can insert own decks"
  on public.decks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own decks"
  on public.decks for update
  using (auth.uid() = user_id);

create policy "Users can delete own decks"
  on public.decks for delete
  using (auth.uid() = user_id);
