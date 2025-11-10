"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"

export function AuthErrorScreen({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const [errorMessage] = useState<string>(() => {
    // Initial calculation on mount
    const message = searchParams.get("message")
    
    // Check hash fragment for error_description (e.g., #error_description=...)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1) // Remove the '#'
      const hashParams = new URLSearchParams(hash)
      const errorDescription = hashParams.get("error_description")
      
      // Prioritize error_description over message
      const rawMessage = errorDescription || message
      
      if (rawMessage) {
        return decodeURIComponent(rawMessage.replace(/\+/g, ' '))
      }
    }
    
    return "Unknown error occurred"
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl font-bold mt-2">Authentication Error</h1>
        </div>
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {errorMessage}
        </div>
        <Field>
          <Button asChild>
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </Field>
      </FieldGroup>
    </div>
  )
}
