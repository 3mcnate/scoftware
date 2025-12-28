import { ParticipantDashboardTabs } from "@/components/participant-dashboard/dashboard-tabs";

export function ParticipantDashboardHeader() {
  return (
    <header className="sticky top-16 z-40 border-b border-border bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <ParticipantDashboardTabs />
      </div>
    </header>
  );
}
