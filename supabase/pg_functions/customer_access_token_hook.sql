-- Create the auth hook function
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    urole public.user_role;
  begin
    -- Fetch the user role in the user_roles table
    select "role" into urole from public.roles where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';
	claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$ set search_path = '';

grant usage on schema public to supabase_auth_admin;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;

grant all
  on table public.roles
to supabase_auth_admin;

revoke all
  on table public.roles
  from authenticated, anon, public;

create policy "Allow auth admin to read user roles" ON public.roles
as permissive for select
to supabase_auth_admin
using (true)