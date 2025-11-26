"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Car } from "lucide-react";

interface SignupButtonsProps {
  className?: string;
  header?: boolean;
}

export function SignupButtons({ className, header }: SignupButtonsProps) {
  const auth = useAuth();
  if (auth.status === "authenticated") {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-2 justify-center items-stretch sm:items-center",
          className
        )}
      >
        <Button size="lg" className={cn({ "flex-1": header })}>
          SIGN ME UP BIG TIME
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={cn("bg-transparent", { "flex-1": header })}
        >
          <Car className="size-5" />
          Driver Signup
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-2 justify-center items-stretch sm:items-center",
        className
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="lg" className={cn({ "flex-1": header })} >
            SIGN ME UP BIG TIME
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign in first to sign up!</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className={cn("bg-transparent", { "flex-1": header })}
            
          >
            <Car className="size-5" />
            Driver Signup
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign in first to sign up!</TooltipContent>
      </Tooltip>
    </div>
  );
}
