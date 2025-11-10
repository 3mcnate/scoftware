"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod/v4";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { PasswordField } from "@/components/auth/password-field";
import { createClient } from "@/utils/supabase/browser";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must contain at least one special character"
      )
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  })

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const supabase = createClient();
  const [serverError, setServerError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: standardSchemaResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError("");
    console.log('clicked submit')
    try {
      console.log("updating user")
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setServerError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };

  if (success) { 
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <h1 className="text-2xl font-bold mt-2">Reset your password</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Your password has been successfully updated.
            </p>
          </div>
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
            Success! You can return to your account.
          </div>
          <Field>
            <Button asChild>
              <Link href="/participant">Go to Dashboard</Link>
            </Button>
          </Field>
        </FieldGroup>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl font-bold mt-2">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below
          </p>
        </div>
        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {serverError}
          </div>
        )}
        <PasswordField
          control={control}
          name="password"
          disabled={isSubmitting}
        />
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Resetting password..." : "Reset Password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
