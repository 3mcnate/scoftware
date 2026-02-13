CREATE UNIQUE INDEX trip_ticket_type_unique ON public.stripe_products USING btree (trip_id, type);

alter table "public"."stripe_products" add constraint "trip_ticket_type_unique" UNIQUE using index "trip_ticket_type_unique";

grant delete on table "public"."stripe_products" to "postgres";

grant insert on table "public"."stripe_products" to "postgres";

grant references on table "public"."stripe_products" to "postgres";

grant select on table "public"."stripe_products" to "postgres";

grant trigger on table "public"."stripe_products" to "postgres";

grant truncate on table "public"."stripe_products" to "postgres";

grant update on table "public"."stripe_products" to "postgres";


