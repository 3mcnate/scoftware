import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SignupButtonsProps {
  className?: string
}

export function SignupButtons({ className }: SignupButtonsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center", className)}>
      <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base sm:px-8">
        SIGN ME UP BIG TIME!
      </Button>
      <Button variant="outline" size="lg" className="font-semibold bg-transparent text-base sm:px-8">
        Driver Signup
      </Button>
    </div>
  )
}
