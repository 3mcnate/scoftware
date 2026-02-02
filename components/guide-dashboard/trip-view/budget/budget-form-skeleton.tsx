import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function BudgetFormSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left column - Form sections */}
      <div className="flex-1 space-y-6">
        {/* Section 1: Meals */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-4 w-80 mt-1.5" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Gas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-10" />
            </div>
            <Skeleton className="h-4 w-56 mt-1.5" />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-muted/50 border border-border rounded-md px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Other Expenses */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-4 w-72 mt-1.5" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-dashed rounded-md py-3.5 flex justify-center">
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Right column - Preview */}
      <div className="lg:w-80 lg:shrink-0">
        <Card className="lg:sticky lg:top-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-28" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
