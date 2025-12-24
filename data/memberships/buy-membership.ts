import { useMutation } from "@tanstack/react-query";

interface BuyMembershipInput {
  length: "semester" | "year";
}

interface BuyMembershipResponse {
  url: string;
}

async function buyMembership(input: BuyMembershipInput): Promise<BuyMembershipResponse> {
  const response = await fetch("/api/checkout/membership", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to initiate checkout");
  }

  return data;
}

export function useBuyMembership() {
  return useMutation({
    mutationFn: buyMembership,
  });
}
