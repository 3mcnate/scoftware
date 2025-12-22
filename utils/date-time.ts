import { differenceInYears, isBefore, subYears } from "date-fns";

export const formatDate = (value: string) =>
	new Date(value).toLocaleDateString("en-US", {
		weekday: "long",
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
	const [y, m, d] = birthday.split("-").map(n => Number(n))
  const birthDate = new Date(y, m, d);
  return differenceInYears(new Date(), birthDate) >= 18;
}
