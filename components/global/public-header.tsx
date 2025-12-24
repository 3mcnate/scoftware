"use client";

import HeaderAuth from "@/components/auth/header-auth";
import Logo from "@/components/global/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function PublicHeader() {
  const auth = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <Logo />
        <div className="flex items-center gap-2">
          {auth.status === "authenticated" && (
            <Button asChild variant={"ghost"}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
