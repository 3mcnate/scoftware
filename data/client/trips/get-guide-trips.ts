import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

const getGuideTrips = (guideId: string, client: TypedSupabaseClient) => {
	return client
		.from("trip_guides")
		.select(
			`
			user_id,
			trip_id,
			trips (
				id,
				name,
				description,
				driver_spots,
				participant_spots,
				signup_status,
				start_date,
				end_date,
				picture_path,
				tickets (
					id,
					cancelled,
					type
				),
				trip_guides (
					user_id,
					profiles (
						id,
						first_name,
						last_name,
						avatar_path
					)
				)
			)
		`
		)
		.eq('user_id', guideId)
		.order('trips(start_date)', { ascending: true })
};

export const useGuideTrips = (guideId: string) => {
	const client = createClient();
	return useQuery(getGuideTrips(guideId, client));
};

const getAllTripInfo = (tripId: string, client: TypedSupabaseClient) => {
	return client
		.from('trips')
		.select(
			`
			id,
			created_at,
			updated_at,
			name,
			description,
			driver_spots,
			participant_spots,
			gear_questions,
			signup_status,
			what_to_bring,
			access_code,
			end_date,
			picture_path,
			start_date,
			meet,
			return,
			activity,
			difficulty,
			trail,
			prior_experience,
			location,
			native_land,
			car_mpgs,
			total_miles,
			breakfasts,
			lunches,
			dinners,
			snacks,
			other_costs,
			budget_confirmed
			`)
		.eq('id', tripId)
		.single();
}

export const useTrip = (tripId: string) => {
	const client = createClient();
	return useQuery(getAllTripInfo(tripId, client));
};