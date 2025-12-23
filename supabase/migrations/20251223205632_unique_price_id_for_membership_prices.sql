CREATE UNIQUE INDEX membership_prices_stripe_price_id_key ON public.membership_prices USING btree (stripe_price_id);

alter table "public"."membership_prices" add constraint "membership_prices_stripe_price_id_key" UNIQUE using index "membership_prices_stripe_price_id_key";

grant delete on table "public"."membership_prices" to "postgres";

grant insert on table "public"."membership_prices" to "postgres";

grant references on table "public"."membership_prices" to "postgres";

grant select on table "public"."membership_prices" to "postgres";

grant trigger on table "public"."membership_prices" to "postgres";

grant truncate on table "public"."membership_prices" to "postgres";

grant update on table "public"."membership_prices" to "postgres";


