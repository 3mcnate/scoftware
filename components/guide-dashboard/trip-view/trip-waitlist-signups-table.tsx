"use client";

import { useState, useMemo } from "react";
import { format, addHours, addDays, addWeeks, addMonths } from "date-fns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/utils/names";
import { getAvatarUrl } from "@/data/client/storage/avatars";
import { useTripWaitlist, useUpdateWaitlist } from "@/data/client/waitlist/get-trip-waitlist";
import { useNotifyWaitlistSignup } from "@/data/client/waitlist/notify-waitlist-signup";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ExpirationOption =
  | "1h"
  | "2h"
  | "4h"
  | "12h"
  | "1d"
  | "2d"
  | "4d"
  | "1w"
  | "2w"
  | "1m"
  | "custom";

const EXPIRATION_OPTIONS: { value: ExpirationOption; label: string }[] = [
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "4h", label: "4 hours" },
  { value: "12h", label: "12 hours" },
  { value: "1d", label: "1 day" },
  { value: "2d", label: "2 days" },
  { value: "4d", label: "4 days" },
  { value: "1w", label: "1 week" },
  { value: "2w", label: "2 weeks" },
  { value: "1m", label: "1 month" },
  { value: "custom", label: "Custom" },
];

function calculateExpirationDate(option: ExpirationOption): Date {
  const now = new Date();
  switch (option) {
    case "1h":
      return addHours(now, 1);
    case "2h":
      return addHours(now, 2);
    case "4h":
      return addHours(now, 4);
    case "12h":
      return addHours(now, 12);
    case "1d":
      return addDays(now, 1);
    case "2d":
      return addDays(now, 2);
    case "4d":
      return addDays(now, 4);
    case "1w":
      return addWeeks(now, 1);
    case "2w":
      return addWeeks(now, 2);
    case "1m":
      return addMonths(now, 1);
    default:
      return addDays(now, 1);
  }
}

type SendSignupLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  waitlistSignupId: string;
  userName: string;
  tripId: string;
};

function SendSignupLinkDialog({
  open,
  onOpenChange,
  waitlistSignupId,
  userName,
  tripId,
}: SendSignupLinkDialogProps) {
  const [selectedOption, setSelectedOption] = useState<ExpirationOption>("1d");
  const [customDate, setCustomDate] = useState("");
  const { mutate: notifySignup, isPending } = useNotifyWaitlistSignup(tripId);

  const expirationDate = useMemo(() => {
    if (selectedOption === "custom" && customDate) {
      return new Date(customDate);
    }
    return calculateExpirationDate(selectedOption);
  }, [selectedOption, customDate]);

  const isValidExpiration = useMemo(() => {
    if (selectedOption === "custom") {
      if (!customDate) return false;
      return expirationDate > new Date();
    }
    return true;
  }, [selectedOption, customDate, expirationDate]);

  const handleConfirm = () => {
    if (!isValidExpiration) {
      toast.error("Please select a valid expiration date");
      return;
    }

    notifySignup(
      {
        waitlistSignupId,
        expiresAt: expirationDate.toISOString(),
      },
      {
        onSuccess: () => {
          toast.success(`Signup link sent to ${userName}`);
          onOpenChange(false);
          setSelectedOption("1d");
          setCustomDate("");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Signup Link</DialogTitle>
          <DialogDescription>
            Send a signup link to {userName}. Choose when the spot should
            expire.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expiration">Expiration</Label>
            <Select
              value={selectedOption}
              onValueChange={(value) =>
                setSelectedOption(value as ExpirationOption)
              }
            >
              <SelectTrigger id="expiration" className="w-full">
                <SelectValue placeholder="Select expiration time" />
              </SelectTrigger>
              <SelectContent>
                {EXPIRATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOption === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-date">Custom Expiration Date</Label>
              <Input
                id="custom-date"
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
            </div>
          )}

          {isValidExpiration && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <span className="text-muted-foreground">Spot expires at: </span>
              <span className="font-medium">
                {format(expirationDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValidExpiration || isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type TripWaitlistSignupsTableProps = {
  tripId: string;
};

type RevokeSpotDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  waitlistSignupId: string;
  userName: string;
  onConfirm: () => void;
  isPending: boolean;
};

function RevokeSpotDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
  isPending,
}: RevokeSpotDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Signup Spot</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke {userName}&apos;s signup spot? They
            will no longer be able to complete their registration and will be
            moved back to waiting status.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Revoke Spot
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const TripWaitlistSignupsTable = ({
  tripId,
}: TripWaitlistSignupsTableProps) => {
  const { data: waitlist, isLoading: isWaitlistLoading } =
    useTripWaitlist(tripId);
  const { mutate: updateWaitlist, isPending: isRevoking } = useUpdateWaitlist();
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    waitlistSignupId: string;
    userName: string;
  }>({ open: false, waitlistSignupId: "", userName: "" });
  const [revokeDialogState, setRevokeDialogState] = useState<{
    open: boolean;
    waitlistSignupId: string;
    userName: string;
  }>({ open: false, waitlistSignupId: "", userName: "" });

  const handleRevokeSpot = () => {
    updateWaitlist(
      {
        id: revokeDialogState.waitlistSignupId,
        spot_expires_at: null,
        notification_sent_at: null,
      },
      {
        onSuccess: () => {
          toast.success(`Revoked signup spot for ${revokeDialogState.userName}`);
          setRevokeDialogState({ open: false, waitlistSignupId: "", userName: "" });
        },
        onError: (error) => {
          toast.error(error.message || "Failed to revoke spot");
        },
      }
    );
  };

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
        <h2 className="text-xl font-semibold">Waitlist</h2>
        <Badge variant={"secondary"}>{waitlist?.length || 0}</Badge>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Type</TableHead>
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

              const userName =
                `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

              return (
                <TableRow key={signup.id}>
                  <TableCell>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </TableCell>
                  <TableCell>
                    <HoverCard openDelay={10} closeDelay={10} >
                      <HoverCardTrigger asChild>
                        <Button
                          variant={"link"}
                          className="flex items-center gap-2 text-foreground"
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
                            <AvatarFallback className="hover:no-underline">
                              {getInitials(user?.first_name, user?.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {user?.first_name} {user?.last_name}
                          </span>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent side='top'>
												<div className="flex items-center gap-2">
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
												<div className="text-sm mt-2">
													{user.email}
												</div>
												<div className="text-sm text-muted-foreground">
													Signed up {format(new Date(signup.created_at), "MMM d, yyyy h:mm a")}
												</div>
											</HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>
                    <Badge variant={"outline"}>{signup.ticket_type}</Badge>
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
                            setDialogState({
                              open: true,
                              waitlistSignupId: signup.id,
                              userName,
                            })
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
                              setRevokeDialogState({
                                open: true,
                                waitlistSignupId: signup.id,
                                userName,
                              })
                            }
                          >
                            Revoke spot
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() =>
                              setDialogState({
                                open: true,
                                waitlistSignupId: signup.id,
                                userName,
                              })
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
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No one on the waitlist yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <SendSignupLinkDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        waitlistSignupId={dialogState.waitlistSignupId}
        userName={dialogState.userName}
        tripId={tripId}
      />

      <RevokeSpotDialog
        open={revokeDialogState.open}
        onOpenChange={(open) => setRevokeDialogState((prev) => ({ ...prev, open }))}
        waitlistSignupId={revokeDialogState.waitlistSignupId}
        userName={revokeDialogState.userName}
        onConfirm={handleRevokeSpot}
        isPending={isRevoking}
      />
    </div>
  );
};
