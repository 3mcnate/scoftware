
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import { differenceInCalendarDays } from "date-fns";
import {
  Loader2,
  Settings,
} from "lucide-react";
import { type TripData } from "@/data/client/trips/get-guide-trips";
import { useUpdateTrip } from "@/data/client/trips/use-update-trip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { formatDateTimeLocal } from "@/utils/date-time";
import { useUnsavedChangesPrompt } from "@/hooks/use-unsaved-changes-prompt";

const BasicInfoSchema = z
	.object({
		name: z.string().min(1, "Trip name is required"),
		start_date: z.string().min(1, "Start date is required"),
		end_date: z.string().min(1, "End date is required"),
		participant_spots: z.coerce.number().min(0, "Must be 0 or more"),
		driver_spots: z.coerce.number().min(0, "Must be 0 or more"),
	})
	.refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
		message: "End date must be after start date",
		path: ["end_date"],
	});

type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

export function BasicInfoSection({ trip }: { trip: TripData }) {
	const { mutateAsync: updateTrip, isPending } = useUpdateTrip();

	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { isDirty },
	} = useForm<BasicInfoFormData>({
		resolver: standardSchemaResolver(BasicInfoSchema),
		defaultValues: {
			name: trip.name,
			start_date: formatDateTimeLocal(trip.start_date),
			end_date: formatDateTimeLocal(trip.end_date),
			participant_spots: trip.participant_spots,
			driver_spots: trip.driver_spots,
		},
	});

	// eslint-disable-next-line react-hooks/incompatible-library
	const startDate = watch("start_date");
	const endDate = watch("end_date");
	const participantSpots = watch("participant_spots");
	const driverSpots = watch("driver_spots");

	const totalParticipants =
		(Number(participantSpots) || 0) + (Number(driverSpots) || 0);
	const totalGuides = trip.trip_guides.length;

	let durationLabel = "-";
	if (startDate && endDate) {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const nights = differenceInCalendarDays(end, start);
		durationLabel =
			nights === 0 ? "Day Trip" : `${nights} night${nights === 1 ? "" : "s"}`;
	}

	const onSubmit = async (data: BasicInfoFormData) => {
		await updateTrip(
			{
				id: trip.id,
				name: data.name,
				start_date: new Date(data.start_date).toISOString(),
				end_date: new Date(data.end_date).toISOString(),
				participant_spots: data.participant_spots,
				driver_spots: data.driver_spots,
			},
			{
				onSuccess: () => {
					toast.success("Trip info updated");
					reset(data);
				},
				onError: (err) => {
					toast.error("Failed to update trip info");
					console.error(err);
				},
			},
		);
	};

	useUnsavedChangesPrompt(isDirty);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<Settings className="h-4 w-4 text-muted-foreground" />
					<CardTitle className="text-base font-medium">Basic Info</CardTitle>
				</div>
				<CardDescription>Update trip name, dates, and capacity</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Trip Name</FieldLabel>
							<Controller
								control={control}
								name="name"
								render={({ field, fieldState: { error } }) => (
									<>
										<Input
											{...field}
											id="name"
											placeholder="e.g. Grand Canyon Expedition"
											aria-invalid={!!error}
										/>
										<FieldError errors={error ? [error] : undefined} />
									</>
								)}
							/>
						</Field>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Field>
								<FieldLabel htmlFor="start_date">Start Date & Time</FieldLabel>
								<Controller
									control={control}
									name="start_date"
									render={({ field, fieldState: { error } }) => (
										<>
											<Input
												{...field}
												id="start_date"
												type="datetime-local"
												aria-invalid={!!error}
											/>
											<FieldError errors={error ? [error] : undefined} />
										</>
									)}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="end_date">End Date & Time</FieldLabel>
								<Controller
									control={control}
									name="end_date"
									render={({ field, fieldState: { error } }) => (
										<>
											<Input
												{...field}
												id="end_date"
												type="datetime-local"
												aria-invalid={!!error}
											/>
											<FieldError errors={error ? [error] : undefined} />
											<FieldDescription>
												End time can be approximate
											</FieldDescription>
										</>
									)}
								/>
							</Field>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Field>
								<FieldLabel htmlFor="participant_spots">
									Participant Spots (Non-Drivers)
								</FieldLabel>
								<Controller
									control={control}
									name="participant_spots"
									render={({ field, fieldState: { error } }) => (
										<>
											<Input
												{...field}
												id="participant_spots"
												type="number"
												min={0}
												aria-invalid={!!error}
											/>
											<FieldError errors={error ? [error] : undefined} />
										</>
									)}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="driver_spots">Driver Spots</FieldLabel>
								<Controller
									control={control}
									name="driver_spots"
									render={({ field, fieldState: { error } }) => (
										<>
											<Input
												{...field}
												id="driver_spots"
												type="number"
												min={0}
												aria-invalid={!!error}
											/>
											<FieldError errors={error ? [error] : undefined} />
										</>
									)}
								/>
							</Field>
						</div>

						<div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground space-y-1">
							<div className="flex justify-between">
								<span>Total People:</span>
								<span className="font-medium text-foreground">
									{totalParticipants + totalGuides} ({totalParticipants}{" "}
									participants, {totalGuides} guides)
								</span>
							</div>
							<div className="flex justify-between">
								<span>Duration:</span>
								<span className="font-medium text-foreground">
									{durationLabel}
								</span>
							</div>
						</div>

						<div className="flex justify-end">
							<Button type="submit" disabled={isPending || !isDirty}>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
