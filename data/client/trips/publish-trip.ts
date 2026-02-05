import { useMutation, useQueryClient } from "@tanstack/react-query";

type PublishTripParams = {
	tripId: string;
};

type PublishTripResponse = {
	success: boolean;
	tripId: string;
	prices: {
		member: number;
		nonmember: number;
		driver: number | null;
	};
};

type PublishTripError = {
	error: string;
	missingFields?: string[];
};

export const usePublishTrip = () => {
	const queryClient = useQueryClient();

	return useMutation<PublishTripResponse, PublishTripError, PublishTripParams>({
		mutationFn: async (data) => {
			const response = await fetch("/api/trips/publish", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw result;
			}

			return result;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["trips", variables.tripId] });
		},
	});
};
