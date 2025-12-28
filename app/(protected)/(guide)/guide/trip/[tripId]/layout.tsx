import { Button } from "@/components/ui/button";
import { TripTabs } from "@/components/guide-dashboard/trip-view/trip-tabs";

export default function GuideTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Trip</h1>
        <Button>Publish Trip</Button>
      </div>
      <TripTabs />
      {children}
    </div>
  );
}
