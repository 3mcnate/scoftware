"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function HeaderAuth() {
  const auth = useAuth();
  if (auth.status === "loading") {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (auth.status === 'unauthenticated' || auth.status === "error")
  {
    return <Button asChild>
      <Link href="/login">
        Sign in
      </Link>
    </Button>
  }

  const { user: { id } } = auth;
  


  return <div></div>;
}
