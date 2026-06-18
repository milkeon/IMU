create table if not exists public.keyramid_portfolio_pages (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.keyramid_portfolio_projects (
  id text primary key,
  title text not null default '',
  type text not null default '',
  tech text not null default '',
  language text not null default '',
  overview text not null default '',
  purpose text not null default '',
  image text not null default '',
  repo_url text not null default '',
  repo_full_name text not null default '',
  source text not null default 'supabase',
  visible boolean not null default true,
  firebase_id text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists keyramid_portfolio_projects_title_idx
  on public.keyramid_portfolio_projects (title);
