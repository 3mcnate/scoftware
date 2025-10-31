set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_auto_timestamps_triggers()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  tbl record;
  has_timestamp_cols boolean;
BEGIN
  FOR tbl IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
  LOOP
    -- Does the table have created_at or updated_at columns?
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = tbl.table_name
        AND column_name IN ('created_at', 'updated_at')
    ) INTO has_timestamp_cols;

    IF has_timestamp_cols THEN
	begin
		EXECUTE format('
          DROP TRIGGER %I_enforce_times_trg ON public.%I;
        ', tbl.table_name, tbl.table_name);
        EXECUTE format('
          CREATE TRIGGER %I_enforce_times_trg
          BEFORE INSERT OR UPDATE ON public.%I
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_times();
        ', tbl.table_name, tbl.table_name);
	exception
		when others then
			raise notice 'something went wrong adding trigger to %', tbl.table_name;
	end;
    END IF;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.enforce_times()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
	has_created_at boolean;
	has_updated_at boolean;
begin

	SELECT EXISTS (
    SELECT 1
    FROM pg_attribute
    WHERE attrelid = format('%I.%I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass
      AND attname = 'updated_at'
      AND NOT attisdropped
  	)
 	INTO has_updated_at;

	SELECT EXISTS (
    SELECT 1
    FROM pg_attribute
    WHERE attrelid = format('%I.%I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass
      AND attname = 'created_at'
      AND NOT attisdropped
  	)
 	INTO has_created_at;

	if has_created_at then

		if TG_OP = 'INSERT' then
			new.created_at = now();
		else
			new.created_at = old.created_at;
		end if;
	
	end if;

	if has_updated_at then

		new.updated_at = now();

	end if;

	return new;

end;
$function$
;

CREATE TRIGGER checkout_sessions_enforce_times_trg BEFORE INSERT OR UPDATE ON public.checkout_sessions FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER driver_info_enforce_times_trg BEFORE INSERT OR UPDATE ON public.driver_info FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER form_responses_enforce_times_trg BEFORE INSERT OR UPDATE ON public.form_responses FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER forms_enforce_times_trg BEFORE INSERT OR UPDATE ON public.forms FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER guide_info_enforce_times_trg BEFORE INSERT OR UPDATE ON public.guide_info FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER hard_trip_participants_enforce_times_trg BEFORE INSERT OR UPDATE ON public.hard_trip_participants FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER memberships_enforce_times_trg BEFORE INSERT OR UPDATE ON public.memberships FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER participant_info_enforce_times_trg BEFORE INSERT OR UPDATE ON public.participant_info FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER prices_enforce_times_trg BEFORE INSERT OR UPDATE ON public.prices FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER roles_enforce_times_trg BEFORE INSERT OR UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER tickets_enforce_times_trg BEFORE INSERT OR UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER trip_budgets_enforce_times_trg BEFORE INSERT OR UPDATE ON public.trip_budgets FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER trip_cycles_enforce_times_trg BEFORE INSERT OR UPDATE ON public.trip_cycles FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER trip_ticket_info_enforce_times_trg BEFORE INSERT OR UPDATE ON public.trip_ticket_info FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER trips_enforce_times_trg BEFORE INSERT OR UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER waitlist_signups_enforce_times_trg BEFORE INSERT OR UPDATE ON public.waitlist_signups FOR EACH ROW EXECUTE FUNCTION enforce_times();

CREATE TRIGGER waiver_uploads_enforce_times_trg BEFORE INSERT OR UPDATE ON public.waiver_uploads FOR EACH ROW EXECUTE FUNCTION enforce_times();


