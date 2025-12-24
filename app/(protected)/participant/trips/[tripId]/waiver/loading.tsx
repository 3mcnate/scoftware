import { Skeleton } from "@/components/ui/skeleton";

export default function WaiverLoading() {
  return (
    <div className="max-w-3xl space-y-6 mx-auto">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Title Skeleton */}
      <div>
        <Skeleton className="h-8 w-3/4" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[98%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[96%]" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[94%]" />
        <Skeleton className="h-4 w-[88%]" />
      </div>

      {/* Form Skeleton */}
      <div className="space-y-6 pt-8 border-t mt-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>

        <Skeleton className="h-10 w-full sm:w-32" />
      </div>
    </div>
  );
}
