create table "public"."prices" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "stripe_participant_product_id" text not null,
    "stripe_member_price_id" text not null,
    "stripe_nonmember_price_id" text not null,
    "stripe_driver_product_id" text,
    "stripe_driver_price_id" text,
    "member_price" numeric not null,
    "nonmember_price" numeric not null,
    "driver_price" numeric
);


alter table "public"."prices" enable row level security;

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE UNIQUE INDEX prices_stripe_driver_price_id_key ON public.prices USING btree (stripe_driver_price_id);

CREATE UNIQUE INDEX prices_stripe_driver_product_id_key ON public.prices USING btree (stripe_driver_product_id);

CREATE UNIQUE INDEX prices_stripe_member_price_id_key ON public.prices USING btree (stripe_member_price_id);

CREATE UNIQUE INDEX prices_stripe_nonmember_price_id_key ON public.prices USING btree (stripe_nonmember_price_id);

CREATE UNIQUE INDEX prices_stripe_participant_product_id_key ON public.prices USING btree (stripe_participant_product_id);

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."prices" add constraint "prices_id_fkey" FOREIGN KEY (id) REFERENCES trips(id) ON DELETE CASCADE not valid;

alter table "public"."prices" validate constraint "prices_id_fkey";

alter table "public"."prices" add constraint "prices_stripe_driver_price_id_key" UNIQUE using index "prices_stripe_driver_price_id_key";

alter table "public"."prices" add constraint "prices_stripe_driver_product_id_key" UNIQUE using index "prices_stripe_driver_product_id_key";

alter table "public"."prices" add constraint "prices_stripe_member_price_id_key" UNIQUE using index "prices_stripe_member_price_id_key";

alter table "public"."prices" add constraint "prices_stripe_nonmember_price_id_key" UNIQUE using index "prices_stripe_nonmember_price_id_key";

alter table "public"."prices" add constraint "prices_stripe_participant_product_id_key" UNIQUE using index "prices_stripe_participant_product_id_key";

grant delete on table "public"."prices" to "anon";

grant insert on table "public"."prices" to "anon";

grant references on table "public"."prices" to "anon";

grant select on table "public"."prices" to "anon";

grant trigger on table "public"."prices" to "anon";

grant truncate on table "public"."prices" to "anon";

grant update on table "public"."prices" to "anon";

grant delete on table "public"."prices" to "authenticated";

grant insert on table "public"."prices" to "authenticated";

grant references on table "public"."prices" to "authenticated";

grant select on table "public"."prices" to "authenticated";

grant trigger on table "public"."prices" to "authenticated";

grant truncate on table "public"."prices" to "authenticated";

grant update on table "public"."prices" to "authenticated";

grant delete on table "public"."prices" to "service_role";

grant insert on table "public"."prices" to "service_role";

grant references on table "public"."prices" to "service_role";

grant select on table "public"."prices" to "service_role";

grant trigger on table "public"."prices" to "service_role";

grant truncate on table "public"."prices" to "service_role";

grant update on table "public"."prices" to "service_role";


