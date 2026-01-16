import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import { getInitials } from "@/utils/names";
import { getAvatarUrl } from "@/data/client/storage/avatars";
import { createClient } from "@/utils/supabase/browser";
import { toast } from "sonner";
import { type TripTicket } from "@/data/client/tickets/get-trip-tickets";
import { formatPhoneNumber } from "react-phone-number-input";

type TicketInfoSheetProps = {
  ticket: TripTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (ticketId: string) => void;
  onRefund: (ticketId: string) => void;
};

const InfoRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm">{value || "-"}</p>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-sm font-medium mb-3">{title}</h3>
);

const WaiverCopyAction = ({
  tripId,
  type,
}: {
  tripId: string;
  type: "participant" | "driver";
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/participant/trips/${tripId}/waiver?type=${type}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Waiver link copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="text-xs text-muted-foreground ml-6 mt-1 flex items-center gap-1">
      <span>Not signed.</span>
      {copied ? (
        <>
          <Check className="h-3 w-3" /> Waiver link copied! Send to your participant.
        </>
      ) : (
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-primary transition-colors hover:underline underline-offset-2"
        >
          <Copy className="h-3 w-3" /> Copy waiver URL
        </button>
      )}
    </div>
  );
};

export function TicketInfoSheet({
  ticket,
  open,
  onOpenChange,
  onCancel,
  onRefund,
}: TicketInfoSheetProps) {
  if (!ticket) return null;

  const user = ticket.user;
  const info = user.participant_info;
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

  const formatDegreePath = (path: string) => {
    switch (path) {
      case "undergrad":
        return "Undergraduate";
      case "graduate":
        return "Graduate";
      case "pdp":
        return "PDP";
      default:
        return path;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="pb-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={
                  user.avatar_path ? getAvatarUrl(user.avatar_path) : undefined
                }
                alt={user.first_name}
              />
              <AvatarFallback className="text-lg">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">
                {user.first_name} {user.last_name}
              </SheetTitle>
              {(ticket.cancelled || ticket.refunded) && (
                <SheetDescription className="flex items-center gap-2 mt-1">
                  {ticket.cancelled && (
                    <Badge variant="destructive">Cancelled</Badge>
                  )}
                  {ticket.refunded && (
                    <Badge variant="secondary">Refunded</Badge>
                  )}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-4 pb-4">
          {/* Contact Information */}
          <section>
            <SectionTitle title="Contact Information" />
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                label="Email"
                value={user.email}
                className="col-span-2"
              />
              <InfoRow label="Phone" value={formatPhoneNumber(user.phone)} />
              <InfoRow label="USC ID" value={info?.usc_id} />
            </div>
          </section>

          <Separator />

          {/* Ticket Details */}
          <section>
            <SectionTitle title="Ticket Details" />
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                label="Ticket Type"
                value={ticket.type}
                className="capitalize"
              />
              <InfoRow label="Amount Paid" value={`$${ticket.amount_paid}`} />
              <InfoRow
                label="Signup Date"
                value={format(
                  new Date(ticket.created_at),
                  "MMM d, yyyy h:mm a"
                )}
                className="col-span-2"
              />
              <InfoRow
                label="Stripe Payment ID"
                value={
                  <span className="text-xs">
                    {ticket.stripe_payment_id}
                  </span>
                }
              />
              {ticket.cancelled_at && (
                <InfoRow
                  label="Cancelled At"
                  value={format(
                    new Date(ticket.cancelled_at),
                    "MMM d, yyyy h:mm a"
                  )}
                />
              )}
            </div>
            <div className="flex gap-2 mt-3">
              {ticket.receipt_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(ticket.receipt_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Receipt
                </Button>
              )}
            </div>
          </section>

          <Separator />

          {/* Waivers */}
          <section>
            <SectionTitle title="Waivers" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {ticket.waiver_filepath ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">Participant Waiver</span>
                  </div>
                  {ticket.waiver_signed_at ? (
                    <p className="text-xs text-muted-foreground ml-6 mt-1">
                      Signed{" "}
                      {format(
                        new Date(ticket.waiver_signed_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  ) : (
                    <WaiverCopyAction
                      tripId={ticket.trip_id}
                      type="participant"
                    />
                  )}
                </div>
                {ticket.waiver_filepath && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openWaiver(ticket.waiver_filepath!)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {isDriver && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {ticket.driver_waiver_filepath ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">Driver Waiver</span>
                    </div>
                    {ticket.driver_waiver_signed_at ? (
                      <p className="text-xs text-muted-foreground ml-6 mt-1">
                        Signed{" "}
                        {format(
                          new Date(ticket.driver_waiver_signed_at),
                          "MMM d, yyyy h:mm a"
                        )}
                      </p>
                    ) : (
                      <WaiverCopyAction tripId={ticket.trip_id} type="driver" />
                    )}
                  </div>
                  {ticket.driver_waiver_filepath && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openWaiver(ticket.driver_waiver_filepath!)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Participant Info */}
          {info && (
            <>
              {/* Medical Information */}
              <section>
                <SectionTitle title="Medical Information" />
                <div className="space-y-4">
                  <InfoRow
                    label="Dietary Restrictions"
                    value={
                      info.dietary_restrictions.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {info.dietary_restrictions.map((restriction) => (
                            <Badge key={restriction} variant="secondary">
                              {restriction}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "None"
                      )
                    }
                  />
                  <InfoRow label="Allergies" value={info.allergies || "None"} />
                  <InfoRow
                    label="Medications"
                    value={info.medications || "None"}
                  />
                  <InfoRow
                    label="Medical History"
                    value={info.medical_history || "None"}
                  />
                </div>
              </section>

              <Separator />

              <section>
                <SectionTitle title="Academic Information" />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Degree Path"
                    value={formatDegreePath(info.degree_path)}
                  />
                  <InfoRow
                    label="Graduation"
                    value={info.graduation_year}
                    className="capitalize"
                  />
                </div>
              </section>

              <Separator />

              {/* Emergency Contact */}
              <section>
                <SectionTitle title="Emergency Contact" />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Name" value={info.emergency_contact_name} />
                  <InfoRow
                    label="Relationship"
                    value={info.emergency_contact_relationship}
                  />
                  <InfoRow
                    label="Phone"
                    value={formatPhoneNumber(
                      info.emergency_contact_phone_number
                    )}
                    className="col-span-2"
                  />
                </div>
              </section>

              <Separator />

              {/* Health Insurance */}
              <section>
                <SectionTitle title="Health Insurance" />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Provider"
                    value={info.health_insurance_provider}
                    className="col-span-2"
                  />
                  <InfoRow
                    label="Member ID"
                    value={info.health_insurance_member_id}
                  />
                  <InfoRow
                    label="Group #"
                    value={info.health_insurance_group_number}
                  />
                  <InfoRow
                    label="BIN #"
                    value={info.health_insurance_bin_number}
                  />
                </div>
              </section>
            </>
          )}

          {!info && (
            <section>
              <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
                Participant info not submitted yet
              </div>
            </section>
          )}
        </div>

        <SheetFooter className="border-t pt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onCancel(ticket.id)}
              disabled={ticket.cancelled}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Ticket
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onRefund(ticket.id)}
              disabled={ticket.refunded}
            >
              Refund Ticket
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
