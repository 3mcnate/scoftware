"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function SidebarHeader() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2">
          <SidebarMenuButton
            size="lg"
            asChild={!isCollapsed}
            className="h-auto flex-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            {isCollapsed ? (
              <div
                className="flex items-center justify-start py-3"
                onClick={toggleSidebar}
              >
                <Image src="/logo.png" height={32} width={32} alt="Logo" />
              </div>
            ) : (
              <Link href="/">
                <div className="flex items-center justify-center">
                  <Image src="/logo.png" height={40} width={80} alt="Logo" />
                </div>
              </Link>
            )}
          </SidebarMenuButton>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
