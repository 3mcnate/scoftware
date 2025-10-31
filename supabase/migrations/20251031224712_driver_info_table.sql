create table "public"."driver_info" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "drivers_license_number" text not null,
    "vehicle_make_and_model" text not null,
    "vehicle_year" integer not null,
    "vehicle_owner_name" text not null,
    "vehicle_owner_address" text not null,
    "auto_insurance_company" text not null,
    "auto_insurance_policy_number" text not null,
    "num_seats" integer not null,
    "slack_interested" boolean not null,
    "good_condition" boolean not null
);


alter table "public"."driver_info" enable row level security;

alter table "public"."participant_info" alter column "allergies" set not null;

alter table "public"."participant_info" alter column "dietary_restrictions" set not null;

alter table "public"."participant_info" alter column "emergency_contact_name" set not null;

alter table "public"."participant_info" alter column "emergency_contact_phone_number" set not null;

alter table "public"."participant_info" alter column "emergency_contact_relationship" set not null;

alter table "public"."participant_info" alter column "health_insurance_bin_number" set not null;

alter table "public"."participant_info" alter column "health_insurance_group_number" set not null;

alter table "public"."participant_info" alter column "health_insurance_member_id" set not null;

alter table "public"."participant_info" alter column "health_insurance_provider" set not null;

alter table "public"."participant_info" alter column "medical_history" set not null;

alter table "public"."participant_info" alter column "medications" set not null;

CREATE UNIQUE INDEX driver_info_pkey ON public.driver_info USING btree (user_id);

alter table "public"."driver_info" add constraint "driver_info_pkey" PRIMARY KEY using index "driver_info_pkey";

alter table "public"."driver_info" add constraint "driver_info_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."driver_info" validate constraint "driver_info_user_id_fkey";

grant delete on table "public"."driver_info" to "anon";

grant insert on table "public"."driver_info" to "anon";

grant references on table "public"."driver_info" to "anon";

grant select on table "public"."driver_info" to "anon";

grant trigger on table "public"."driver_info" to "anon";

grant truncate on table "public"."driver_info" to "anon";

grant update on table "public"."driver_info" to "anon";

grant delete on table "public"."driver_info" to "authenticated";

grant insert on table "public"."driver_info" to "authenticated";

grant references on table "public"."driver_info" to "authenticated";

grant select on table "public"."driver_info" to "authenticated";

grant trigger on table "public"."driver_info" to "authenticated";

grant truncate on table "public"."driver_info" to "authenticated";

grant update on table "public"."driver_info" to "authenticated";

grant delete on table "public"."driver_info" to "service_role";

grant insert on table "public"."driver_info" to "service_role";

grant references on table "public"."driver_info" to "service_role";

grant select on table "public"."driver_info" to "service_role";

grant trigger on table "public"."driver_info" to "service_role";

grant truncate on table "public"."driver_info" to "service_role";

grant update on table "public"."driver_info" to "service_role";


