-- უნიკალური ნახვების ცხრილი
create table if not exists public.parcel_views (
  id         uuid primary key default gen_random_uuid(),
  parcel_id  uuid not null references public.parcels(id) on delete cascade,
  viewer_id  uuid not null references auth.users(id) on delete cascade,
  viewed_at  timestamptz not null default now(),
  -- ერთი user ერთ ნაკვეთს მხოლოდ ერთხელ ჩაიწერება
  unique (parcel_id, viewer_id)
);

-- RLS
alter table public.parcel_views enable row level security;

-- მხოლოდ authenticated user-ებს შეუძლიათ view-ის ჩაწერა
create policy "Authenticated users can insert views"
  on public.parcel_views for insert
  to authenticated
  with check (auth.uid() = viewer_id);

-- მხოლოდ ნაკვეთის მფლობელს შეუძლია ნახვების დათვლა
create policy "Parcel owner can read views"
  on public.parcel_views for select
  using (
    exists (
      select 1 from public.parcels
      where id = parcel_id
      and user_id = auth.uid()
    )
  );
