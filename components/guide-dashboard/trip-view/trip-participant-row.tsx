"use client";

import { useState } from "react";
import { format } from "date-fns";
import { formatPhoneNumber } from "react-phone-number-input";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCcw,
  EllipsisVertical,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { type TripTicket } from "@/data/client/tickets/get-trip-tickets";
import { createClient } from "@/utils/supabase/browser";
import { getInitials } from "@/utils/names";
import { getAvatarUrl } from "@/data/client/storage/avatars";
import { CancelTicketDialog } from "./cancel-ticket-dialog";
import { RefundTicketDialog } from "./refund-ticket-dialog";

interface TripParticipantRowProps {
  ticket: TripTicket;
  onSelect: (ticket: TripTicket) => void;
}

export const TripParticipantRow = ({
  ticket,
  onSelect,
}: TripParticipantRowProps) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const user = ticket.user;
  const isDriver = ticket.type === "driver";

  const openWaiver = async (path: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("waivers")
        .createSignedUrl(path, 60);

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error) {
      toast.error("Failed to open waiver");
      console.error(error);
    }
  };

  return (
    <TableRow
      key={ticket.id}
      className={ticket.cancelled ? "opacity-70 bg-muted" : ""}
    >
      <TableCell>
        <button
          className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity cursor-pointer group"
          onClick={() => onSelect(ticket)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                user?.avatar_path
                  ? getAvatarUrl(user.avatar_path)
                  : undefined
              }
              alt={user?.first_name}
            />
            <AvatarFallback className="text-xs">
              {getInitials(user?.first_name, user?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium underline-offset-4 group-hover:underline">
              {user?.first_name} {user?.last_name}
            </span>
            <div className="flex gap-1 mt-1">
              {ticket.cancelled && (
                <Badge
                  variant="destructive"
                  className="text-[10px] h-4 px-1"
                >
                  Cancelled
                </Badge>
              )}
              {ticket.refunded && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-4 px-1 text-white bg-amber-600/80 border-amber-600/80" 
                >
                  Refunded
                </Badge>
              )}
            </div>
          </div>
        </button>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {user.email}
      </TableCell>
      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
        {user?.phone ? formatPhoneNumber(user.phone) : "-"}
      </TableCell>
      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
        {format(new Date(ticket.created_at), "MMM d, yyyy h:mm a")}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {ticket.type}
        </Badge>
      </TableCell>
      <TableCell>${ticket.amount_paid}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {/* Participant Waiver */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={
                  ticket.waiver_filepath ? "default" : "outline"
                }
                className={`w-fit ${
                  !ticket.waiver_filepath
                    ? "text-muted-foreground border-dashed"
                    : "hover:bg-primary/90 cursor-pointer"
                }`}
                onClick={() =>
                  ticket.waiver_filepath &&
                  openWaiver(ticket.waiver_filepath)
                }
              >
                {ticket.waiver_filepath ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                Participant
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {ticket.waiver_filepath
                  ? "Participant waiver signed (click to view)"
                  : "Not signed"}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Driver Waiver */}
          {isDriver && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={
                    ticket.driver_waiver_filepath
                      ? "default"
                      : "outline"
                  }
                  className={`w-fit ${
                    !ticket.driver_waiver_filepath
                      ? "text-muted-foreground border-dashed"
                      : "hover:bg-primary/90 cursor-pointer"
                  }`}
                  onClick={() =>
                    ticket.driver_waiver_filepath &&
                    openWaiver(ticket.driver_waiver_filepath)
                  }
                >
                  {ticket.driver_waiver_filepath ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  Driver
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {ticket.driver_waiver_filepath
                    ? "Driver waiver signed (click to view)"
                    : "Not signed"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setCancelDialogOpen(true)}
              disabled={ticket.cancelled}
            >
              <XCircle className="h-4 w-4" />
              Cancel Ticket
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setRefundDialogOpen(true)}
              disabled={ticket.refunded}
            >
              <RefreshCcw className="h-4 w-4" />
              Refund Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CancelTicketDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          ticketId={ticket.id}
          tripId={ticket.trip_id}
          ticketType={isDriver ? "driver" : "participant"}
          amountPaid={ticket.amount_paid}
        />

        <RefundTicketDialog
          open={refundDialogOpen}
          onOpenChange={setRefundDialogOpen}
          ticketId={ticket.id}
          tripId={ticket.trip_id}
          amountPaid={ticket.amount_paid}
        />
      </TableCell>
    </TableRow>
  );
};
