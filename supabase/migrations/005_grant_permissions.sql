-- Grant table-level permissions for PostgREST roles
-- RLS policies work on top of these grants

-- anon: read-only on public tables
-- enrollments needed for lessons RLS policy evaluation (lessons_select_enrolled subquery)
grant select on public.courses     to anon;
grant select on public.modules     to anon;
grant select on public.lessons     to anon;
grant select on public.enrollments to anon;

-- authenticated: read + write own data
grant select, insert, update on public.users          to authenticated;
grant select on public.courses                        to authenticated;
grant select on public.modules                        to authenticated;
grant select on public.lessons                        to authenticated;
grant select, insert on public.enrollments            to authenticated;
grant select, insert, update on public.lesson_progress to authenticated;
grant select, insert on public.payments               to authenticated;

-- service_role: full access (bypasses RLS)
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
