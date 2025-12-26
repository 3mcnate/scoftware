"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function SidebarHeader() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="h-auto py-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href="/guide">
            {isCollapsed ? (
              <div className="flex aspect-square size-8 items-center justify-center">
                <Image src="/logo.png" height={32} width={32} alt="Logo" />
              </div>
            ) : (
              <div className="flex w-full items-center justify-center py-2">
                <Image src="/logo.png" height={80} width={80} alt="Logo" />
              </div>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
