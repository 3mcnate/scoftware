'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/browser'; 
import { Session, RequiredClaims, AuthError } from '@supabase/supabase-js';

type AuthClaims = {
  app_role: string
} & RequiredClaims;

type AuthState =
  | { status: 'loading' }
  | { status: 'error'; error: Error | AuthError }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; session: Session; claims: AuthClaims };

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let mounted = true;
	  const supabase = createClient()

    async function init() {
      console.log(`called init, mounted = ${mounted}`)
      try {
        // Get current session
        console.log("getting session")
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('got session')
        const session = sessionData?.session ?? null;

        if (!session) {
          if (!mounted) return;
          setState({ status: 'unauthenticated' });
          console.log('no session found')
          return;
        }

        // Use getClaims() to decode & verify JWT and surface custom claims.
        console.log("waiting to get claims")
        const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
        if (claimsError) throw claimsError;

        const claims = (claimsData?.claims ?? {}) as AuthClaims;
        console.log("got claims", claims)

        if (!mounted) return;
        setState({ status: 'authenticated', session, claims });
      } catch (error) {
        if (!mounted) return;
        setState({ status: 'error', error: error instanceof AuthError ? error : new Error(String(error)) });
      }
    }

    init();

    // Listen for auth state changes so we can refresh claims when necessary
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setState({ status: 'unauthenticated' });
        return;
      }

      // When token changes (sign in / refresh), re-run getClaims()
      try {
        const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
        if (claimsError) throw claimsError;

        const claims = (claimsData?.claims ?? {}) as AuthClaims;
        setState({ status: 'authenticated', session, claims });
      } catch (err) {
        setState({ status: 'error', error: err instanceof Error ? err : new Error(String(err)) });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
