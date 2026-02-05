import { useMemo } from "react";
import { calculateTripPrices, type TripPrices, type TripForPricing } from "@/utils/math";
import { useBudgetFormulas } from "@/data/client/budget/budget-formulas";
import type { TripData } from "@/data/client/trips/get-guide-trips";

export type { TripPrices };

export function useTripPrices(trip: TripData | null | undefined): TripPrices | null {
	const { data: formulasData } = useBudgetFormulas();

	return useMemo(() => {
		if (!trip || !formulasData) return null;

		const tripForPricing: TripForPricing = {
			breakfasts: trip.breakfasts,
			lunches: trip.lunches,
			dinners: trip.dinners,
			snacks: trip.snacks,
			total_miles: trip.total_miles,
			car_mpgs: trip.car_mpgs?.map(Number) ?? null,
			other_expenses: trip.other_expenses,
			participant_spots: trip.participant_spots,
			driver_spots: trip.driver_spots,
			num_guides: trip.trip_guides.length,
			start_date: trip.start_date,
			end_date: trip.end_date,
		};

		const calculated = calculateTripPrices(tripForPricing, formulasData.formulas);

		// Use override prices if provided
		return {
			member_price:
				trip.member_price_override !== null
					? Math.ceil(Number(trip.member_price_override))
					: calculated.member_price,
			nonmember_price:
				trip.nonmember_price_override !== null
					? Math.ceil(Number(trip.nonmember_price_override))
					: calculated.nonmember_price,
			driver_price:
				trip.driver_price_override !== null
					? Math.ceil(Number(trip.driver_price_override))
					: calculated.driver_price,
		};
	}, [trip, formulasData]);
}
