import { Enums } from "@/types/database.types";
import { differenceInYears, isBefore } from "date-fns";

export const formatDateWithWeekday = (value: string) =>
	new Date(value).toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});

export const formatDate = (value: string) =>
	new Date(value).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

export const formatTime = (value: string) =>
	new Date(value).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "numeric",
	});

export function isAdult(birthday: string) {
	const [y, m, d] = birthday.split("-").map((n) => Number(n));
	const birthDate = new Date(y, m - 1, d);
	return differenceInYears(new Date(), birthDate) >= 18;
}

export function getMembershipExpirationDate(
	length: Enums<"membership_length">,
): Date {
	const now = new Date();
	const may20th = new Date(now.getFullYear(), 4, 20);
	const dec20th = new Date(now.getFullYear(), 11, 20);

	switch (length) {
		case "semester":
			if (isBefore(now, may20th)) return may20th;
			if (isBefore(now, dec20th)) return dec20th;

			may20th.setFullYear(now.getFullYear() + 1);
			return may20th;

		case "year":
			if (isBefore(now, may20th)) return dec20th;
			if (isBefore(now, dec20th)) {
				may20th.setFullYear(now.getFullYear() + 1);
				return may20th;
			}

			// between dec20th and new years
			dec20th.setFullYear(now.getFullYear() + 1);
			return dec20th;
	}
}

export function formatDateTimeLocal(isoString: string): string {
	const date = new Date(isoString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}


export function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();

  if (diffMs <= 0) return "expired";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= 1) {
    const remainingHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (remainingHours > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} and ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`;
    }
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  }

  if (diffHours >= 1) {
    const remainingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (remainingMinutes > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    }
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  }

  return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
}
