"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import {
  RefreshCcw,
  Calculator,
  CreditCard,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminItems = [
  {
    name: "Trip Cycles",
    href: "/admin/trip-cycles",
    icon: RefreshCcw,
  },
  {
    name: "Budget Formulas",
    href: "/admin/budget-formulas",
    icon: Calculator,
  },
  {
    name: "Membership",
    href: "/admin/membership",
    icon: CreditCard,
  },
  {
    name: "Waivers",
    href: "/admin/waivers",
    icon: FileText,
  },
];

export function NavAdmin() {
  const pathname = usePathname();
  const auth = useAuth();

  if (auth.status !== "authenticated") {
    return null;
  }

  const role = auth.claims.app_role;
  if (role !== "admin" && role !== "superadmin") {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.name}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
