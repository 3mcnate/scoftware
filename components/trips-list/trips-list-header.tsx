"use client";

import HeaderAuth from "@/components/auth/header-auth";
import Logo from "@/components/global/logo";

export function TripsListHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <Logo/>
        <HeaderAuth />
      </div>
    </header>
  );
}
