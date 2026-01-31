alter table "public"."trips" drop column "other_costs";

alter table "public"."trips" add column "other_expenses" jsonb;

grant delete on table "public"."budget_formulas" to "postgres";

grant insert on table "public"."budget_formulas" to "postgres";

grant references on table "public"."budget_formulas" to "postgres";

grant select on table "public"."budget_formulas" to "postgres";

grant trigger on table "public"."budget_formulas" to "postgres";

grant truncate on table "public"."budget_formulas" to "postgres";

grant update on table "public"."budget_formulas" to "postgres";


