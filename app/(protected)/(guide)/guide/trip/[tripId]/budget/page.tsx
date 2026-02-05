"use client";

import { useMemo } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";
import {
  Plus,
  Trash2,
  Car,
  Utensils,
  Receipt,
  Calculator,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { compile } from "mathjs";
import { useTrip, type TripData } from "@/data/client/trips/get-guide-trips";
import { useParams } from "next/navigation";
import { useBudgetFormulas } from "@/data/client/budget/budget-formulas";
import { BudgetFormSkeleton } from "@/components/guide-dashboard/trip-view/budget/budget-form-skeleton";
import { differenceInCalendarDays } from "date-fns";
import { useUpdateTrip } from "@/data/client/trips/use-update-trip";
import { BudgetTotals, BudgetInputs, getAverageMPGs, formatCurrency } from "@/utils/math";
import { Spinner } from "@/components/ui/spinner";
import type { Control } from "react-hook-form";
import { useUnsavedChangesPrompt } from "@/hooks/use-unsaved-changes-prompt";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BudgetFormulasDialog } from "@/components/guide-dashboard/trip-view/budget/budget-formulas-dialog";
import { PriceOverrideDialog } from "@/components/guide-dashboard/trip-view/budget/price-override-dialog";

const BudgetSchema = z.object({
  breakfasts: z.coerce.number().min(0, "Must be 0 or more"),
  lunches: z.coerce.number().min(0, "Must be 0 or more"),
  dinners: z.coerce.number().min(0, "Must be 0 or more"),
  snacks: z.coerce.number().min(0, "Must be 0 or more"),
  total_miles: z.coerce.number().min(0, "Must be 0 or more"),
  cars: z.array(
    z.object({
      mpg: z.coerce.number().min(1, "MPG must be at least 1"),
    }),
  ),
  other_expenses: z.array(
    z.object({
      description: z.string().min(1, "Description required"),
      cost: z.coerce.number().min(0.01, "Cost must be 0.01 or more"),
    }),
  ),
});

type BudgetFormData = z.infer<typeof BudgetSchema>;

export default function BudgetPage() {
  const params = useParams();
  const tripId = params.tripId as string;

  const { data: trip } = useTrip(tripId);
  const { data: formulas } = useBudgetFormulas();

  if (!trip || !formulas) {
    return <BudgetFormSkeleton />;
  }

  return <BudgetForm trip={trip} formulas={formulas.formulas} />;
}

function useBudgetTotals(
  control: Control<BudgetFormData>,
  formulas: string,
  trip: TripData,
): BudgetTotals & { inputs: BudgetInputs; scope: Map<string, number> } {
  const formValues = useWatch({ control });
  const compiledFormulas = useMemo(() => compile(formulas), [formulas]);

  return useMemo(() => {
    const {
      breakfasts = 0,
      lunches = 0,
      dinners = 0,
      snacks = 0,
      total_miles = 0,
      cars = [],
      other_expenses = [],
    } = formValues;

    const inputs = {
      breakfasts: Number(breakfasts),
      lunches: Number(lunches),
      dinners: Number(dinners),
      snacks: Number(snacks),
      total_miles: Number(total_miles),
      num_cars: cars.length,
      average_mpg: getAverageMPGs(cars.map((c) => Number(c.mpg) ?? 0)),
      total_other_expenses: other_expenses.reduce(
        (prev, { cost }) => prev + (Number(cost) ?? 0),
        0,
      ),
      num_participants: trip.participant_spots,
      num_participant_drivers: trip.driver_spots,
      num_guides: trip.trip_guides.length,
      num_nights: differenceInCalendarDays(
        new Date(trip.end_date),
        new Date(trip.start_date),
      ),
    };

    const scope: Map<string, number> = new Map(Object.entries(inputs));
    compiledFormulas.evaluate(scope);

    const gas_budget = scope.get("gas_budget") ?? 0;
    const food_budget = scope.get("food_budget") ?? 0;
    const other_budget = scope.get("other_budget") ?? 0;

    return {
      inputs,
      scope,
      driver_price: Math.ceil(scope.get("driver_price") ?? 0),
      member_price: Math.ceil(scope.get("member_price") ?? 0),
      nonmember_price: Math.ceil(scope.get("nonmember_price") ?? 0),
      gas_budget,
      food_budget,
      other_budget,
      total_budget: gas_budget + food_budget + other_budget,
    };
  }, [
    formValues,
    compiledFormulas,
    trip.driver_spots,
    trip.end_date,
    trip.participant_spots,
    trip.start_date,
    trip.trip_guides.length,
  ]);
}

