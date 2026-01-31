import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export function getBudgetFormulas() {
	const client = createClient();
	return client.from("budget_formulas").select("formulas").single();
}

export const useBudgetFormulas = () => {
	return useQuery(getBudgetFormulas())
}