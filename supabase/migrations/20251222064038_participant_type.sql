create type "public"."participant_type" as enum ('participant', 'driver');

create type "public"."ticket_price_type" as enum ('member', 'nonmember', 'driver');

alter table "public"."trip_waivers" drop constraint "trip_ticket_type_unique";

drop index if exists "public"."trip_ticket_type_unique";

alter table "public"."tickets" alter column "type" set data type public.ticket_price_type using "type"::text::public.ticket_price_type;

alter table "public"."trip_prices" alter column "ticket_type" set data type public.ticket_price_type using "ticket_type"::text::public.ticket_price_type;

alter table "public"."trip_waivers" alter column "type" set data type public.participant_type using "type"::text::public.participant_type;

alter table "public"."waiver_templates" alter column "type" set data type public.ticket_price_type using "type"::text::public.ticket_price_type;

drop type "public"."ticket_type";


