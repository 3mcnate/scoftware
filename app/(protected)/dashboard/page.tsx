import { Enums } from "@/types/database.types";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getClaims();
  if (!data || error) {
    redirect("/login");
  }

  if (!data.claims) {
    redirect(
      `/auth-error?message=${encodeURIComponent("Couldn't get user role details")}`
    );
  }

  const role: Enums<"user_role"> = data.claims.app_role;
	if (role === 'participant')
		redirect('/participant/trips');
	else 
		redirect('/guide/my-trips');
}
