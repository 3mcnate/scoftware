"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useParticipantInfo } from "@/data/participant/get-participant-info";
import { MyInformationTab } from "@/components/participant-dashboard/my-information-tab";

export default function MyInformationPage() {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";

  const { data: existingInfo, isPending } = useParticipantInfo(userId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initialData = existingInfo?.[0] ?? null;

  return <MyInformationTab initialData={initialData} />;
}
