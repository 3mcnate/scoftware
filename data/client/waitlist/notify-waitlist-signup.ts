import { useMutation } from "@tanstack/react-query";
import { useTripWaitlist } from "./get-trip-waitlist";

type NotifyWaitlistSignupInput = {
  waitlistSignupId: string;
  expiresAt: string;
};

type NotifyWaitlistSignupResponse = {
  success: boolean;
  message: string;
};

async function notifyWaitlistSignup(
  input: NotifyWaitlistSignupInput
): Promise<NotifyWaitlistSignupResponse> {
  const response = await fetch("/api/waitlists/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to send notification");
  }

  return data;
}

export function useNotifyWaitlistSignup(tripId: string) {
  const { refetch } = useTripWaitlist(tripId);

  return useMutation({
    mutationFn: notifyWaitlistSignup,
    onSuccess: async () => {
      await refetch();
    },
  });
}
