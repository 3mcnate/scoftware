set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_trip_settings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN

	insert into public.trip_signup_settings
	(trip_id) values (NEW.id);

	return NEW;

end;
$function$
;

grant delete on table "public"."trip_signup_settings" to "postgres";

grant insert on table "public"."trip_signup_settings" to "postgres";

grant references on table "public"."trip_signup_settings" to "postgres";

grant select on table "public"."trip_signup_settings" to "postgres";

grant trigger on table "public"."trip_signup_settings" to "postgres";

grant truncate on table "public"."trip_signup_settings" to "postgres";

grant update on table "public"."trip_signup_settings" to "postgres";

CREATE TRIGGER insert_trip_settings_trg AFTER INSERT ON public.trips FOR EACH ROW EXECUTE FUNCTION public.insert_trip_settings();


