import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: {children: React.ReactNode}) {
	const supabase = await createServerClient()
	const { data: { user }, error } = await supabase.auth.getUser();
	if (!user || error) {
		redirect('/login')
	}

	return children
}