-- Fix: infinite recursion in admin RLS policies
-- Problem: policies check public.users.role which re-triggers users RLS
-- Solution: security definer function that bypasses RLS

create or replace function public.get_my_role()
returns text
language sql
security definer
stable
as $$
  select role from public.users where id = auth.uid();
$$;

-- Re-create users admin policy (was self-referential)
drop policy if exists "users_admin_all" on public.users;
create policy "users_admin_all" on public.users for all
  using (public.get_my_role() = 'admin');

-- Re-create all other admin policies to use the function
drop policy if exists "courses_admin_all" on public.courses;
create policy "courses_admin_all" on public.courses for all
  using (public.get_my_role() = 'admin');

drop policy if exists "modules_admin_all" on public.modules;
create policy "modules_admin_all" on public.modules for all
  using (public.get_my_role() = 'admin');

drop policy if exists "lessons_admin_all" on public.lessons;
create policy "lessons_admin_all" on public.lessons for all
  using (public.get_my_role() = 'admin');

drop policy if exists "enrollments_admin_all" on public.enrollments;
create policy "enrollments_admin_all" on public.enrollments for all
  using (public.get_my_role() = 'admin');

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all" on public.payments for all
  using (public.get_my_role() = 'admin');
