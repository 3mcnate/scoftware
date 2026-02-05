"use client";

import Link from "next/link";
import Image from "next/image";
import { format, isSameDay } from "date-fns";
import { getTripPictureUrl } from "@/data/client/storage/trip-pictures";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	AlertCircle,
	Calendar,
	DollarSign,
	Clock,
	CheckCircle2,
	ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { usePublishTrip } from "@/data/client/trips/publish-trip";
import { useTripPrices } from "@/hooks/use-trip-prices";
import { useTripCycleByDate } from "@/data/client/trip-cycles/get-trip-cycle";
import { formatCurrency } from "@/utils/math";
import type { TripData } from "@/data/client/trips/get-guide-trips";

const REQUIRED_FIELDS = [
	"description",
	"what_to_bring",
	"picture_path",
	"activity",
	"difficulty",
	"location",
	"meet",
	"native_land",
	"prior_experience",
	"return",
	"trail",
	"budget_confirmed",
] as const;

type FieldInfo = {
	field: string;
	label: string;
	tab: string;
};

const FIELD_TO_TAB: Record<string, FieldInfo> = {
	description: { field: "description", label: "Description", tab: "trip-page#description" },
	what_to_bring: { field: "what_to_bring", label: "What to Bring", tab: "trip-page#packing-list" },
	picture_path: { field: "picture_path", label: "Trip Picture", tab: "trip-page#picture" },
	activity: { field: "activity", label: "Activity", tab: "trip-page#activity" },
	difficulty: { field: "difficulty", label: "Difficulty", tab: "trip-page#difficulty" },
	location: { field: "location", label: "Location", tab: "trip-page#location" },
	meet: { field: "meet", label: "Meet Location", tab: "trip-page#meet" },
	native_land: { field: "native_land", label: "Native Land", tab: "trip-page#native_land" },
	prior_experience: { field: "prior_experience", label: "Prior Experience", tab: "trip-page#prior_experience" },
	return: { field: "return", label: "Return Location", tab: "trip-page#return" },
	trail: { field: "trail", label: "Trail", tab: "trip-page#trail" },
	budget_confirmed: { field: "budget_confirmed", label: "Submit your budget", tab: "budget#confirm" },
};

type PublishTripDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	trip: TripData;
};

