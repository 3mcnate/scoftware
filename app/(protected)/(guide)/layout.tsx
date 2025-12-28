import AppSidebar from "@/components/guide-dashboard/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
