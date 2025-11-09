create table "public"."env" (
    "key" text not null,
    "value" text not null
);


alter table "public"."env" enable row level security;

CREATE UNIQUE INDEX env_pkey ON public.env USING btree (key);

alter table "public"."env" add constraint "env_pkey" PRIMARY KEY using index "env_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare

fname text;
lname text;
env text;

begin

	select "value" into env
	from public.env where "key" = 'env';

	if env != 'development' and new.email !~* '@usc.edu$' then
		raise exception 'must signup with @usc.edu email address';
	end if;

	if new.raw_user_meta_data->>'first_name' is null then
		fname := new.email;
	end if;

	if new.raw_user_meta_data->>'last_name' is null then
		lname := new.email;
	end if;

	insert into public.profiles (id, first_name, last_name)
	values (
		new.id,
		fname,
		lname
	);

	insert into public.roles ("user_id", "role")
	values (
		new.id,
		'participant'
	);

	return new;
end;
$function$
;

grant delete on table "public"."env" to "anon";

grant insert on table "public"."env" to "anon";

grant references on table "public"."env" to "anon";

grant select on table "public"."env" to "anon";

grant trigger on table "public"."env" to "anon";

grant truncate on table "public"."env" to "anon";

grant update on table "public"."env" to "anon";

grant delete on table "public"."env" to "authenticated";

grant insert on table "public"."env" to "authenticated";

grant references on table "public"."env" to "authenticated";

grant select on table "public"."env" to "authenticated";

grant trigger on table "public"."env" to "authenticated";

grant truncate on table "public"."env" to "authenticated";

grant update on table "public"."env" to "authenticated";

grant delete on table "public"."env" to "service_role";

grant insert on table "public"."env" to "service_role";

grant references on table "public"."env" to "service_role";

grant select on table "public"."env" to "service_role";

grant trigger on table "public"."env" to "service_role";

grant truncate on table "public"."env" to "service_role";

grant update on table "public"."env" to "service_role";


