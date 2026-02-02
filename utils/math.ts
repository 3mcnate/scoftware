export interface CalculateBudgetInputs {
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