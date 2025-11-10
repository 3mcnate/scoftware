"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"

export function EmailConfirmedScreen({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/participant")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl font-bold mt-2">Email confirmed!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            You will be automatically redirected to your dashboard in{" "}
            <strong>{countdown}</strong> second{countdown !== 1 ? "s" : ""}, or
            you can click the button below to redirect immediately.
          </p>
        </div>
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          Your account has been successfully verified!
        </div>
        <Field>
          <Button asChild>
            <Link href="/participant">Go to Dashboard</Link>
          </Button>
        </Field>
      </FieldGroup>
    </div>
  )
}
