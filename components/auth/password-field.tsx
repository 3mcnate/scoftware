"use client";

import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

function calculatePasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let strength = 0;
  const feedback: string[] = [];

  if (password.length >= 8) strength += 25;
  else feedback.push("At least 8 characters");

  if (/[0-9]/.test(password)) strength += 25;
  else feedback.push("Contains numbers");

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
  else feedback.push("Special characters");

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
  else feedback.push("Mix of uppercase and lowercase");

  return {
    score: Math.min(strength, 100),
    feedback: feedback.slice(0, 2).join(", "),
  };
}

interface PasswordFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  showStrengthIndicator?: boolean;
  description?: string;
}

export function PasswordField({
  control,
  name,
  label = "Password",
  placeholder = "••••••••",
  disabled = false,
  showStrengthIndicator = true,
  description = "Must be at least 8 characters and contain numbers and special characters.",
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const { score, feedback } = showStrengthIndicator
          ? calculatePasswordStrength(field.value || "")
          : { score: 0, feedback: "" };

        return (
          <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <ButtonGroup>
              <Input
                {...field}
                id={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={!!error}
              />
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </ButtonGroup>
            {showStrengthIndicator && (
              <Progress value={score} className="mt-2 h-1.5" />
            )}
            <FieldError errors={error ? [error] : undefined} />
            {description && (
              <FieldDescription>
                {field.value &&
                  showStrengthIndicator &&
                  feedback &&
                  `Needs: ${feedback}`}
              </FieldDescription>
            )}
          </Field>
        );
      }}
    />
  );
}
