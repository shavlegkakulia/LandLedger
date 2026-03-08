-- პროფილების ცხრილი
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  first_name    text not null,
  last_name     text not null,
  gender        text check (gender in ('male', 'female', 'other')),
  birth_date    date,
  phone         text,
  address       text,
  email         text,
  -- privacy flags: true = სხვებს ჩანს
  show_phone        boolean not null default false,
  show_address      boolean not null default false,
  show_gender       boolean not null default false,
  show_birth_date   boolean not null default false,
  show_email        boolean not null default false,
  profile_completed boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- updated_at trigger
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;

-- საკუთარი პროფილი — სრული წვდომა
create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- სხვების პროფილი — მხოლოდ წაკითხვა (show_* flags-ს კოდი ამოწმებს)
create policy "Users read others profiles"
  on public.profiles for select
  using (true);

-- ახალი მომხმარებლის დარეგისტრირებისას ავტომატურად შევქმნათ ცარიელი პროფილი
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (new.id, '', '', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- parcels ცხრილი (თუ უკვე გაქვს, გამოტოვე ეს ბლოკი)
create table if not exists public.parcels (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  cadastral_code text not null,
  address        text not null,
  area_sqm       numeric(12, 2),
  region         text,
  municipality   text,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger parcels_updated_at
  before update on public.parcels
  for each row execute procedure public.set_updated_at();

alter table public.parcels enable row level security;

create policy "Users manage own parcels"
  on public.parcels for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ყველამ შეუძლია ნახოს ნაკვეთები (public listing)
create policy "Anyone can view parcels"
  on public.parcels for select
  using (true);
