-- Fix handle_new_user to populate name from user_metadata
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, phone, name)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$;
