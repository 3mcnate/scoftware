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