function BudgetForm({ trip, formulas }: { trip: TripData; formulas: string }) {
  const { mutateAsync: updateTrip, isPending: isSaving } = useUpdateTrip();

  const DEFAULT_MPG = 22;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BudgetFormData>({
    resolver: standardSchemaResolver(BudgetSchema),
    defaultValues: {
      breakfasts: trip.breakfasts ?? 0,
      lunches: trip.lunches ?? 0,
      dinners: trip.dinners ?? 0,
      snacks: trip.snacks ?? 0,
      total_miles: trip.total_miles ?? 0,
      cars: trip.car_mpgs?.map((mpg) => ({ mpg })) ?? [
        { mpg: DEFAULT_MPG },
        { mpg: DEFAULT_MPG },
      ],
      other_expenses: [],
    },
  });

  const {
    fields: carFields,
    append: appendCar,
    remove: removeCar,
  } = useFieldArray({
    control,
    name: "cars",
  });

  const {
    fields: expenseFields,
    append: appendExpense,
    remove: removeExpense,
  } = useFieldArray({
    control,
    name: "other_expenses",
  });

  const { inputs, scope, ...budgetTotals } = useBudgetTotals(
    control,
    formulas,
    trip,
  );

  const onSubmit = async (data: BudgetFormData) => {
    await updateTrip(
      {
        id: trip.id,
        breakfasts: data.breakfasts,
        lunches: data.lunches,
        dinners: data.dinners,
        snacks: data.snacks,
        total_miles: data.total_miles,
        car_mpgs: data.cars.map((c) => Number(c.mpg)) ?? [],
        other_expenses: data.other_expenses,
				budget_confirmed: true,
      },
      {
        onSuccess: () => {
          toast.success("Successfully saved budget");
          reset(data);
        },
        onError: (err) => {
          toast.error("Error: failed to save budget");
          console.error(err);
        },
      },
    );
  };

  useUnsavedChangesPrompt(isDirty);

  return (
    <div className="flex flex-col-reverse md:flex-row lg:flex-row gap-6">
      {/* Left column - Form sections */}

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {/* Section 1: Meals */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base font-medium">Meals</CardTitle>
            </div>
            <CardDescription>
              Number of times you will be having each meal, NOT meals times
              people
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Controller
                  control={control}
                  name="breakfasts"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Breakfasts</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        onWheel={(e) => e.currentTarget.blur()}
                        {...field}
                      />
                      <FieldError>{errors.breakfasts?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="lunches"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Lunches</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        onWheel={(e) => e.currentTarget.blur()}
                        {...field}
                      />
                      <FieldError>{errors.lunches?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="dinners"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Dinners</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        onWheel={(e) => e.currentTarget.blur()}
                        {...field}
                      />
                      <FieldError>{errors.dinners?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="snacks"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Snacks</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        onWheel={(e) => e.currentTarget.blur()}
                        {...field}
                      />
                      <FieldError>{errors.snacks?.message}</FieldError>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 2: Gas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base font-medium">Gas</CardTitle>
            </div>
            <CardDescription>
              Mileage and car MPGs for gas budget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Controller
                control={control}
                name="total_miles"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Total Miles (Round Trip)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...field}
                    />
                    <FieldError>{errors.total_miles?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cars</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendCar({ mpg: DEFAULT_MPG })}
                  className=""
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Car
                </Button>
              </div>
							<CardDescription className="-mt-2">
								Put {DEFAULT_MPG} for participant drivers
							</CardDescription>
              {errors.cars?.root && (
                <p className="text-sm text-destructive">
                  {errors.cars.root.message}
                </p>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {carFields.map((field, index) => (
                  <Item
                    key={field.id}
                    variant="muted"
                    size="sm"
                    className="border border-border"
                  >
                    <ItemContent>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="text-sm text-muted-foreground font-semibold shrink-0">
                          Car {index + 1}:
                        </div>
                        <Controller
                          control={control}
                          name={`cars.${index}.mpg`}
                          render={({ field }) => (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step={0.1}
                                className="w-20 h-8 no-spin"
                                onWheel={(e) => e.currentTarget.blur()}
                                {...field}
                                onChange={(e) => field.onChange(e)}
                              />
                              <span className="text-sm text-muted-foreground">
                                MPG
                              </span>
                            </div>
                          )}
                        />
                      </div>
                      {errors.cars?.[index]?.mpg && (
                        <span className="text-xs text-destructive">
                          {errors.cars[index].mpg.message}
                        </span>
                      )}
                    </ItemContent>
                    <ItemActions>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCar(index)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              </div>
              {carFields.length === 0 && (
                <div className="flex h-11.5">
                  <p className="text-muted-foreground text-sm m-auto">
                    No cars added
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Other Expenses */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base font-medium">
                Other Expenses
              </CardTitle>
            </div>
            <CardDescription>
              Parking fees, permits, rentals, campsite fees, and other costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenseFields.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableBody>
                    {expenseFields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="py-2 text-center text-muted-foreground text-sm">
                          {index + 1}
                        </TableCell>
                        <TableCell className="py-2">
                          <Controller
                            control={control}
                            name={`other_expenses.${index}.description`}
                            render={({ field }) => (
                              <div className="flex flex-col">
                                <Input
                                  placeholder="e.g., Campsite reservation"
                                  className="border-0 shadow-none px-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                                  {...field}
                                />
                                {errors.other_expenses?.[index]
                                  ?.description && (
                                  <span className="text-xs text-destructive">
                                    {
                                      errors.other_expenses[index].description
                                        .message
                                    }
                                  </span>
                                )}
                              </div>
                            )}
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          <Controller
                            control={control}
                            name={`other_expenses.${index}.cost`}
                            render={({ field }) => (
                              <div className="flex flex-col items-end">
                                <div className="flex items-center justify-end gap-1">
                                  <InputGroup className="border-0 shadow-none h-8 w-30 has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                                    <InputGroupInput
                                      type="number"
                                      min={0}
                                      step={0.01}
                                      placeholder="0.00"
                                      className="border-0 shadow-none px-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0"
                                      onWheel={(e) => e.currentTarget.blur()}
                                      {...field}
                                      onChange={(e) => field.onChange(e)}
                                    />
                                    <InputGroupAddon className="border-0 bg-transparent">
                                      <span className="text-muted-foreground">
                                        $
                                      </span>
                                    </InputGroupAddon>
                                  </InputGroup>
                                </div>
                                {errors.other_expenses?.[index]?.cost && (
                                  <div className="text-xs text-destructive">
                                    {errors.other_expenses[index].cost.message}
                                  </div>
                                )}
                              </div>
                            )}
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExpense(index)}
                            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="border border-dashed rounded-md py-3.5 text-center">
                <p className="text-sm text-muted-foreground">
                  No other expenses added yet
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendExpense({ description: "", cost: 0 })}
              className="w-full"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div id="confirm" className="flex justify-end pt-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save Budget"
            )}
          </Button>
        </div>
      </form>

      {/* Right column - Preview */}
      <div className="lg:w-80 lg:shrink-0">
        <Card className="lg:sticky lg:top-6">
          <CardHeader className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base font-medium">
                  Budget & Prices
                </CardTitle>
              </div>
              <BudgetFormulasDialog
                formulas={formulas}
                inputs={inputs}
                scope={scope}
              />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Calculated for {inputs.num_participants} participants
              {inputs.num_participant_drivers > 0
                ? `, ${inputs.num_participant_drivers} driver${inputs.num_participant_drivers > 1 ? "s" : ""}, `
                : " "}
              and {inputs.num_guides} guides{" "}
              {inputs.num_nights > 0
                ? `over ${inputs.num_nights} night
              ${inputs.num_nights > 1 ? "s" : ""}`
                : " on a day trip"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="font-medium">Budget</p>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Food</span>
                <span>{formatCurrency(budgetTotals.food_budget)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gas</span>
                <span>{formatCurrency(budgetTotals.gas_budget)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Other</span>
                <span>{formatCurrency(budgetTotals.other_budget)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span>{formatCurrency(budgetTotals.total_budget)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <p className="font-medium">Prices</p>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member</span>
                {trip.member_price_override != null ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium text-blue-500 cursor-help">
                        {formatCurrency(trip.member_price_override)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      This price has been overridden manually
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.member_price)}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Non-Member</span>
                {trip.nonmember_price_override != null ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium text-blue-500 cursor-help">
                        {formatCurrency(trip.nonmember_price_override)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      This price has been overridden manually
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.nonmember_price)}
                  </span>
                )}
              </div>
              {trip.driver_spots > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Driver</span>
                  {trip.driver_price_override != null ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium text-blue-500 cursor-help">
                          {formatCurrency(trip.driver_price_override)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        This price has been overridden manually
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="font-medium">
                      {formatCurrency(budgetTotals.driver_price)}
                    </span>
                  )}
                </div>
              )}
              <PriceOverrideDialog
                tripId={trip.id}
                calculatedPrices={budgetTotals}
                currentOverrides={{
                  member: trip.member_price_override,
                  nonmember: trip.nonmember_price_override,
                  driver: trip.driver_price_override,
                }}
                hasDriverSpots={trip.driver_spots > 0}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

