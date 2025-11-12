import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SignupButtonsProps {
  className?: string;
  header?: boolean;
}

export function SignupButtons({ className, header }: SignupButtonsProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-2 justify-center items-stretch sm:items-center",
        className
      )}
    >
      <Button size="lg" className={cn({ "flex-1": header })}>
        SIGN ME UP BIG TIME!
      </Button>
      <Button
        variant="outline"
        size="lg"
        className={cn("bg-transparent", { "flex-1": header })}
      >
        Driver Signup
      </Button>
    </div>
  );
}
