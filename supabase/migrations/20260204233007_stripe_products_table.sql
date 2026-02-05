
  create table "public"."stripe_products" (
    "stripe_product_id" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "trip_id" uuid,
    "name" text not null,
    "type" public.participant_type not null
      );


alter table "public"."stripe_products" enable row level security;

CREATE UNIQUE INDEX stripe_products_pkey ON public.stripe_products USING btree (stripe_product_id);

alter table "public"."stripe_products" add constraint "stripe_products_pkey" PRIMARY KEY using index "stripe_products_pkey";

alter table "public"."stripe_products" add constraint "stripe_products_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE SET NULL not valid;

alter table "public"."stripe_products" validate constraint "stripe_products_trip_id_fkey";

alter table "public"."trip_prices" add constraint "trip_prices_stripe_product_id_fkey" FOREIGN KEY (stripe_product_id) REFERENCES public.stripe_products(stripe_product_id) not valid;

alter table "public"."trip_prices" validate constraint "trip_prices_stripe_product_id_fkey";

grant delete on table "public"."stripe_products" to "anon";

grant insert on table "public"."stripe_products" to "anon";

grant references on table "public"."stripe_products" to "anon";

grant select on table "public"."stripe_products" to "anon";

grant trigger on table "public"."stripe_products" to "anon";

grant truncate on table "public"."stripe_products" to "anon";

grant update on table "public"."stripe_products" to "anon";

grant delete on table "public"."stripe_products" to "authenticated";

grant insert on table "public"."stripe_products" to "authenticated";

grant references on table "public"."stripe_products" to "authenticated";

grant select on table "public"."stripe_products" to "authenticated";

grant trigger on table "public"."stripe_products" to "authenticated";

grant truncate on table "public"."stripe_products" to "authenticated";

grant update on table "public"."stripe_products" to "authenticated";

grant delete on table "public"."stripe_products" to "postgres";

grant insert on table "public"."stripe_products" to "postgres";

grant references on table "public"."stripe_products" to "postgres";

grant select on table "public"."stripe_products" to "postgres";

grant trigger on table "public"."stripe_products" to "postgres";

grant truncate on table "public"."stripe_products" to "postgres";

grant update on table "public"."stripe_products" to "postgres";

grant delete on table "public"."stripe_products" to "service_role";

grant insert on table "public"."stripe_products" to "service_role";

grant references on table "public"."stripe_products" to "service_role";

grant select on table "public"."stripe_products" to "service_role";

grant trigger on table "public"."stripe_products" to "service_role";

grant truncate on table "public"."stripe_products" to "service_role";

grant update on table "public"."stripe_products" to "service_role";


