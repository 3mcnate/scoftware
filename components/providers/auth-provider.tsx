"use client"

import React, { createContext, useEffect, useMemo, useState } from "react"
import { createClient } from "@/utils/supabase/browser"
import { RequiredClaims, AuthError, User } from "@supabase/supabase-js"

type AuthClaims = {
	app_role: string
} & RequiredClaims

type AuthState =
	| { status: "loading" }
	| { status: "error"; error: Error | AuthError }
	| { status: "unauthenticated" }
	| { status: "authenticated"; user: User; claims: AuthClaims }

export const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AuthState>({ status: "loading" })
	const supabase = useMemo(() => createClient(), [])

	useEffect(() => {
		let mounted = true

		async function init() {
			// Small delay to ensure cookies/storage are accessible
			// This prevents race conditions when the page first loads
			await new Promise((resolve) => setTimeout(resolve, 100))

			if (!mounted) return

			try {
				const { data: sessionData, error: sessionError } =
					await supabase.auth.getSession()

				if (sessionError) {
					throw sessionError
				}

				const session = sessionData?.session ?? null

				if (!session) {
					if (!mounted) return
					setState({ status: "unauthenticated" })
					return
				}

				// Use getClaims() to decode & verify JWT and surface custom claims.
				const { data: claimsData, error: claimsError } =
					await supabase.auth.getClaims()
				if (claimsError) {
					throw claimsError
				}

				const claims = (claimsData?.claims ?? {}) as AuthClaims

				if (!mounted) return
				setState({ status: "authenticated", claims, user: session.user })
			} catch (error) {
				if (!mounted) return
				setState({
					status: "error",
					error: error instanceof AuthError ? error : new Error(String(error)),
				})
			}
		}

		init()

		// Listen for auth state changes so we can refresh claims when necessary
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (!session) {
				setState({ status: "unauthenticated" })
				return
			}

			setTimeout(async () => {
				const { data: claimsData, error: claimsError } =
					await supabase.auth.getClaims()

				if (claimsError) {
					setState({
						status: "error",
						error: claimsError,
					})
          return;
				}

				const claims = (claimsData?.claims ?? {}) as AuthClaims
				setState({ status: "authenticated", claims, user: session.user })
			}, 0)
		})

		return () => {
			mounted = false
			subscription.unsubscribe()
		}
	}, [supabase.auth])

	return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
