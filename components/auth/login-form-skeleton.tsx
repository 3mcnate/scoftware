import { cn } from "@/utils/cn"
import { Skeleton } from "@/components/ui/skeleton"
import { Field, FieldGroup } from "@/components/ui/field"

export function LoginFormSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        <Field>
          <Skeleton className="h-4 w-12 mb-2" />
          <Skeleton className="h-10 w-full" />
        </Field>
        
        <Field>
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full" />
        </Field>
        
        <Field>
          <Skeleton className="h-10 w-full mb-2" />
          <div className="flex justify-center">
             <Skeleton className="h-4 w-48" />
          </div>
        </Field>
      </FieldGroup>
    </div>
  )
}
