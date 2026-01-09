import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryData } from "@supabase/supabase-js";

const getTripTickets = (tripId: string, client: TypedSupabaseClient) => {
  return client
    .from("tickets")
    .select(`
      id,
			user_id,
			trip_id,
			created_at,
			updated_at,
			cancelled,
			refunded,
			cancelled_at,
			stripe_payment_id,
			type,
			amount_paid,
			stripe_refund_id,
			receipt_url,
			driver_waiver_filepath,
			driver_waiver_signed_at,
			waiver_filepath,
			waiver_signed_at,
      user:profiles (
				id,
				first_name,
				last_name,
				email,
				phone,
				avatar_path,
        participant_info (
          allergies,
          dietary_restrictions,
          medications,
          medical_history,
          emergency_contact_name,
          emergency_contact_phone_number,
          emergency_contact_relationship,
          health_insurance_provider,
          health_insurance_member_id,
          health_insurance_group_number,
          health_insurance_bin_number,
          usc_id,
          degree_path,
          graduation_year,
          graduation_season
        )
			)
    `)
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });
};

type TripTicketsQuery = ReturnType<typeof getTripTickets>;
export type TripTicket = QueryData<TripTicketsQuery>[number];

export const useTripTickets = (tripId: string) => {
  const client = createClient();
  return useQuery(getTripTickets(tripId, client));
};
