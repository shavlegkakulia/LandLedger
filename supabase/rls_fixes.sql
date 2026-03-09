-- ============================================================
-- RLS FIXES — გაუშვი Supabase SQL Editor-ში
-- ============================================================

-- ============================================================
-- 1. contact_logs — RLS ჩართვა და პოლიციები
-- ============================================================

-- თუ ცხრილი ჯერ არ არსებობს, შეიქმნება
create table if not exists public.contact_logs (
  id         uuid primary key default gen_random_uuid(),
  sender_id  uuid not null references auth.users(id) on delete cascade,
  owner_id   uuid not null references auth.users(id) on delete cascade,
  message    text,
  status     text not null default 'sent' check (status in ('sent', 'failed')),
  error_msg  text,
  created_at timestamptz not null default now()
);

alter table public.contact_logs enable row level security;

-- გამგზავნს შეუძლია მხოლოდ საკუთარი ჩანაწერების ნახვა
create policy "Sender can view own contact logs"
  on public.contact_logs for select
  using (auth.uid() = sender_id);

-- მფლობელს შეუძლია ნახოს ვინ მიწერა
create policy "Owner can view received contact logs"
  on public.contact_logs for select
  using (auth.uid() = owner_id);

-- insert — მხოლოდ authenticated, sender_id = current user
create policy "Authenticated users can insert contact logs"
  on public.contact_logs for insert
  to authenticated
  with check (auth.uid() = sender_id);

-- ============================================================
-- 2. activity_logs — RLS ჩართვა და პოლიციები
-- ============================================================

create table if not exists public.activity_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  action     text not null,
  status     text not null default 'error',
  error_msg  text,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

-- activity_logs — მხოლოდ service_role (admin) კითხულობს
-- ჩვეულებრივი users ვერ ნახავენ ლოგებს პირდაპირ
-- (anon/authenticated role-ს select უფლება არ ეძლევა)

-- insert — server actions service_role-ს იყენებს, მაგრამ
-- თუ anon key-ით მოდის, მხოლოდ საკუთარი ჩანაწერები
create policy "Users can insert own activity logs"
  on public.activity_logs for insert
  to authenticated
  with check (auth.uid() = user_id OR user_id is null);

-- ============================================================
-- 3. profiles — SELECT policy გამოსწორება
-- ============================================================

-- ძველი ღია policy წაშლა
drop policy if exists "Users read others profiles" on public.profiles;

-- ახალი: avatar_url და display სახელები ყველამ ნახოს,
-- პირადი ველები (phone, address, birth_date) — მხოლოდ
-- თუ show_* = true ან ეს არის საკუთარი პროფილი
-- PostgreSQL row-level security column-level ფილტრს არ უჭერს,
-- ამიტომ ვიყენებთ security definer view-ს

create or replace view public.profiles_public
  with (security_invoker = false)
  as
  select
    id,
    first_name,
    last_name,
    avatar_url,
    -- პირადი ველები: მხოლოდ show_* = true-ს დროს ან საკუთარი პროფილი
    case when show_email      or auth.uid() = id then email      else null end as email,
    case when show_phone      or auth.uid() = id then phone      else null end as phone,
    case when show_address    or auth.uid() = id then address    else null end as address,
    case when show_gender     or auth.uid() = id then gender     else null end as gender,
    case when show_birth_date or auth.uid() = id then birth_date else null end as birth_date,
    show_email,
    show_phone,
    show_address,
    show_gender,
    show_birth_date,
    profile_completed,
    created_at,
    updated_at
  from public.profiles;

-- ძველი ღია SELECT policy-ს ნაცვლად: authenticated users კითხავენ მხოლოდ view-დან
-- profiles ცხრილზე პირდაპირ SELECT-ი მხოლოდ საკუთარ row-ზე
create policy "Users read others profiles via view"
  on public.profiles for select
  using (auth.uid() = id);

-- view-ს select privilege მივეცეთ authenticated role-ს
grant select on public.profiles_public to authenticated;

-- ============================================================
-- შენიშვნა: კოდში findPublicProfileById გადაიყვანე
-- profiles_public view-ზე profiles ცხრილის ნაცვლად.
-- ============================================================
