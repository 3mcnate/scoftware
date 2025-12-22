"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileCheck, ExternalLink, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createClient } from "@/utils/supabase/browser";
import { useState } from "react";
import { toast } from "sonner";

export default function WaiverSuccessPage() {
  const searchParams = useSearchParams();
  const filepath = searchParams.get("filepath");
  const signatureId = searchParams.get("signatureId");
  const signedAt = searchParams.get("signedAt");
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = signedAt
    ? new Date(signedAt).toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Los_Angeles",
      })
    : null;

  const handleViewWaiver = async () => {
    if (!filepath) return;
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("waivers")
      .createSignedUrl(filepath, 60);

    setIsLoading(false);
    if (error || !data?.signedUrl) {
      toast.error("Failed to load waiver");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const handleDownloadWaiver = async () => {
    if (!filepath) return;
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("waivers")
      .createSignedUrl(filepath, 60, { download: "waiver.pdf" });

    setIsLoading(false);
    if (error || !data?.signedUrl) {
      toast.error("Failed to download waiver");
      return;
    }
    window.location.href = data.signedUrl;
  };

  return (
    <div className="container max-w-2xl py-8 mx-auto">
      <Empty className="border-2 border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-green-100 dark:bg-green-900">
            <FileCheck className="h-6 w-6 text-green-700 dark:text-green-400" />
          </EmptyMedia>
          <EmptyTitle className="text-green-700 dark:text-green-400">
            Waiver Signed Successfully
          </EmptyTitle>
          <EmptyDescription>
            You can view the signed waiver below. Please save it for your
            records. You can also access it any time from the Trips page in your
            dashboard.
          </EmptyDescription>
        </EmptyHeader>

        <div className="space-y-1 text-sm text-muted-foreground">
          {formattedDate && (
            <div>
              <span className="font-medium">Signed at:</span> {formattedDate}{" "}
              (Pacific Time)
            </div>
          )}
          {signatureId && (
            <div>
              <span className="font-medium">Signature ID:</span> {signatureId}
            </div>
          )}
        </div>

        <EmptyContent>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {filepath && (
              <>
                <Button
                  variant="outline"
                  onClick={handleViewWaiver}
                  disabled={isLoading}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Signed Waiver
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadWaiver}
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Waiver
                </Button>
              </>
            )}
            <Button asChild>
              <Link href="/participant/trips">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to My Trips
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
