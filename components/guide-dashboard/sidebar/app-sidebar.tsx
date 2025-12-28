"use client";

import { NavAdmin } from "@/components/guide-dashboard/sidebar/nav-admin";
import { NavUser } from "@/components/guide-dashboard/sidebar/nav-user";
import { SidebarHeader } from "@/components/guide-dashboard/sidebar/sidebar-header";
import {
  SidebarNavGroup,
  SideNavItem,
} from "@/components/guide-dashboard/sidebar/sidebar-nav-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader as SidebarHeaderWrapper,
  SidebarRail,
} from "@/components/ui/sidebar";
import { CircleUser, Map, Users } from "lucide-react";

const guideItems: SideNavItem[] = [
  {
    name: "Trips",
    icon: Map,
    sub: [
      {
        name: "My Trips",
        href: "/guide/my-trips",
      },
      {
        name: "All Trips",
        href: "/guide/all-trips",
      },
    ],
  },
  {
    name: "Guides",
    icon: CircleUser,
    href: "/guide/guides",
  },
  {
    name: "Participants",
    icon: Users,
    href: "/guide/participants",
  },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderWrapper>
        <SidebarHeader />
      </SidebarHeaderWrapper>
      <SidebarContent>
        <SidebarNavGroup items={guideItems} />
        <NavAdmin />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}