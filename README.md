# საკადასტრო მონაცემების სისტემა

Next.js 16 + Supabase + Tailwind CSS

## გაშვება

### 1. Supabase პროექტის შექმნა

1. გადადი [supabase.com](https://supabase.com) და შექმენი ახალი პროექტი
2. **Project Settings → API** გვერდზე დააკოპირე:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. .env.local კონფიგურაცია

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. ბაზის სქემა

Supabase Dashboard → **SQL Editor** → გახსენი `supabase/schema.sql` და გაუშვი.

### 4. Email Auth ჩართვა

Supabase Dashboard → **Authentication → Providers → Email** → Enable ✓

### 5. დეველოპმენტ სერვერი

```bash
npm run dev
```

http://localhost:3000

---

## სტრუქტურა

```
app/
  (auth)/
    login/        # შესვლის გვერდი
    register/     # რეგისტრაციის გვერდი
  (dashboard)/
    dashboard/    # ნაკვეთების სია
    parcels/
      new/        # ახალი ნაკვეთი
      [id]/edit/  # ნაკვეთის რედაქტირება
  actions/
    auth.ts       # signIn, signUp, signOut
    parcels.ts    # CRUD operations
lib/supabase/
  client.ts       # Browser client
  server.ts       # Server client
types/
  parcel.ts       # TypeScript types
supabase/
  schema.sql      # ბაზის სქემა + RLS
proxy.ts          # Route protection
```
