-- Run as the project owner in the Supabase SQL Editor.
begin;

create table if not exists public.pecksland_members (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.pecksland_members enable row level security;
revoke all on public.pecksland_members from anon, authenticated;
grant select on public.pecksland_members to authenticated;

drop policy if exists "Members can verify their own access" on public.pecksland_members;
create policy "Members can verify their own access"
on public.pecksland_members for select to authenticated
using (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public)
values ('pecksland-private', 'pecksland-private', false)
on conflict (id) do update set public = false;

drop policy if exists "Pecksland members can read the planner" on storage.objects;
create policy "Pecksland members can read the planner"
on storage.objects for select to authenticated
using (
  bucket_id = 'pecksland-private'
  and name = 'planner.html'
  and exists (
    select 1 from public.pecksland_members
    where user_id = (select auth.uid())
  )
);

commit;
