-- ========================================
-- Avatars Storage Bucket + RLS Policies
-- გაუშვი Supabase SQL Editor-ში
-- ========================================

-- 1. bucket შექმნა (public = სურათები ყველამ ნახოს)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  1048576, -- 1MB in bytes
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 1048576,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. RLS policies

-- ატვირთვა: მხოლოდ საკუთარი folder-ი (user_id/avatar.ext)
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- განახლება: მხოლოდ საკუთარი
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- წაკითხვა: ყველა (public bucket)
create policy "Avatars are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- წაშლა: მხოლოდ საკუთარი
create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
