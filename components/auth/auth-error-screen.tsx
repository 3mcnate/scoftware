import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";

interface AuthErrorScreenProps extends React.ComponentProps<"div"> {
  message?: string;
}

export function AuthErrorScreen({
  className,
  message,
  ...props
}: AuthErrorScreenProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl font-bold mt-2">Authentication Error</h1>
        </div>
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {message}
        </div>
        <Field>
          <Button asChild>
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </Field>
      </FieldGroup>
    </div>
  );
}
