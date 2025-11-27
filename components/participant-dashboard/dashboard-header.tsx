import Logo from "@/components/global/logo";
import HeaderAuth from "@/components/auth/header-auth";
import { DashboardTabs } from "@/components/participant-dashboard/dashboard-tabs";

export function ParticipantDashboardHeader() {
  return (
    <header className="border-b border-border">
      <div className="container px-4 md:px-6 mx-auto h-16 flex items-center justify-between">
        <Logo />
        <HeaderAuth />
      </div>
			<div className="border-t border-border sticky top-0 z-50 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <DashboardTabs />
        </div>
      </div>
    </header>
  );
}
