import { compile } from "mathjs";
import { differenceInCalendarDays } from "date-fns";

export type BudgetInputs = {
	breakfasts: number;
	lunches: number;
	dinners: number;
	snacks: number;
	total_miles: number;
	num_cars: number;
	average_mpg: number;
	total_other_expenses: number;
	num_participants: number;
	num_participant_drivers: number;
	num_guides: number;
	num_nights: number;
}

export type BudgetTotals = {
	driver_price: number;
	member_price: number;
	nonmember_price: number;
	gas_budget: number;
	food_budget: number;
	other_budget: number;
	total_budget: number;
};

export type TripPrices = Pick<BudgetTotals, "member_price" | "nonmember_price" | "driver_price">;

export type TripForPricing = {
	breakfasts: number | null;
	lunches: number | null;
	dinners: number | null;
	snacks: number | null;
	total_miles: number | null;
	car_mpgs: number[] | null;
	other_expenses: unknown;
	participant_spots: number;
	driver_spots: number;
	num_guides: number;
	start_date: string;
	end_date: string;
};

/**
 * Returns 1 if the list is empty or the avg mpgs are 0.
 */
export function getAverageMPGs(mpgs: number[]): number {
  const valid = mpgs.filter(n => Number.isFinite(n));

  if (valid.length === 0) return 1;

  const sum = valid.reduce((acc, n) => acc + n, 0);
	if (sum === 0) return 1;
  return sum / valid.length;
}

export function formatCurrency(amount: number): string {
	return amount.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	});
}

/**
 * Calculates trip prices using budget formulas.
 * Used by both server-side API routes and client-side hooks.
 */
export function calculateTripPrices(trip: TripForPricing, formulas: string): TripPrices {
	const compiledFormulas = compile(formulas);

	const otherExpenses = trip.other_expenses as { cost: number }[] | null;
	const totalOtherExpenses = otherExpenses?.reduce((sum, e) => sum + (e.cost ?? 0), 0) ?? 0;

	const inputs: BudgetInputs = {
		breakfasts: trip.breakfasts ?? 0,
		lunches: trip.lunches ?? 0,
		dinners: trip.dinners ?? 0,
		snacks: trip.snacks ?? 0,
		total_miles: trip.total_miles ?? 0,
		num_cars: trip.car_mpgs?.length ?? 0,
		average_mpg: getAverageMPGs(trip.car_mpgs ?? []),
		total_other_expenses: totalOtherExpenses,
		num_participants: trip.participant_spots,
		num_participant_drivers: trip.driver_spots,
		num_guides: trip.num_guides,
		num_nights: differenceInCalendarDays(
			new Date(trip.end_date),
			new Date(trip.start_date),
		),
	};

	const scope: Map<string, number> = new Map(Object.entries(inputs));
	compiledFormulas.evaluate(scope);

	return {
		driver_price: Math.ceil(scope.get("driver_price") ?? 0),
		member_price: Math.ceil(scope.get("member_price") ?? 0),
		nonmember_price: Math.ceil(scope.get("nonmember_price") ?? 0),
	};
}