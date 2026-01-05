import { createClient } from "@/utils/supabase/browser";
import { useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useUpdateTicket = () => {
  const client = createClient();
  return useUpdateMutation(client.from("tickets"), ["id"], null);
};
