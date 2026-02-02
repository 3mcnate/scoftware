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
  Info,
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
import { BudgetFormSkeleton } from "@/components/guide-dashboard/trip-view/budget-form-skeleton";
import { differenceInCalendarDays } from "date-fns";
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
import { getAverageMPGs } from "@/utils/math";
import { Spinner } from "@/components/ui/spinner";

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

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

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

function BudgetForm({ trip, formulas }: { trip: TripData; formulas: string }) {
	"use no memo";

  const { mutateAsync: updateTrip, isPending: isSaving } = useUpdateTrip();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: standardSchemaResolver(BudgetSchema),
    defaultValues: {
      breakfasts: 0,
      lunches: 0,
      dinners: 0,
      snacks: 0,
      total_miles: 0,
      cars: [{ mpg: 25 }, { mpg: 25 }],
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

  const cars = useWatch({ control, name: "cars" });
  const breakfasts = useWatch({ control, name: "breakfasts" });
  const lunches = useWatch({ control, name: "lunches" });
  const dinners = useWatch({ control, name: "dinners" });
  const snacks = useWatch({ control, name: "snacks" });
  const totalMiles = useWatch({ control, name: "total_miles" });
  const otherExpenses = useWatch({ control, name: "other_expenses" });

  const compiledFormulas = useMemo(() => {
    return compile(formulas);
  }, [formulas]);

  // Calculate budget totals
  const budgetTotals = useMemo(() => {
    const scope: Map<string, number> = new Map(
      Object.entries({
        breakfasts: breakfasts ?? 0,
        lunches: lunches ?? 0,
        dinners: dinners ?? 0,
        snacks: snacks ?? 0,
        total_miles: totalMiles ?? 0,
        num_cars: cars?.length ?? 0,
        average_mpg: getAverageMPGs(cars?.map((c) => c.mpg) ?? []),
        total_other_expenses:
          otherExpenses?.reduce((prev, { cost }) => prev + cost, 0) ?? 0,
        num_participants: trip.participant_spots,
        num_participant_drivers: trip.driver_spots,
        num_guides: trip.trip_guides.length,
        num_nights: differenceInCalendarDays(
          new Date(trip.end_date),
          new Date(trip.start_date),
        ),
      }),
    );

    compiledFormulas.evaluate(scope);

    const gas_budget = scope.get("gas_budget") ?? 0;
    const food_budget = scope.get("food_budget") ?? 0;
    const other_budget = scope.get("other_budget") ?? 0;

    return {
      driver_price: Math.ceil(scope.get("driver_price") ?? 0),
      member_price: Math.ceil(scope.get("member_price") ?? 0),
      nonmember_price: Math.ceil(scope.get("nonmember_price") ?? 0),
      gas_budget,
      food_budget,
      other_budget,
      total_budget: gas_budget + food_budget + other_budget,
    };
  }, [
    breakfasts,
    lunches,
    dinners,
    snacks,
    totalMiles,
    cars,
    otherExpenses,
    compiledFormulas,
    trip.driver_spots,
    trip.end_date,
    trip.participant_spots,
    trip.start_date,
    trip.trip_guides.length,
  ]);

  const onSubmit = (data: BudgetFormData) => {
    console.log("Budget data:", data, budgetTotals);
    updateTrip({
      ...data,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Form sections */}
        <div className="flex-1 space-y-6">
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
                    onClick={() => appendCar({ mpg: 25 })}
                    className=""
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Car
                  </Button>
                </div>
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
                                  className="w-20 h-8"
                                  onWheel={(e) => e.currentTarget.blur()}
                                  {...field}
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
                {cars.length === 0 && (
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
                                      {
                                        errors.other_expenses[index].cost
                                          .message
                                      }
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
          <div className="flex justify-end pt-2">
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
        </div>

        {/* Right column - Preview */}
        <div className="lg:w-80 lg:shrink-0">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base font-medium">
                    Budget & Prices
                  </CardTitle>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Info className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Budget Formulas</DialogTitle>
                      <DialogDescription>
                        View the budget formulas used to calculate the prices
                        and budget for this trip.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="h-128 overflow-scroll">
                      <pre className="text-sm">{formulas}</pre>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant={"outline"}>Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
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
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.member_price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Non-Member</span>
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.nonmember_price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.driver_price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
