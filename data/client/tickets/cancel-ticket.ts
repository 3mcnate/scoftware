import { useRevalidateTables } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation } from "@tanstack/react-query";

type CancelTicketVariables = {
  ticketId: string;
  refund?: boolean;
};

export const useCancelTicket = () => {
	const revalidate = useRevalidateTables([{ schema: "public", table: "tickets" }])

  return useMutation({
    mutationFn: async ({ ticketId, refund }: CancelTicketVariables) => {
      const response = await fetch(`/api/tickets/${ticketId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refund }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel ticket");
      }

      return response.json();
    },
    onSuccess: async () => { 
			await revalidate();
    }
  });
};
