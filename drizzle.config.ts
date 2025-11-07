import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/drizze/schema.ts",
  out: "./db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  },
  schemaFilter: ["public"],
  tablesFilter: ["*"],
  introspect: {
	  casing: "preserve"
  }
});
