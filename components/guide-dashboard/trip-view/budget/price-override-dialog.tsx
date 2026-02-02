"use client";

import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTrip } from "@/data/client/trips/get-guide-trips";
import { useUpdateTrip } from "@/data/client/trips/use-update-trip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { BudgetTotals } from "@/utils/math";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function PriceOverrideDialog({
  tripId,
  calculatedPrices,
  currentOverrides,
  hasDriverSpots,
}: {
  tripId: string;
  calculatedPrices: BudgetTotals;
  currentOverrides: {
    member: number | null;
    nonmember: number | null;
    driver: number | null;
  };
  hasDriverSpots: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateTrip, isPending } = useUpdateTrip();
	const { refetch: refetchTrip } = useTrip(tripId);

  const PriceOverrideSchema = z.object({
    memberEnabled: z.boolean(),
    memberPrice: z.coerce.number().min(0).optional(),
    nonmemberEnabled: z.boolean(),
    nonmemberPrice: z.coerce.number().min(0).optional(),
    driverEnabled: z.boolean(),
    driverPrice: z.coerce.number().min(0).optional(),
  });

  type PriceOverrideFormData = z.infer<typeof PriceOverrideSchema>;

  const { control, handleSubmit, reset, setValue } =
    useForm<PriceOverrideFormData>({
      resolver: standardSchemaResolver(PriceOverrideSchema),
      defaultValues: {
        memberEnabled: currentOverrides.member != null,
        memberPrice: currentOverrides.member ?? calculatedPrices.member_price,
        nonmemberEnabled: currentOverrides.nonmember != null,
        nonmemberPrice:
          currentOverrides.nonmember ?? calculatedPrices.nonmember_price,
        driverEnabled: currentOverrides.driver != null,
        driverPrice: currentOverrides.driver ?? calculatedPrices.driver_price,
      },
    });

  const memberEnabled = useWatch({ control, name: "memberEnabled" });
  const nonmemberEnabled = useWatch({ control, name: "nonmemberEnabled" });
  const driverEnabled = useWatch({ control, name: "driverEnabled" });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      reset({
        memberEnabled: currentOverrides.member != null,
        memberPrice: currentOverrides.member ?? calculatedPrices.member_price,
        nonmemberEnabled: currentOverrides.nonmember != null,
        nonmemberPrice:
          currentOverrides.nonmember ?? calculatedPrices.nonmember_price,
        driverEnabled: currentOverrides.driver != null,
        driverPrice: currentOverrides.driver ?? calculatedPrices.driver_price,
      });
    }
  };

  const handleToggle = (
    field: "memberEnabled" | "nonmemberEnabled" | "driverEnabled",
    priceField: "memberPrice" | "nonmemberPrice" | "driverPrice",
    calculatedValue: number,
    enabled: boolean,
  ) => {
    setValue(field, enabled);
    if (!enabled) {
      setValue(priceField, calculatedValue);
    }
  };

  const onSubmit = async (data: PriceOverrideFormData) => {
    await updateTrip(
      {
        id: tripId,
        member_price_override: data.memberEnabled ? data.memberPrice : null,
        nonmember_price_override: data.nonmemberEnabled
          ? data.nonmemberPrice
          : null,
        driver_price_override: data.driverEnabled ? data.driverPrice : null,
      },
      {
        onSuccess: async () => {
          await refetchTrip();
					toast.success("Price overrides saved");
          setOpen(false);
        },
        onError: (err) => {
          toast.error("Failed to save price overrides");
          console.error(err);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="mt-2 text-sm font-normal text-muted-foreground float-right"
        >
          <Pencil className="size-3" />
          Override trip prices
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Override Prices</DialogTitle>
            <DialogDescription>
              Manually override the calculated prices. Enable the toggle next to
              a price to set a custom value.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel>Member Price</FieldLabel>
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="memberPrice"
                  render={({ field }) => (
                    <InputGroup className="w-64">
                      <InputGroupAddon>$</InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        min={0}
                        step={1}
                        disabled={!memberEnabled}
                        onWheel={(e) => e.currentTarget.blur()}
                        {...field}
                      />
                    </InputGroup>
                  )}
                />
                <Controller
                  control={control}
                  name="memberEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleToggle(
                          "memberEnabled",
                          "memberPrice",
                          calculatedPrices.member_price,
                          checked,
                        )
                      }
                    />
                  )}
                />
              </div>
            </Field>

            <Field>
              <FieldLabel>Non-Member Price</FieldLabel>
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="nonmemberPrice"
                  render={({ field }) => (
                    <InputGroup className="w-64">
                      <InputGroupAddon>$</InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        min={0}
                        step={1}
                        disabled={!nonmemberEnabled}
                        onWheel={(e) => e.currentTarget.blur()}
                        {...field}
                      />
                    </InputGroup>
                  )}
                />
                <Controller
                  control={control}
                  name="nonmemberEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleToggle(
                          "nonmemberEnabled",
                          "nonmemberPrice",
                          calculatedPrices.nonmember_price,
                          checked,
                        )
                      }
                    />
                  )}
                />
              </div>
            </Field>

            {hasDriverSpots && (
              <Field>
                <FieldLabel>Driver Price</FieldLabel>
                <div className="flex items-center gap-3">
                  <Controller
                    control={control}
                    name="driverPrice"
                    render={({ field }) => (
                      <InputGroup className="w-64">
                        <InputGroupAddon>$</InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          min={0}
                          step={1}
                          disabled={!driverEnabled}
                          onWheel={(e) => e.currentTarget.blur()}
                          {...field}
                        />
                      </InputGroup>
                    )}
                  />
                  <Controller
                    control={control}
                    name="driverEnabled"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          handleToggle(
                            "driverEnabled",
                            "driverPrice",
                            calculatedPrices.driver_price,
                            checked,
                          )
                        }
                      />
                    )}
                  />
                </div>
              </Field>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
