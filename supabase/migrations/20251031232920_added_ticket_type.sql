create type "public"."ticket_type" as enum ('member', 'nonmember', 'driver');

alter table "public"."tickets" add column "type" ticket_type not null;


