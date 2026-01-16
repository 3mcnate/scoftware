import { AuthErrorScreen } from "@/components/auth/auth-error-screen"

export default async function AuthErrorPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ message?: string }> 
}) {
  const { message } = await searchParams

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthErrorScreen message={message} />
      </div>
    </div>
  )
}
