"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileById } from "@/data/profiles/get-profile-by-id";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/browser";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HeaderAuth() {
  const auth = useAuth();

  if (auth.status === "loading") {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (auth.status === "unauthenticated" || auth.status === "error") {
    return (
      <Button asChild variant={'default'}>
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const {
    user: { id },
  } = auth;

  return <HeaderAuthProfile userId={id} />;
}

function HeaderAuthProfile({ userId }: { userId: string }) {
  const { data: profile, isPending } = useProfileById(userId);
  const [arrowDown, setArrowDown] = useState(true);

  if (isPending || !profile) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    );
  }

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <DropdownMenu onOpenChange={() => setArrowDown(!arrowDown)}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 hover:cursor-pointer hover:opacity-80 transition-all" >
          <Avatar className="h-10 w-10 border border-border">
            {profile.avatar ? (
              <AvatarImage src={profile.avatar} alt="User" />
            ) : (
              <>
                <AvatarImage src={profile.avatar ?? ""} alt="User" />
                <AvatarFallback>
                  {getInitials(profile.first_name, profile.last_name)}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          {arrowDown ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href="/participant">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await handleSignOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const getInitials = (firstName: string, lastName: string) => {
  return (firstName[0] + lastName[0]).toUpperCase();
};
