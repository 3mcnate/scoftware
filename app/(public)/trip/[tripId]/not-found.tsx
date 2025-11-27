import { TripsListHeader } from "@/components/trips-list/trips-list-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default function TripNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <TripsListHeader />
      
      <main className="container px-4 py-12 md:py-16 mx-auto">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
          <div className="rounded-full bg-muted p-6">
            <SearchX className="h-12 w-12 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Trip Not Found
            </h1>
            <p className="text-muted-foreground">
              Sorry, we couldn&apos;t find the trip you&apos;re looking for. It may have been removed or the link might be incorrect.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button asChild>
              <Link href="/">
                Browse available trips
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
