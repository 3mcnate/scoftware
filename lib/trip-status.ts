export const TRIP_STATUSES = [
	"draft",
	"ready_to_drop",
	"open",
	"waitlist",
	"closed",
	"cancelled",
	"completed",
] as const;

export type TripStatus = (typeof TRIP_STATUSES)[number];

export interface TripStatusInput {
	cancelled: boolean;
	startDate: string;
	endDate: string;
	isPublished: boolean;
	allowSignups: boolean;
	enableParticipantWaitlist: boolean;
	enableDriverWaitlist: boolean;
	participantCount: number;
	participantSpots: number;
	driverCount: number;
	driverSpots: number;
	/** Resolved publish date: coalesce(trip_settings override, cycle date) */
	publishDate: string | null;
	/** Resolved member signup date: coalesce(override, cycle date) */
	memberSignupDate: string | null;
	/** Resolved nonmember signup date: coalesce(override, cycle date) */
	nonmemberSignupDate: string | null;
	/** Resolved driver signup date: coalesce(override, cycle date) */
	driverSignupDate: string | null;
}

/**
 * Compute the display status for a trip.
 *
 * Priority order:
 * 1. cancelled — trip.cancelled is true
 * 2. completed — trip end_date has passed
 * 3. draft — trip has not been published
 * 4. closed — trip start_date has passed OR allow_signups is false
 * 5. waitlist — all spots full and waitlists enabled
 * 6. open — at least one signup date has passed
 * 7. ready_to_drop — published but not yet open
 */
export function computeTripStatus(input: TripStatusInput): TripStatus {
	const now = new Date();

	if (input.cancelled) {
		return "cancelled";
	}

	if (new Date(input.endDate) < now) {
		return "completed";
	}

	if (!input.isPublished) {
		return "draft";
	}

	if (new Date(input.startDate) < now || !input.allowSignups) {
		return "closed";
	}

	// // Check if spots are full and waitlists are enabled
	// const participantsFull = input.participantSpots > 0 &&
	// 	input.participantCount >= input.participantSpots;
	// const driversFull = input.driverSpots === 0 ||
	// 	input.driverCount >= input.driverSpots;

	const waitlistEnabled = input.enableParticipantWaitlist ||
		input.enableDriverWaitlist;
	if (waitlistEnabled) {
		return "waitlist";
	}

	// Check if any signup date has passed
	const signupDates = [
		input.memberSignupDate,
		input.nonmemberSignupDate,
		input.driverSignupDate,
	].filter(Boolean) as string[];

	const anySignupOpen = signupDates.some((d) => new Date(d) <= now);

	if (anySignupOpen) {
		return "open";
	}

	return "ready_to_drop";
}
