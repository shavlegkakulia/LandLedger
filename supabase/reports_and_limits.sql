-- parcel_reports: მომხმარებლის საჩივრები
create table if not exists public.parcel_reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  parcel_id   uuid references public.parcels(id) on delete set null,
  reason      text not null,
  details     text,
  status      text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at  timestamptz not null default now()
);

alter table public.parcel_reports enable row level security;

-- authenticated user-ს შეუძლია report-ის დამატება
create policy "Authenticated users can insert reports"
  on public.parcel_reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

-- საკუთარი report-ების ნახვა
create policy "Users can view own reports"
  on public.parcel_reports for select
  using (auth.uid() = reporter_id);

-- contact_logs-ზე rate limit: 24 საათში 3 შეტყობინება ერთ მფლობელზე
-- ეს SQL ფუნქცია გამოიძახება sendContactMessage-იდან
create or replace function public.check_contact_rate_limit(
  p_sender_id uuid,
  p_owner_id  uuid
) returns boolean language sql security definer as $$
  select count(*) < 3
  from public.contact_logs
  where sender_id = p_sender_id
    and owner_id  = p_owner_id
    and created_at > now() - interval '24 hours';
$$;
