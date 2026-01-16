import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { LoginFormSkeleton } from "@/components/auth/login-form-skeleton"

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}
