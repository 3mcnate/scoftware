"use client"

import { SidebarNavGroup, SideNavItem } from "@/components/guide-dashboard/sidebar-nav-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { CircleUser, Map, Users } from "lucide-react";


const guideItems: SideNavItem[] = [
	{
		name: "Trips",
		icon: Map,
		sub: [
			{
				name: "My Trips",
				href: "/guide/my-trips"
			},
			{
				name: "All Trips",
				href: "/guide/all-trips"
			}
		]
	},
	{
		name: "Guides",
		icon: CircleUser,
		href: "/guide/guides"
	},
	{
		name: "Participants",
		icon: Users,
		href: "/guide/participants"
	}
]


export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
				<SidebarNavGroup items={guideItems}/>
			</SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}