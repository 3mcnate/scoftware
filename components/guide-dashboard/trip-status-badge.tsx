import { Badge } from "@/components/ui/badge";
import type { TripStatus } from "@/lib/trip-status";

const statusConfig: Record<TripStatus, { label: string; className: string; variant?: "secondary" }> = {
	draft: {
		label: "Draft",
		className: "",
		variant: "secondary",
	},
	ready_to_drop: {
		label: "Ready to Drop",
		className: "bg-green-500/10 text-green-600 border-transparent",
	},
	open: {
		label: "Signups Open",
		className: "bg-green-500/20 text-green-700 border-transparent",
	},
	waitlist: {
		label: "Waitlist",
		className: "bg-blue-500/20 text-blue-700 border-transparent",
	},
	closed: {
		label: "Closed",
		className: "bg-red-500/15 text-red-600 border-transparent",
	},
	cancelled: {
		label: "Cancelled",
		className: "",
		variant: "secondary",
	},
	completed: {
		label: "Completed",
		className: "",
		variant: "secondary",
	},
};

export function TripStatusBadge({ status }: { status: TripStatus }) {
	const config = statusConfig[status];
	return (
		<Badge variant={config.variant} className={config.className}>
			{config.label}
		</Badge>
	);
}
