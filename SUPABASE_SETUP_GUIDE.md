# GreenDesk — Supabase Setup Guide

This guide connects your app to a real Supabase project so Sign Up / Sign In
actually creates accounts, and concern reports are stored in Postgres instead
of (or in addition to) local storage.

## 1. Create a Supabase project

1. Go to https://supabase.com and sign in (GitHub login is fine).
2. Click **New Project**, pick an org, name it (e.g. `greendesk`), set a
   database password (save it somewhere safe), choose a region close to you.
3. Wait ~2 minutes for the project to finish provisioning.

## 2. Get your API keys

In your project dashboard: **Settings → API**.

- **Project URL** → looks like `https://abcxyz.supabase.co`
- **anon public** key → a long JWT string

Create a `.env` file in your project root (same folder as `package.json`):

```
VITE_SUPABASE_URL=https://abcxyz.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

Restart your dev server after adding this file — Vite only reads `.env` on
startup.

## 3. Enable email/password auth

**Authentication → Providers → Email** — it's on by default. Two settings
matter for a student project:

- **Confirm email**: if ON, students must click a confirmation link before
  they can sign in (the app already handles this — it shows "check your
  email" after sign up). Turn it OFF during development if you want instant
  sign-in without checking inbox each time (**Authentication → Providers →
  Email → Confirm email → toggle off**).

## 4. Create the database tables

Go to **SQL Editor → New query**, paste the block below, and click **Run**.

```sql
-- ============================================================
-- PROFILES TABLE
-- Stores the student's name & course/year, kept in sync with
-- auth.users automatically via a trigger.
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  course_year text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, course_year, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'course_year',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- CLASSROOM CONCERNS TABLE
-- ============================================================
create table if not exists public.classroom_concerns (
  id uuid default gen_random_uuid() primary key,
  tracking_number text not null unique,
  student_id uuid references auth.users(id) on delete set null,
  student_name text not null,
  course_year text not null,
  contact_info text not null,
  is_anonymous boolean default false,
  location text not null,
  category text not null,
  description text,
  priority text check (priority in ('Urgent', 'Normal')) default 'Normal',
  date_noticed date default current_date,
  photo_url text,
  status text check (status in ('Submitted', 'Seen by Guidance', 'Assigned to Tech', 'All Done!')) default 'Submitted',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.classroom_concerns enable row level security;

-- Anyone signed in can read all reports (needed for the tracking-number search)
create policy "Signed-in users can read reports"
  on public.classroom_concerns for select
  using (auth.role() = 'authenticated');

-- Students can only insert reports tagged with their own student_id
create policy "Students can insert their own reports"
  on public.classroom_concerns for insert
  with check (auth.uid() = student_id or is_anonymous = true);

-- Only allow status/notes updates (you'd normally restrict this to an
-- admin/staff role — see the note below)
create policy "Signed-in users can update status"
  on public.classroom_concerns for update
  using (auth.role() = 'authenticated');
```

> **Note on the update policy:** right now any signed-in student could
> technically update a report's status, because this app doesn't yet have a
> separate "staff" role. For a real deployment, add a `role` column to
> `profiles` (`student` / `staff`) and change the update policy to check
> `exists (select 1 from profiles where id = auth.uid() and role = 'staff')`.

## 5. (Optional) Storage bucket for photo uploads

If you want students to upload real photos instead of using placeholder URLs:

1. **Storage → New bucket** → name it `concern-photos`, make it **Public**.
2. Add a policy allowing authenticated uploads:

```sql
create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'concern-photos' and auth.role() = 'authenticated');
```

## 6. What's already wired up in the code

- `supabaseClient.ts` — has `signUpWithEmail`, `signInWithEmail`,
  `signOutUser`, and `getCurrentSession`, all using real Supabase Auth.
- `App.tsx` — checks for an existing session on load and listens for
  auth state changes, so refreshing the page keeps you signed in.
- `LoginPage.tsx` — a real Sign Up / Sign In form (no more hardcoded demo
  student). Sign up collects full name + course/year and stores them in the
  user's `user_metadata`, which the trigger above copies into `profiles`.

## 7. Still using local storage for reports?

The report list (`getStoredConcerns`, `saveStoredConcern`,
`updateStoredConcernStatus` in `supabaseClient.ts`) currently reads/writes
`localStorage` as a fallback so the UI works with zero setup. Once you've run
the SQL above, swap those three functions for real Supabase queries, e.g.:

```ts
export const saveConcern = async (report: ConcernReport) => {
  const { data, error } = await supabase
    .from('classroom_concerns')
    .insert(report)
    .select()
    .single();
  if (error) throw error;
  return data;
};
```

Happy to wire that part up too if you want — just ask.
