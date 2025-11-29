"use client";

import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { useParticipantInfo } from "@/data/participant/get-participant-info";
import { useAuth } from "@/hooks/use-auth";

interface ParticipantInfoRequiredAlertProps {
  showLink?: boolean;
}

export function ParticipantInfoRequiredAlert({
  showLink = true,
}: ParticipantInfoRequiredAlertProps) {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";
  const { data: participantInfo, isPending } = useParticipantInfo(userId);

  if (auth.status !== "authenticated" || isPending) {
    return null;
  }

  const hasFilledOutInfo = participantInfo && participantInfo.length > 0;

  if (hasFilledOutInfo) {
    return null;
  }

  return (
    <Alert className="bg-warning/20 border-warning/30">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <div className="flex flex-1 items-center justify-between gap-4">
        <div>
          <AlertTitle>Information Required</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            You must fill out your personal information before signing up for
            trips.
          </AlertDescription>
        </div>
        {showLink && (
          <Button variant="outline" className="shrink-0" asChild>
            <Link href="/participant/my-information">
              Fill Out Info
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </Alert>
  );
}
