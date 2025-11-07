import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  },
  schemaFilter: ["public", "auth"],
  tablesFilter: ["*"],
  introspect: {
	  casing: "preserve"
  }
});
