alter table "public"."hard_trip_participants" add column "updated_at" timestamp with time zone not null default now();

alter table "public"."tickets" add column "amount_paid" numeric not null;

CREATE TRIGGER handle_new_user_trg AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


