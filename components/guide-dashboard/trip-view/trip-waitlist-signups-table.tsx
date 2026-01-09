"use client";

import { format } from "date-fns";
import { toast } from "sonner";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getInitials } from "@/utils/names";
import { getAvatarUrl } from "@/data/client/storage/avatars";
import { useTripWaitlist } from "@/data/client/waitlist/get-trip-waitlist";

type TripWaitlistSignupsTableProps = {
  tripId: string;
};

export const TripWaitlistSignupsTable = ({
  tripId,
}: TripWaitlistSignupsTableProps) => {
  const { data: waitlist, isLoading: isWaitlistLoading } =
    useTripWaitlist(tripId);

  if (isWaitlistLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading waitlist...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Waitlist</h2>
        <Badge variant={"secondary"}>{waitlist?.length || 0}</Badge>
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
              const spotExpiresAt = signup.spot_expires_at
                ? new Date(signup.spot_expires_at)
                : null;
              const notificationSentAt = signup.notification_sent_at
                ? new Date(signup.notification_sent_at)
                : null;
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
                            <Badge className="bg-primary">Signup Open</Badge>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              Expires {format(spotExpiresAt, "MMM d, h:mm a")}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Email sent:{" "}
                            {notificationSentAt
                              ? format(notificationSentAt, "MMM d, h:mm a")
                              : "Unknown"}
                          </p>
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
                            <p>
                              Email sent:{" "}
                              {notificationSentAt
                                ? format(notificationSentAt, "MMM d, h:mm a")
                                : "Unknown"}
                            </p>
                            <p>
                              Expired at:{" "}
                              {format(spotExpiresAt, "MMM d, h:mm a")}
                            </p>
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
                          onClick={() =>
                            toast.info("Send link not implemented")
                          }
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
                            onClick={() =>
                              toast.info("Cancel spot not implemented")
                            }
                          >
                            Revoke spot
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() =>
                              toast.info("Resend link not implemented")
                            }
                          >
                            Resend link
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
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
  );
};
