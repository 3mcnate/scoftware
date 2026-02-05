import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryData } from "@supabase/supabase-js";

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
				start_date,
				end_date,
				picture_path,
				published_trips (
					id
				),
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

export const getAllTripInfo = (tripId: string, client: TypedSupabaseClient) => {
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
			what_to_bring,
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
			other_expenses,
			budget_confirmed,
			member_price_override,
			nonmember_price_override,
			driver_price_override,
			access_code,
			trip_settings (
				trip_id,
				created_at,
				updated_at,
				allow_signups,
				enable_participant_waitlist,
				enable_driver_waitlist,
				require_code,
				publish_date_override,
				driver_signup_date_override,
				member_signup_date_override,
				nonmember_signup_date_override,
				hide_trip
			),
			published_trips (
				id
			),
			trip_guides (
				profiles (
					id,
					first_name,
					last_name,
					phone,
					avatar_path,
					email
				)
			)
			`)
		.eq('id', tripId)
		.single();
}

export const useTrip = (tripId: string) => {
	const client = createClient();
	return useQuery(getAllTripInfo(tripId, client));
};

export type TripData = QueryData<ReturnType<typeof getAllTripInfo>>;