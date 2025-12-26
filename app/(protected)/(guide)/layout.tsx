import AppSidebar from "@/components/guide-dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-12">{children}</main>
    </SidebarProvider>
  );
}
