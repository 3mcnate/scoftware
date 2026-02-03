alter table "public"."trip_signup_settings" add column "driver_signup_date_override" timestamp with time zone;

alter table "public"."trip_signup_settings" add column "member_signup_date_override" timestamp with time zone;

alter table "public"."trip_signup_settings" add column "nonmember_signup_date_override" timestamp with time zone;

alter table "public"."trips" drop column "driver_ticket_drop_date_override";

alter table "public"."trips" drop column "member_ticket_drop_date_override";

alter table "public"."trips" drop column "nonmember_ticket_drop_date_override";

grant delete on table "public"."trip_signup_settings" to "postgres";

grant insert on table "public"."trip_signup_settings" to "postgres";

grant references on table "public"."trip_signup_settings" to "postgres";

grant select on table "public"."trip_signup_settings" to "postgres";

grant trigger on table "public"."trip_signup_settings" to "postgres";

grant truncate on table "public"."trip_signup_settings" to "postgres";

grant update on table "public"."trip_signup_settings" to "postgres";


