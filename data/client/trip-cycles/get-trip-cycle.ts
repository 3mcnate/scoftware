import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryData } from "@supabase/supabase-js";

function getTripCycleForTrip(startDate: Date) {
	const client = createClient();
	return client.from("trip_cycles")
		.select(`
				id,
				created_at,
				updated_at,
				name,
				starts_at,
				ends_at,
				trips_published_at,
				member_signups_start_at,
				nonmember_signups_start_at,
				driver_signups_start_at,
				range,
				trip_feedback_form,
				guide_post_trip_form
		`)
		.lte("starts_at", startDate.toISOString())
		.gte("ends_at", startDate.toISOString())
		.maybeSingle();
}

export function useTripCycleByDate(startDate: Date)
{
	return useQuery(getTripCycleForTrip(startDate))
}

export type TripCycle = QueryData<ReturnType<typeof getTripCycleForTrip>>