"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useCancelTicket } from "@/data/client/tickets/cancel-ticket";
import { toast } from "sonner";

type CancelTicketDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: string;
  tripId: string;
  ticketType: "participant" | "driver";
  amountPaid: number;
  onSuccess?: () => void;
};

export const CancelTicketDialog = ({
  open,
  onOpenChange,
  ticketId,
  tripId,
  ticketType,
  amountPaid,
  onSuccess,
}: CancelTicketDialogProps) => {
  const [refundTicket, setRefundTicket] = useState(false);
  const { mutateAsync: cancelTicket, isPending } = useCancelTicket(tripId);

  const handleConfirm = async () => {
    try {
      await cancelTicket({ ticketId, refund: refundTicket });
      toast.success(
        refundTicket ? "Ticket cancelled and refunded" : "Ticket cancelled"
      );
      onOpenChange(false);
      setRefundTicket(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to cancel ticket");
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isPending) {
      onOpenChange(open);
      if (!open) {
        setRefundTicket(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Ticket</DialogTitle>
          <DialogDescription className="text-foreground">
            Cancelling this ticket will open up a <strong>{ticketType} </strong>
            spot on this trip.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Switch
            id="refund-ticket"
            checked={refundTicket}
            onCheckedChange={setRefundTicket}
          />
          <Label htmlFor="refund-ticket">
            Also refund this ticket (${amountPaid})
          </Label>
        </div>
        <p className="text-muted-foreground text-sm">
          You can choose to refund this ticket later as well.
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {refundTicket ? "Cancel & Refund" : "Cancel Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
