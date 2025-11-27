import { DashboardTabs } from "@/components/participant-dashboard/dashboard-tabs";

export function ParticipantDashboardHeader() {
  return (
    <header className="border-b border-border">
			<div className="border-border bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <DashboardTabs />
        </div>
      </div>
    </header>
  );
}
