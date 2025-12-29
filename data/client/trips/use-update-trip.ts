import { createClient } from "@/utils/supabase/browser";
import { useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useUpdateTrip = () => {
  const client = createClient();
  return useUpdateMutation(client.from("trips"), ["id"], "*");
};
