create table "public"."waiver_signatures" (
    "id" uuid not null default gen_random_uuid(),
    "document_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "signed_at" timestamp with time zone not null,
    "confirmation_email_sent_at" timestamp with time zone not null,
    "ip_address" text not null,
    "user_id" uuid not null,
    "email" text not null,
    "typed_name" text not null,
    "typed_date" text not null,
    "drawn_signature" text not null,
    "consent_text" text not null,
    "document_hash" text not null,
    "signature_hash" text not null
);


alter table "public"."waiver_signatures" enable row level security;

CREATE UNIQUE INDEX waiver_signatures_pkey ON public.waiver_signatures USING btree (id);

alter table "public"."waiver_signatures" add constraint "waiver_signatures_pkey" PRIMARY KEY using index "waiver_signatures_pkey";

alter table "public"."waiver_signatures" add constraint "waiver_signatures_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."waiver_signatures" validate constraint "waiver_signatures_user_id_fkey";

grant delete on table "public"."waiver_signatures" to "anon";

grant insert on table "public"."waiver_signatures" to "anon";

grant references on table "public"."waiver_signatures" to "anon";

grant select on table "public"."waiver_signatures" to "anon";

grant trigger on table "public"."waiver_signatures" to "anon";

grant truncate on table "public"."waiver_signatures" to "anon";

grant update on table "public"."waiver_signatures" to "anon";

grant delete on table "public"."waiver_signatures" to "authenticated";

grant insert on table "public"."waiver_signatures" to "authenticated";

grant references on table "public"."waiver_signatures" to "authenticated";

grant select on table "public"."waiver_signatures" to "authenticated";

grant trigger on table "public"."waiver_signatures" to "authenticated";

grant truncate on table "public"."waiver_signatures" to "authenticated";

grant update on table "public"."waiver_signatures" to "authenticated";

grant delete on table "public"."waiver_signatures" to "service_role";

grant insert on table "public"."waiver_signatures" to "service_role";

grant references on table "public"."waiver_signatures" to "service_role";

grant select on table "public"."waiver_signatures" to "service_role";

grant trigger on table "public"."waiver_signatures" to "service_role";

grant truncate on table "public"."waiver_signatures" to "service_role";

grant update on table "public"."waiver_signatures" to "service_role";


