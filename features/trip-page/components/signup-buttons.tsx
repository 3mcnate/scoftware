import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SignupButtonsProps {
  className?: string
}

export function SignupButtons({ className }: SignupButtonsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-2 justify-center items-stretch sm:items-center", className)}>
      <Button size="lg">
        SIGN ME UP BIG TIME!
      </Button>
      <Button variant="outline" size="lg" className="bg-transparent">
        Driver Signup
      </Button>
    </div>
  )
}
