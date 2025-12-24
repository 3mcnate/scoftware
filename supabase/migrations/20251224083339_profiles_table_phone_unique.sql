CREATE UNIQUE INDEX profiles_phone_key ON public.profiles USING btree (phone);

alter table "public"."profiles" add constraint "profiles_phone_key" UNIQUE using index "profiles_phone_key";


