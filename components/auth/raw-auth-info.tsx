"use client"

import { useAuth } from "@/hooks/use-auth"

export default function RawAuthInfo() {
	const auth = useAuth()

	return <pre>{JSON.stringify(auth, null, 4)}</pre>
}
