import { useMutation } from "@tanstack/react-query";

type CreateTripParams = {
  name: string;
  start_date: string;
  end_date: string;
  participant_spots: number;
  driver_spots: number;
  guides: string[];
};

type CreateTripResponse = {
  tripId: string;
};

export const useCreateTrip = () => {
  return useMutation<CreateTripResponse, Error, CreateTripParams>({
    mutationFn: async (data) => {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create trip");
      }

      return response.json();
    },
  });
};
