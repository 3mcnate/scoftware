"use client";

import React, { createContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/browser";
import { RequiredClaims, AuthError, User } from "@supabase/supabase-js";

type AuthClaims = {
  app_role: string;
} & RequiredClaims;

type AuthState =
  | { status: "loading" }
  | { status: "error"; error: Error | AuthError }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: User; claims: AuthClaims };

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!mounted) return;

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        setState({
          status: "error",
          error: sessionError,
        });
      }

      const session = sessionData?.session ?? null;

      if (!session) {
        if (!mounted) return;
        setState({ status: "unauthenticated" });
        return;
      }

      const { data: claimsData, error: claimsError } =
        await supabase.auth.getClaims();
      if (claimsError) {
        throw claimsError;
      }

      const claims = (claimsData?.claims ?? {}) as AuthClaims;

      if (!mounted) return;
      setState({ status: "authenticated", claims, user: session.user });
    }

    init();

    // Listen for auth state changes so we can refresh claims when necessary
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setState({ status: "unauthenticated" });
        return;
      }

      setTimeout(async () => {
        const { data: claimsData, error: claimsError } =
          await supabase.auth.getClaims();

        if (claimsError) {
          setState({
            status: "error",
            error: claimsError,
          });
          return;
        }

        const claims = (claimsData?.claims ?? {}) as AuthClaims;
        setState({ status: "authenticated", claims, user: session.user });
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
