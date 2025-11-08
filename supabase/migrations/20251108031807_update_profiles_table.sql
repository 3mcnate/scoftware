alter table "public"."tickets" drop constraint "tickets_waiver_id_fkey";

alter table "public"."guide_info" add column "is_wfr" boolean not null default false;

alter table "public"."guide_info" add column "wfr_expiration_date" date;

alter table "public"."profiles" drop column "email";

alter table "public"."profiles" drop column "phone_number";

alter table "public"."tickets" drop column "waiver_confirmed";

alter table "public"."tickets" drop column "waiver_id";

CREATE UNIQUE INDEX tickets_stripe_refund_id_key ON public.tickets USING btree (stripe_refund_id);

alter table "public"."guide_info" add constraint "guide_info_check" CHECK (((NOT is_wfr) OR (wfr_expiration_date IS NOT NULL))) not valid;

alter table "public"."guide_info" validate constraint "guide_info_check";

alter table "public"."tickets" add constraint "tickets_stripe_refund_id_key" UNIQUE using index "tickets_stripe_refund_id_key";

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

begin
	if new.email !~* '@usc.edu$' then
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


