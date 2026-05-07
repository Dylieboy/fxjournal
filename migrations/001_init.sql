create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  symbol text not null,
  account_currency text not null default 'USD',
  lot_size numeric(12, 2) not null,
  risk_amount numeric(12, 2) not null,
  reward_target numeric(12, 2) not null,
  profit_loss numeric(12, 2) not null,
  outcome text not null check (outcome in ('win', 'loss', 'breakeven')),
  setup text,
  notes text,
  lesson text,
  opened_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists trades_user_created_idx on trades(user_id, created_at desc);
