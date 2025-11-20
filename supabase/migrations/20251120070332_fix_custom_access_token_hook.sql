set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
  declare
    claims jsonb;
    app_role public.user_role;
  begin
    -- Fetch the user role in the user_roles table
    select "role" into app_role from public.roles where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';
	  claims := jsonb_set(claims, '{app_role}', to_jsonb(app_role));

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$function$
;


