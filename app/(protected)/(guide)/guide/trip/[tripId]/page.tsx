import { redirect } from "next/navigation";

export default async function GuideTripPage({
  params
}: {
  params: Promise<{ tripId: string }>;
}) {
	const { tripId } = await params;
  redirect(`/guide/trip/${tripId}/signups`);
}
