"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SideNavSubItem = {
  name: string;
  href: string;
  icon?: LucideIcon;
};

export type SideNavItem = {
  name: string;
  href?: string;
  icon?: LucideIcon;
  sub?: SideNavSubItem[];
};

type SideNavGroupProps = {
  title?: string;
  items: SideNavItem[];
};

export function SidebarNavGroup({ title, items }: SideNavGroupProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.sub?.length) {
              return (
                <Collapsible
                  key={item.name}
                  className="group/collapsible"
                  asChild
                  defaultOpen={true}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.name}>
                        {item.icon && <item.icon />}
                        <span>{item.name}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.sub.map((sub) => (
                          <SidebarMenuSubItem key={sub.name}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname.startsWith(sub.href)}
                            >
                              <Link href={sub.href}>
                                {sub.icon && <sub.icon />}
                                <span>{sub.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild={!!item.href}
                  isActive={!!item.href && pathname.startsWith(item.href)}
                  tooltip={item.name}
                >
                  {item.href ? (
                    <Link href={item.href}>
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <>
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
