drop policy "Allow participants who have a ticket to view the trip, even if " on "public"."published_trips";

alter table "public"."trips" add column "cancelled" boolean not null default false;

grant delete on table "public"."stripe_products" to "postgres";

grant insert on table "public"."stripe_products" to "postgres";

grant references on table "public"."stripe_products" to "postgres";

grant select on table "public"."stripe_products" to "postgres";

grant trigger on table "public"."stripe_products" to "postgres";

grant truncate on table "public"."stripe_products" to "postgres";

grant update on table "public"."stripe_products" to "postgres";


  create policy "Allow participants who have a ticket to view the trip, even if "
  on "public"."published_trips"
  as permissive
  for select
  to authenticated
using ((public.has_trip_ticket(( SELECT auth.uid() AS uid), id) OR public.authorize('guide'::public.user_role)));



