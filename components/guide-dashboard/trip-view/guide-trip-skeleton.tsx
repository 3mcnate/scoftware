import { Skeleton } from "@/components/ui/skeleton";

export default function GuideTripSkeleton() {
  return (
    <div className="mx-auto py-8">
      <Skeleton className="h-64 w-full mb-4" />
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
