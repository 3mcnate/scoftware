set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_trip_settings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN

	insert into public.trip_settings
	(trip_id) values (NEW.id);

	return NEW;

end;
$function$
;

grant delete on table "public"."stripe_products" to "postgres";

grant insert on table "public"."stripe_products" to "postgres";

grant references on table "public"."stripe_products" to "postgres";

grant select on table "public"."stripe_products" to "postgres";

grant trigger on table "public"."stripe_products" to "postgres";

grant truncate on table "public"."stripe_products" to "postgres";

grant update on table "public"."stripe_products" to "postgres";


