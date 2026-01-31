import { getAllTripInfo } from "@/data/client/trips/get-guide-trips";
import { QueryData } from "@supabase/supabase-js";

export type TripData = QueryData<ReturnType<typeof getAllTripInfo>>;
