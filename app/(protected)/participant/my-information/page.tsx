"use client";

import { useAuth } from "@/hooks/use-auth";
import { useParticipantInfo } from "@/data/participant/get-participant-info";
import {
  MyInformationTab,
  MyInformationTabSkeleton,
} from "@/components/participant-dashboard/my-information-tab";
import { ParticipantInfoRequiredAlert } from "@/components/participant-dashboard/participant-info-required-alert";

export default function MyInformationPage() {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";

  const { data: existingInfo, isPending } = useParticipantInfo(userId);

  if (isPending) {
    return <MyInformationTabSkeleton />;
  }

  const initialData = existingInfo?.[0] ?? null;

  return (
    <div className="space-y-6">
      <ParticipantInfoRequiredAlert showLink={false} />
      <MyInformationTab initialData={initialData} />
    </div>
  );
}
