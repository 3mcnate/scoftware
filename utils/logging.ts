import { headers } from "next/headers";

export async function getUserIP() {
	const headersList = await headers();

	const forwardedFor = headersList.get("x-forwarded-for");
	const ip = forwardedFor?.split(",")[0]?.trim() ??
		headersList.get("x-real-ip") ??
		"unknown";

	return ip;
}

