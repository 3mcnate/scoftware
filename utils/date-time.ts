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
