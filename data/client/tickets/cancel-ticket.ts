import { useTripTickets } from "@/data/client/tickets/get-trip-tickets";
import { useMutation } from "@tanstack/react-query";

type CancelTicketVariables = {
  ticketId: string;
  refund?: boolean;
};

export const useCancelTicket = (tripId: string) => {
	const { refetch } = useTripTickets(tripId)

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
			await refetch();
    }
  });
};
