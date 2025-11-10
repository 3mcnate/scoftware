"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Image from "next/image";
import { Mail } from "lucide-react";
import { z } from "zod/v4";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { createClient } from "@/utils/supabase/browser";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PasswordField } from "@/components/auth/password-field";

const ENV = process.env.NEXT_PUBLIC_ENV!;

const SignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .email("Invalid email address")
    .refine(
      (email) => ENV === "development" || email.endsWith("@usc.edu"),
      "Must be a USC email address"
    ),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    )
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

type SignupFormData = z.infer<typeof SignupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const supabase = createClient();
  const [serverError, setServerError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupFormData>({
    resolver: standardSchemaResolver(SignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
          },
        },
      });

      if (authError) {
        setServerError(authError.message);
        return;
      }

      setUserEmail(data.email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setServerError("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userEmail,
      });

      if (error) {
        setServerError(error.message);
      } else {
        setCountdown(60);
      }
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to resend email");
      }
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (!success || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [success, countdown]);

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <h1 className="text-2xl font-bold mt-2">Success!</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Confirmation was sent to <strong>{userEmail}</strong>
            </p>
          </div>
          {serverError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {serverError}
            </div>
          )}
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
            Please check your email to verify your account before signing in. <strong>Make sure you check your spam folder.</strong>
          </div>
          <Field>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendEmail}
              disabled={countdown > 0 || isResending}
            >
              {isResending
                ? "Resending..."
                : countdown > 0
                  ? `Resend email (${countdown}s)`
                  : "Resend confirmation email"}
            </Button>
          </Field>
          <Field>
            <Button asChild>
              <a href="/login">Go to Sign In</a>
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
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {serverError}
          </div>
        )}
        <div className="flex gap-2 items-start justify-between">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="firstName"
                    type="text"
                    placeholder="John"
                    disabled={isSubmitting}
                    aria-invalid={!!error}
                  />
                  <FieldError errors={error ? [error] : undefined} />
                </>
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Controller
              control={control}
              name="lastName"
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    disabled={isSubmitting}
                    aria-invalid={!!error}
                  />
                  <FieldError errors={error ? [error] : undefined} />
                </>
              )}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="email">USC Email</FieldLabel>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="email"
                    type="email"
                    placeholder="user@usc.edu"
                    disabled={isSubmitting}
                    aria-invalid={!!error}
                  />
                  <InputGroupAddon>
                    <Mail />
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={error ? [error] : undefined} />
                <FieldDescription>
                  We&apos;ll send you an email to verify this address.
                </FieldDescription>
              </>
            )}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone number</FieldLabel>
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState: { error } }) => (
              <>
                <PhoneInput
                  {...field}
                  defaultCountry="US"
                  disabled={isSubmitting}
                />
                <FieldError errors={error ? [error] : undefined} />
              </>
            )}
          />
        </Field>
        <PasswordField
          control={control}
          name="password"
          disabled={isSubmitting}
        />
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
