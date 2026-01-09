"use client";

import { useState } from "react";
import {
  Download,
  Phone,
  Mail,
  Clipboard,
  RotateCcw,
  Users,
	Car,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "@/components/ui/button-group";

import {
  useTripTickets,
  type TripTicket,
} from "@/data/client/tickets/get-trip-tickets";
import { useCancelTicket } from "@/data/client/tickets/cancel-ticket";
import { useTrip } from "@/data/client/trips/get-guide-trips";

import { TicketInfoSheet } from "./ticket-info-sheet";
import { TripParticipantRow } from "./trip-participant-row";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

type TripParticipantsTableProps = {
  tripId: string;
};

export const TripParticipantsTable = ({
  tripId,
}: TripParticipantsTableProps) => {
  const [selectedTicket, setSelectedTicket] = useState<TripTicket | null>(null);
  const {
    data: tickets,
    refetch: refetchTickets,
    isRefetching: isTicketsRefetching,
    isLoading: isTicketsLoading,
  } = useTripTickets(tripId);
  const { data: trip, isLoading: isTripLoading } = useTrip(tripId);
  const { mutateAsync: cancelTicket } = useCancelTicket(tripId);

  const handleCancel = async (ticketId: string) => {
    try {
      await cancelTicket({ ticketId, refund: false });
      toast.success("Ticket cancelled");
    } catch (error) {
      toast.error(`Failed to cancel ticket`);
      console.error(error);
    }
  };

  const handleRefund = async (ticketId: string) => {
    try {
      await cancelTicket({ ticketId, refund: true });
      toast.success("Ticket refunded");
    } catch (error) {
      toast.error("Failed to refund ticket");
      console.error(error);
    }
  };

  const copyPhoneNumbers = () => {
    const phones = tickets
      ?.filter((t) => !t.cancelled && t.user?.phone)
      .map((t) => t.user.phone)
      .join(", ");

    if (phones) {
      navigator.clipboard.writeText(phones);
      toast.success("Phone numbers copied to clipboard");
    } else {
      toast.error("No phone numbers to copy");
    }
  };

  const copyEmailAddresses = () => {
    const emails = tickets
      ?.filter((t) => !t.cancelled && t.user?.email)
      .map((t) => t.user.email)
      .join(", ");

    if (emails) {
      navigator.clipboard.writeText(emails);
      toast.success("Email addresses copied to clipboard");
    } else {
      toast.error("No email addresses to copy");
    }
  };

  if (isTicketsLoading || isTripLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading participants...
      </div>
    );
  }

  if (!trip) {
    return <div className="p-8 text-center">Could not load trip</div>;
  }

  const activeDriversCount =
    tickets?.filter((t) => !t.cancelled && t.type === "driver").length || 0;

  const activeParticipantsCount =
    tickets?.filter((t) => !t.cancelled && t.type !== "driver").length || 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Participants</h2>
          <Badge variant={"secondary"}>
            <Users /> {activeParticipantsCount}/{trip.participant_spots}
          </Badge>
          {trip.driver_spots > 0 && (
            <Badge variant={"secondary"}>
              <Car /> {activeDriversCount}/{trip.driver_spots}
            </Badge>
          )}
        </div>
        <ButtonGroup>
          <ButtonGroup>
            <Button
              variant={"outline"}
              size="sm"
              onClick={() => refetchTickets()}
              disabled={isTicketsRefetching}
            >
              {isTicketsRefetching ? <Spinner /> : <RotateCcw />}
              <span className="hidden md:block">Refresh</span>
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size="sm">
                  <Clipboard /> Copy contact info
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={copyPhoneNumbers}>
                    <Phone /> Copy phone numbers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyEmailAddresses}>
                    <Mail /> Copy email addresses
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="bg-transparent" size={"sm"}>
              <Download className="h-4 w-4" />
              Download Trip Report
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Ticket Type</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Waivers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((ticket) => (
              <TripParticipantRow
                key={ticket.id}
                ticket={ticket}
                onSelect={setSelectedTicket}
                onCancel={handleCancel}
                onRefund={handleRefund}
              />
            ))}
            {tickets?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No participants yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TicketInfoSheet
        ticket={selectedTicket}
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
        onCancel={(ticketId) => {
          handleCancel(ticketId);
          setSelectedTicket(null);
        }}
        onRefund={(ticketId) => {
          handleRefund(ticketId);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
};
