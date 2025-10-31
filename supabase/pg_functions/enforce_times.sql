create or replace function enforce_times()
returns trigger
security definer
language plpgsql
as $$
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
$$ set search_path = '';


CREATE OR REPLACE FUNCTION public.add_auto_timestamps_triggers()
RETURNS void
LANGUAGE plpgsql AS $$
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
$$ set search_path = '';

SELECT public.add_auto_timestamps_triggers();
