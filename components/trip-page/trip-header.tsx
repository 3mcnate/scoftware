"use client"

import HeaderAuth from "@/components/auth/header-auth"
import { SignupButtons } from "./signup-buttons"
import TripHeaderInfo, { TripHeaderInfoBadges } from "./trip-header-info"
import Image from "next/image"
import Link from "next/link"

export function TripHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="container flex h-auto mx-auto flex-col gap-3 px-4 py-3 md:h-16 md:flex-row md:items-center md:justify-between md:py-0 md:px-6">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" height={100} width={100} alt="logo" />
          </Link >

          <TripHeaderInfoBadges />
        </div>

        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          <TripHeaderInfo />
          <HeaderAuth />
        </div>
        <SignupButtons className="flex flex-row justify-between md:hidden" header/>
      </div>
    </header>
  )
}
