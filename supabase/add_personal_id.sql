-- ========================================
-- personal_id სვეტი profiles ცხრილზე
-- გაუშვი Supabase SQL Editor-ში
-- ========================================

alter table public.profiles
  add column if not exists personal_id text default null;

-- view განახლება show_personal_id-ით
alter table public.profiles
  add column if not exists show_personal_id boolean not null default false;

-- profiles_public view-ში personal_id დამატება
drop view if exists public.profiles_public;

create view public.profiles_public
  with (security_invoker = false)
  as
  select
    id,
    case when show_name        or auth.uid() = id then first_name   else null end as first_name,
    case when show_name        or auth.uid() = id then last_name    else null end as last_name,
    case when show_avatar      or auth.uid() = id then avatar_url   else null end as avatar_url,
    null::text as email,
    null::text as phone,
    case when show_address     or auth.uid() = id then address      else null end as address,
    case when show_gender      or auth.uid() = id then gender       else null end as gender,
    case when show_birth_date  or auth.uid() = id then birth_date   else null end as birth_date,
    case when show_personal_id or auth.uid() = id then personal_id  else null end as personal_id,
    false as show_email,
    false as show_phone,
    show_name,
    show_avatar,
    show_address,
    show_gender,
    show_birth_date,
    show_personal_id,
    profile_completed,
    created_at,
    updated_at
  from public.profiles;

grant select on public.profiles_public to authenticated;
