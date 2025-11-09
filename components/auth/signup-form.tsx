"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Eye, EyeOff, Mail } from "lucide-react"
import { z } from "zod/v4"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ButtonGroup } from "@/components/ui/button-group"
import { PhoneInput } from "@/components/ui/phone-input"
import { createClient } from "@/utils/supabase/browser"
import { isValidPhoneNumber } from "react-phone-number-input"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group"

const ENV = process.env.NEXT_PUBLIC_ENV!

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
})

type SignupFormData = z.infer<typeof SignupSchema>

function calculatePasswordStrength(password: string): {
	score: number
	feedback: string
} {
	let strength = 0
	const feedback: string[] = []

	if (password.length >= 8) strength += 25
	else feedback.push("At least 8 characters")

	if (/[0-9]/.test(password)) strength += 25
	else feedback.push("Contains numbers")

	if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25
	else feedback.push("Special characters")

	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
	else feedback.push("Mix of uppercase and lowercase")

	return {
		score: Math.min(strength, 100),
		feedback: feedback.slice(0, 2).join(", "),
	}
}

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const router = useRouter()
	const supabase = createClient()
	const [showPassword, setShowPassword] = useState(false)
	const [serverError, setServerError] = useState<string>("")

	const {
		control,
		handleSubmit,
		watch,
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
	})

	const password = watch("password")
	const { score, feedback } = calculatePasswordStrength(password)

	const onSubmit = async (data: SignupFormData) => {
		setServerError("")

    // console.log("data", data);

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
			})

			if (authError) {
				setServerError(authError.message)
				return
			}

			router.push("/")
			router.refresh()
		} catch (err) {
			if (err instanceof Error) {
				setServerError(err.message)
			} else {
				setServerError("An unexpected error occurred")
			}
		}
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
				<Field>
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<Controller
						control={control}
						name="password"
						render={({ field, fieldState: { error } }) => (
							<>
								<ButtonGroup>
									<Input
										{...field}
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										disabled={isSubmitting}
										aria-invalid={!!error}
									/>
									<Button
										type="button"
										variant="outline"
										disabled={isSubmitting}
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</ButtonGroup>
								<Progress value={score} className="mt-2 h-1.5" />
								<FieldError errors={error ? [error] : undefined} />
								<FieldDescription>
									{password
										? feedback && `Needs: ${feedback}`
										: "Must be at least 8 characters and contain numbers and special characters."}
								</FieldDescription>
							</>
						)}
					/>
				</Field>
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
	)
}
