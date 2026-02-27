import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryData } from "@supabase/supabase-js";

function getAllTripCycles() {
	const client = createClient();
	return client.from("trip_cycles")
		.select(`
			id,
			name,
			starts_at,
			ends_at,
			trips_published_at,
			member_signups_start_at,
			nonmember_signups_start_at,
			driver_signups_start_at
		`)
		.order("starts_at", { ascending: true });
}

export function useTripCycles() {
	return useQuery(getAllTripCycles());
}

export type TripCycleRow = NonNullable<
	QueryData<ReturnType<typeof getAllTripCycles>>
>[number];

/** Find the trip cycle that contains the given date */
export function findCycleForDate(
	cycles: TripCycleRow[] | undefined | null,
	startDate: string
): TripCycleRow | undefined {
	if (!cycles) return undefined;
	const d = new Date(startDate);
	return cycles.find(
		(c) => new Date(c.starts_at) <= d && d <= new Date(c.ends_at)
	);
}
