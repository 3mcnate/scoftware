import { type NextRequest } from 'next/server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
	const supabase = await createServerClient()

	const { error } = await supabase.auth.exchangeCodeForSession(code)
	if (!error) {
	  // redirect user to specified redirect URL or root of app
	  redirect('/reset-password')
	}
	redirect(`/auth-error?message=${error.message}`)
  }

  redirect(`/auth-error`)
}