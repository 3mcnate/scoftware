alter table "public"."waitlist_signups" add column "ticket_type" public.participant_type not null default 'participant'::public.participant_type;


