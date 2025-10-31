alter table "public"."participant_info" add column "usc_id" text not null;

drop type "public"."trip_guide_role";

CREATE UNIQUE INDEX participant_info_usc_id_key ON public.participant_info USING btree (usc_id);

alter table "public"."participant_info" add constraint "participant_info_usc_id_check" CHECK ((length(usc_id) = 10)) not valid;

alter table "public"."participant_info" validate constraint "participant_info_usc_id_check";

alter table "public"."participant_info" add constraint "participant_info_usc_id_key" UNIQUE using index "participant_info_usc_id_key";


