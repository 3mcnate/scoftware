create table "public"."tickets" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "trip_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "stripe_checkout_session_id" text not null,
    "cancelled" boolean not null default false,
    "refunded" boolean not null default false,
    "waiver_id" uuid not null,
    "waiver_confirmed" boolean not null default false
);


alter table "public"."tickets" enable row level security;

create table "public"."waiver_uploads" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "ticket_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "bucket" text not null default 'private'::text,
    "path" text not null
);


alter table "public"."waiver_uploads" enable row level security;

CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id);

CREATE UNIQUE INDEX tickets_stripe_checkout_session_id_key ON public.tickets USING btree (stripe_checkout_session_id);

CREATE UNIQUE INDEX tickets_unique_trip_participant ON public.tickets USING btree (user_id, trip_id);

CREATE UNIQUE INDEX waivers_pkey ON public.waiver_uploads USING btree (id);

alter table "public"."tickets" add constraint "tickets_pkey" PRIMARY KEY using index "tickets_pkey";

alter table "public"."waiver_uploads" add constraint "waivers_pkey" PRIMARY KEY using index "waivers_pkey";

alter table "public"."tickets" add constraint "tickets_stripe_checkout_session_id_key" UNIQUE using index "tickets_stripe_checkout_session_id_key";

alter table "public"."tickets" add constraint "tickets_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) not valid;

alter table "public"."tickets" validate constraint "tickets_trip_id_fkey";

alter table "public"."tickets" add constraint "tickets_unique_trip_participant" UNIQUE using index "tickets_unique_trip_participant";

alter table "public"."tickets" add constraint "tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."tickets" validate constraint "tickets_user_id_fkey";

alter table "public"."tickets" add constraint "tickets_waiver_id_fkey" FOREIGN KEY (waiver_id) REFERENCES waiver_uploads(id) not valid;

alter table "public"."tickets" validate constraint "tickets_waiver_id_fkey";

alter table "public"."waiver_uploads" add constraint "waiver_uploads_bucket_fkey" FOREIGN KEY (bucket) REFERENCES storage.buckets(name) not valid;

alter table "public"."waiver_uploads" validate constraint "waiver_uploads_bucket_fkey";

alter table "public"."waiver_uploads" add constraint "waivers_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) not valid;

alter table "public"."waiver_uploads" validate constraint "waivers_ticket_id_fkey";

alter table "public"."waiver_uploads" add constraint "waivers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."waiver_uploads" validate constraint "waivers_user_id_fkey";

grant delete on table "public"."tickets" to "anon";

grant insert on table "public"."tickets" to "anon";

grant references on table "public"."tickets" to "anon";

grant select on table "public"."tickets" to "anon";

grant trigger on table "public"."tickets" to "anon";

grant truncate on table "public"."tickets" to "anon";

grant update on table "public"."tickets" to "anon";

grant delete on table "public"."tickets" to "authenticated";

grant insert on table "public"."tickets" to "authenticated";

grant references on table "public"."tickets" to "authenticated";

grant select on table "public"."tickets" to "authenticated";

grant trigger on table "public"."tickets" to "authenticated";

grant truncate on table "public"."tickets" to "authenticated";

grant update on table "public"."tickets" to "authenticated";

grant delete on table "public"."tickets" to "service_role";

grant insert on table "public"."tickets" to "service_role";

grant references on table "public"."tickets" to "service_role";

grant select on table "public"."tickets" to "service_role";

grant trigger on table "public"."tickets" to "service_role";

grant truncate on table "public"."tickets" to "service_role";

grant update on table "public"."tickets" to "service_role";

grant delete on table "public"."waiver_uploads" to "anon";

grant insert on table "public"."waiver_uploads" to "anon";

grant references on table "public"."waiver_uploads" to "anon";

grant select on table "public"."waiver_uploads" to "anon";

grant trigger on table "public"."waiver_uploads" to "anon";

grant truncate on table "public"."waiver_uploads" to "anon";

grant update on table "public"."waiver_uploads" to "anon";

grant delete on table "public"."waiver_uploads" to "authenticated";

grant insert on table "public"."waiver_uploads" to "authenticated";

grant references on table "public"."waiver_uploads" to "authenticated";

grant select on table "public"."waiver_uploads" to "authenticated";

grant trigger on table "public"."waiver_uploads" to "authenticated";

grant truncate on table "public"."waiver_uploads" to "authenticated";

grant update on table "public"."waiver_uploads" to "authenticated";

grant delete on table "public"."waiver_uploads" to "service_role";

grant insert on table "public"."waiver_uploads" to "service_role";

grant references on table "public"."waiver_uploads" to "service_role";

grant select on table "public"."waiver_uploads" to "service_role";

grant trigger on table "public"."waiver_uploads" to "service_role";

grant truncate on table "public"."waiver_uploads" to "service_role";

grant update on table "public"."waiver_uploads" to "service_role";


