import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./drizze/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
	},
	schemaFilter: ["public", "auth"],
	tablesFilter: [
		"published_trips",
		"trips",
		"profiles",
		"users",
		"trip_waivers",
		"waiver_events",
		"waiver_templates",
		"tickets",
		"memberships",
		"membership_prices",
		"trip_guides",
		"roles",
		"waitlist_signups",
	],
	introspect: {
		casing: "preserve",
	},
});
