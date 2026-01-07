"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  Mail,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTripTickets } from "@/data/client/tickets/get-trip-tickets";
import { useTripWaitlist } from "@/data/client/waitlist/get-trip-waitlist";
import { useUpdateTicket } from "@/data/client/tickets/update-ticket";
import { createClient } from "@/utils/supabase/browser";
import { getInitials } from "@/utils/names";
import { getAvatarUrl } from "@/data/client/storage/avatars";
import { toast } from "sonner";
import { useTrip } from "@/data/client/trips/get-guide-trips";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SignupsPage = () => {
  const params = useParams();
  const tripId = params.tripId as string;
  const { data: tickets, isLoading: isTicketsLoading } = useTripTickets(tripId);
  const { data: waitlist, isLoading: isWaitlistLoading } = useTripWaitlist(tripId);
  const { data: trip, isLoading: isTripLoading } = useTrip(tripId);
  const { mutateAsync: updateTicket } = useUpdateTicket();

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

  const handleCancel = async (ticketId: string) => {
    try {
      await updateTicket({
        id: ticketId,
        cancelled: true,
        cancelled_at: new Date().toISOString(),
      });
      toast.success("Ticket cancelled");
    } catch (error) {
      toast.error(`Failed to cancel ticket`);
      console.error(error);
    }
  };

  const handleRefund = async (ticketId: string) => {
    toast.error("Not implemented yet " + ticketId);
  };

  if (isTicketsLoading || isTripLoading || isWaitlistLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading participants...
      </div>
    );
  }

  if (!trip) {
    return <div className="p-8 text-center">Could not load trip</div>;
  }

  const activeParticipantsCount =
    tickets?.filter((t) => !t.cancelled).length || 0;

  return (
    <div className="space-y-8">
      {/* Signups Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Participants</h2>
          </div>
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Trip Report
          </Button>
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
              {tickets?.map((ticket) => {
                const user = ticket.user;
                const isDriver = ticket.type === "driver";

                return (
                  <TableRow
                    key={ticket.id}
                    className={ticket.cancelled ? "bg-muted/30" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              user?.avatar_path
                                ? getAvatarUrl(user.avatar_path)
                                : undefined
                            }
                            alt={user?.first_name}
                          />
                          <AvatarFallback>
                            {getInitials(user?.first_name, user?.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
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
                                className="text-[10px] h-4 px-1 text-amber-600 border-amber-600"
                              >
                                Refunded
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {user?.phone || "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(
                        new Date(ticket.created_at),
                        "MMM d, yyyy h:mm a"
                      )}
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
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleCancel(ticket.id)}
                            disabled={ticket.cancelled}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRefund(ticket.id)}
                            disabled={ticket.refunded}
                          >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refund Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              window.location.href = `mailto:?subject=Trip Info&body=Hi ${user?.first_name},`;
                            }}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Email Participant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {tickets?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No participants yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Waitlist Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Waitlist</h2>
          <p className="text-sm text-muted-foreground">
            {waitlist?.length || 0} people on the waitlist
          </p>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitlist?.map((signup, index) => {
                const user = signup.user;
                const spotExpiresAt = signup.spot_expires_at ? new Date(signup.spot_expires_at) : null;
                const notificationSentAt = signup.notification_sent_at ? new Date(signup.notification_sent_at) : null;
                const now = new Date();
                
                let status: "waiting" | "open" | "expired" = "waiting";
                if (spotExpiresAt) {
                  status = spotExpiresAt > now ? "open" : "expired";
                }

                return (
                  <TableRow key={signup.id}>
                    <TableCell>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              user?.avatar_path
                                ? getAvatarUrl(user.avatar_path)
                                : undefined
                            }
                            alt={user?.first_name}
                          />
                          <AvatarFallback>
                            {getInitials(user?.first_name, user?.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {user?.first_name} {user?.last_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user?.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(signup.created_at), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>
                      {status === "waiting" && (
                        <Badge variant="secondary">Waiting</Badge>
                      )}
                      
                      {status === "open" && spotExpiresAt && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary">
                                Signup Open
                              </Badge>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                Expires {format(spotExpiresAt, "MMM d, h:mm a")}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Email sent: {notificationSentAt ? format(notificationSentAt, "MMM d, h:mm a") : "Unknown"}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {status === "expired" && spotExpiresAt && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline">Expired</Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex flex-col gap-1 text-xs">
                              <p>Email sent: {notificationSentAt ? format(notificationSentAt, "MMM d, h:mm a") : "Unknown"}</p>
                              <p>Expired at: {format(spotExpiresAt, "MMM d, h:mm a")}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {(status === "waiting" || status === "expired") && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => toast.info("Send link not implemented")}
                          >
                            Send signup link
                          </Button>
                        )}
                        
                        {status === "open" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => toast.info("Cancel spot not implemented")}
                            >
                              Revoke spot
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8"
                              onClick={() => toast.info("Resend link not implemented")}
                            >
                              Resend link
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {waitlist?.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No one on the waitlist yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}


export default SignupsPage;