
  create table "public"."budget_formulas" (
    "formulas" text not null,
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."budget_formulas" enable row level security;

CREATE UNIQUE INDEX budget_formulas_pkey ON public.budget_formulas USING btree (formulas);

alter table "public"."budget_formulas" add constraint "budget_formulas_pkey" PRIMARY KEY using index "budget_formulas_pkey";

grant delete on table "public"."budget_formulas" to "anon";

grant insert on table "public"."budget_formulas" to "anon";

grant references on table "public"."budget_formulas" to "anon";

grant select on table "public"."budget_formulas" to "anon";

grant trigger on table "public"."budget_formulas" to "anon";

grant truncate on table "public"."budget_formulas" to "anon";

grant update on table "public"."budget_formulas" to "anon";

grant delete on table "public"."budget_formulas" to "authenticated";

grant insert on table "public"."budget_formulas" to "authenticated";

grant references on table "public"."budget_formulas" to "authenticated";

grant select on table "public"."budget_formulas" to "authenticated";

grant trigger on table "public"."budget_formulas" to "authenticated";

grant truncate on table "public"."budget_formulas" to "authenticated";

grant update on table "public"."budget_formulas" to "authenticated";

grant delete on table "public"."budget_formulas" to "postgres";

grant insert on table "public"."budget_formulas" to "postgres";

grant references on table "public"."budget_formulas" to "postgres";

grant select on table "public"."budget_formulas" to "postgres";

grant trigger on table "public"."budget_formulas" to "postgres";

grant truncate on table "public"."budget_formulas" to "postgres";

grant update on table "public"."budget_formulas" to "postgres";

grant delete on table "public"."budget_formulas" to "service_role";

grant insert on table "public"."budget_formulas" to "service_role";

grant references on table "public"."budget_formulas" to "service_role";

grant select on table "public"."budget_formulas" to "service_role";

grant trigger on table "public"."budget_formulas" to "service_role";

grant truncate on table "public"."budget_formulas" to "service_role";

grant update on table "public"."budget_formulas" to "service_role";


  create policy "Admins can update"
  on "public"."budget_formulas"
  as permissive
  for update
  to authenticated
using (public.authorize('admin'::public.user_role))
with check (public.authorize('admin'::public.user_role));



  create policy "Guides can select"
  on "public"."budget_formulas"
  as permissive
  for select
  to authenticated
using (public.authorize('guide'::public.user_role));



