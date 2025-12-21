import { useMutation } from "@tanstack/react-query";

interface SignWaiverInput {
	fullLegalName: string;
	birthday: string;
	tripId: string;
	waiverId: string;
}

interface SignWaiverResponse {
	success: boolean;
	filepath: string;
}

async function signWaiver(input: SignWaiverInput): Promise<SignWaiverResponse> {
	const response = await fetch("/api/waivers/sign", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || "Failed to submit waiver");
	}

	return data;
}

export function useSignWaiver() {
	return useMutation({
		mutationFn: signWaiver,
	});
}
