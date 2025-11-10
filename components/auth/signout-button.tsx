"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/browser"

export function SignoutButton() {
	const router = useRouter()
	const supabase = createClient()

	const handleSignout = async () => {
		await supabase.auth.signOut()
		router.push("/login")
		router.refresh()
	}

	return (
		<Button onClick={handleSignout}>
			Sign out
		</Button>
	)
}