export function PublishTripDialog({
	open,
	onOpenChange,
	trip,
}: PublishTripDialogProps) {
	const isAlreadyPublished = !!trip.published_trips;
	const prices = useTripPrices(trip);
	const { data: tripCycle, isLoading: isTripCycleLoading } = useTripCycleByDate(
		new Date(trip.start_date)
	);
	const { mutateAsync: publishTrip, isPending } = usePublishTrip();

	// Check for missing fields
	const missingFields = REQUIRED_FIELDS.filter((field) => {
		const value = trip[field];
		if (field === "budget_confirmed") {
			return !value;
		}
		return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
	});

	const hasMissingFields = missingFields.length > 0;

	// Get publish dates (use overrides if available)
	const publishDate = trip.trip_settings?.publish_date_override
		? new Date(trip.trip_settings.publish_date_override)
		: tripCycle?.trips_published_at
			? new Date(tripCycle.trips_published_at)
			: null;

	const memberSignupDate = trip.trip_settings?.member_signup_date_override
		? new Date(trip.trip_settings.member_signup_date_override)
		: tripCycle?.member_signups_start_at
			? new Date(tripCycle.member_signups_start_at)
			: null;

	const nonmemberSignupDate = trip.trip_settings?.nonmember_signup_date_override
		? new Date(trip.trip_settings.nonmember_signup_date_override)
		: tripCycle?.nonmember_signups_start_at
			? new Date(tripCycle.nonmember_signups_start_at)
			: null;

	const driverSignupDate = trip.trip_settings?.driver_signup_date_override
		? new Date(trip.trip_settings.driver_signup_date_override)
		: tripCycle?.driver_signups_start_at
			? new Date(tripCycle.driver_signups_start_at)
			: null;

	const handlePublish = async () => {
		try {
			await publishTrip({ tripId: trip.id });
			toast.success(isAlreadyPublished ? "Trip updated successfully" : "Trip published successfully");
			onOpenChange(false);
		} catch (error) {
			const err = error as { error?: string; missingFields?: string[] };
			toast.error(err.error || "Failed to publish trip");
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!isPending) {
			onOpenChange(open);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-lg max-h-[80vh] overflow-scroll">
				<DialogHeader>
					<DialogTitle>
						{isAlreadyPublished ? "Update Published Trip" : "Publish Trip"}
					</DialogTitle>
					<DialogDescription>
						{isAlreadyPublished
							? "Update the public trip listing with the latest information."
							: "Make this trip visible to participants and create ticket prices."}
					</DialogDescription>
				</DialogHeader>

				{hasMissingFields ? (
					<Alert variant="default">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Missing Required Information</AlertTitle>
						<AlertDescription className="mt-2">
							<p className="mb-2">
								Please complete the following fields before publishing:
							</p>
							<ul className="space-y-1">
								{missingFields.map((field) => {
									const info = FIELD_TO_TAB[field];
									return (
										<li key={field}>
											<Link
												href={`/guide/trip/${trip.id}/${info.tab}`}
												className="text-destructive-foreground underline hover:no-underline inline-flex items-center gap-1"
												onClick={() => onOpenChange(false)}
											>
												{info.label}
												<ExternalLink className="h-3 w-3" />
											</Link>
										</li>
									);
								})}
							</ul>
						</AlertDescription>
					</Alert>
				) : (
					<div className="space-y-4">
						{/* Trip Info */}
						<div className="rounded-lg border p-4 space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="font-semibold">{trip.name}</h4>
								{isAlreadyPublished && (
									<Badge variant="secondary" className="gap-1">
										<CheckCircle2 className="h-3 w-3" />
										Published
									</Badge>
								)}
							</div>
							{trip.picture_path && (
								<div className="relative rounded-md overflow-hidden aspect-video w-full">
									<Image
										src={getTripPictureUrl(trip.picture_path)}
										alt={trip.name}
										fill
										className="object-cover"
									/>
								</div>
							)}
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Calendar className="h-4 w-4" />
								<span>
									{isSameDay(new Date(trip.start_date), new Date(trip.end_date))
										? `${format(new Date(trip.start_date), "EEEE, MMMM d, yyyy @ h:mm a")} -> ${format(new Date(trip.end_date), "h:mm a")}`
										: `${format(new Date(trip.start_date), "EEEE, MMMM d, yyyy @ h:mm a")} -> ${format(new Date(trip.end_date), "EEEE, MMMM d, yyyy @ h:mm a")}`}
								</span>
							</div>
						</div>

						{/* Prices */}
						{prices && (
							<div className="rounded-lg border p-4 space-y-3">
								<div className="flex items-center gap-2">
									<DollarSign className="h-4 w-4 text-muted-foreground" />
									<h4 className="font-medium">Ticket Prices</h4>
								</div>
								<div className="grid grid-cols-2 gap-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Member:</span>
										<span className="font-medium">
											{formatCurrency(prices.member_price)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Non-member:</span>
										<span className="font-medium">
											{formatCurrency(prices.nonmember_price)}
										</span>
									</div>
									{trip.driver_spots > 0 && (
										<div className="flex justify-between col-span-2">
											<span className="text-muted-foreground">Driver:</span>
											<span className="font-medium">
												{formatCurrency(prices.driver_price)}
											</span>
										</div>
									)}
								</div>
								{(trip.member_price_override !== null ||
									trip.nonmember_price_override !== null ||
									trip.driver_price_override !== null) && (
									<p className="text-xs text-muted-foreground">
										* Using override prices
									</p>
								)}
							</div>
						)}

						{/* Publish Schedule */}
						{!isTripCycleLoading && (publishDate || memberSignupDate) && (
							<div className="rounded-lg border p-4 space-y-3">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<h4 className="font-medium">Signup Schedule</h4>
								</div>
								<div className="space-y-2 text-sm">
									{publishDate && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Trip Published:</span>
											<span>{format(publishDate, "MMM d, yyyy 'at' h:mm a")}</span>
										</div>
									)}
									{memberSignupDate && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Member Signups:</span>
											<span>{format(memberSignupDate, "MMM d, yyyy 'at' h:mm a")}</span>
										</div>
									)}
									{nonmemberSignupDate && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Non-member Signups:</span>
											<span>{format(nonmemberSignupDate, "MMM d, yyyy 'at' h:mm a")}</span>
										</div>
									)}
									{trip.driver_spots > 0 && driverSignupDate && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Driver Signups:</span>
											<span>{format(driverSignupDate, "MMM d, yyyy 'at' h:mm a")}</span>
										</div>
									)}
								</div>
								{(trip.trip_settings?.publish_date_override ||
									trip.trip_settings?.member_signup_date_override ||
									trip.trip_settings?.nonmember_signup_date_override ||
									trip.trip_settings?.driver_signup_date_override) && (
									<p className="text-xs text-muted-foreground">
										* Using custom schedule overrides
									</p>
								)}
							</div>
						)}
					</div>
				)}

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => handleOpenChange(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button onClick={handlePublish} disabled={isPending || hasMissingFields}>
						{isPending && <Spinner />}
						{isAlreadyPublished ? "Update Trip" : "Publish Trip"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
