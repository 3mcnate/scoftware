import { TripsList } from "@/components/trips-list/trips-list";
import { getPastPublishedTrips } from "@/data/server/trips/get-past-published-trips";
import { formatDateWithWeekday, formatTime } from "@/utils/date-time";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const TRIPS_PER_PAGE = 35;

interface PastTripsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PastTripsPage({ searchParams }: PastTripsPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const offset = (currentPage - 1) * TRIPS_PER_PAGE;

  const { trips: pastTripsData, totalCount } = await getPastPublishedTrips({
    limit: TRIPS_PER_PAGE,
    offset,
  });

  const totalPages = Math.ceil(totalCount / TRIPS_PER_PAGE);

  const pastTrips = pastTripsData.map((trip) => ({
    id: trip.id,
    picture: trip.picture,
    title: trip.name,
    startDate: formatDateWithWeekday(trip.start_date),
    startTime: formatTime(trip.start_date),
    endDate: formatDateWithWeekday(trip.end_date),
    endTime: formatTime(trip.end_date),
    activity: trip.activity,
    difficulty: trip.difficulty,
    priorExperience: trip.recommended_prior_experience,
    participantSpotsLeft: 0,
    driverSpotsLeft: 0,
    location: trip.location,
  }));

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <div className="flex justify-start">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Current Trips
          </Link>
        </Button>
      </div>

      <div className="mb-6 text-center py-10 md:py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Past Trips
        </h1>
        <p className="text-muted-foreground">{totalCount} trips completed</p>
      </div>

      <TripsList trips={pastTrips} isPast />

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={
                    currentPage > 1
                      ? `/past-trips?page=${currentPage - 1}`
                      : "#"
                  }
                  aria-disabled={currentPage <= 1}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={`/past-trips?page=${page}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? `/past-trips?page=${currentPage + 1}`
                      : "#"
                  }
                  aria-disabled={currentPage >= totalPages}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
