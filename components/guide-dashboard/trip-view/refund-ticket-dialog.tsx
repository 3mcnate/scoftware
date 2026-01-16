"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCancelTicket } from "@/data/client/tickets/cancel-ticket";
import { toast } from "sonner";

type RefundTicketDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: string;
  tripId: string;
  amountPaid: number;
  onSuccess?: () => void;
};

export const RefundTicketDialog = ({
  open,
  onOpenChange,
  ticketId,
  tripId,
  amountPaid,
  onSuccess,
}: RefundTicketDialogProps) => {
  const { mutateAsync: cancelTicket, isPending } = useCancelTicket(tripId);

  const handleConfirm = async () => {
    try {
      await cancelTicket({ ticketId, refund: true });
      toast.success("Ticket refunded");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to refund ticket");
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isPending) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund Ticket</DialogTitle>
          <DialogDescription className="text-foreground">
            Refunding this ticket will not open up a spot. If you want to open
            up a spot, cancel and refund the ticket instead.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending} variant={'destructive'}>
            {isPending && <Spinner />}
            Refund Ticket (${amountPaid})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
