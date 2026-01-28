"use client";

import { useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Plus, Trash2, Car, Utensils, Receipt, Calculator } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Badge } from "@/components/ui/badge";

// Budget constants
const MEAL_PRICES = {
  breakfast: 5,
  lunch: 8,
  dinner: 12,
  snack: 3,
} as const;

const GAS_PRICE_PER_GALLON = 4.5;
const MEMBER_DISCOUNT = 5;
const DRIVER_DISCOUNT_PERCENT = 0.5;

const BudgetSchema = z.object({
  meals: z.object({
    breakfasts: z.coerce.number().min(0, "Must be 0 or more"),
    lunches: z.coerce.number().min(0, "Must be 0 or more"),
    dinners: z.coerce.number().min(0, "Must be 0 or more"),
    snacks: z.coerce.number().min(0, "Must be 0 or more"),
  }),
  totalMiles: z.coerce.number().min(0, "Must be 0 or more"),
  cars: z.array(
    z.object({
      mpg: z.coerce.number().min(1, "MPG must be at least 1"),
    }),
  ),
  otherExpenses: z.array(
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
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: standardSchemaResolver(BudgetSchema),
    defaultValues: {
      meals: {
        breakfasts: 0,
        lunches: 0,
        dinners: 0,
        snacks: 0,
      },
      totalMiles: 0,
      cars: [{ mpg: 0 }, { mpg: 0 }],
      otherExpenses: [],
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
    name: "otherExpenses",
  });

  // Watch all form values for real-time calculations
  const meals = watch("meals");
  const totalMiles = watch("totalMiles");
  const cars = watch("cars");
  const otherExpenses = watch("otherExpenses");

  // Calculate budget totals
  const budgetTotals = useMemo(() => {
    const totalParticipants = 10;

    // Food costs
    const foodCostPerPerson =
      meals.breakfasts * MEAL_PRICES.breakfast +
      meals.lunches * MEAL_PRICES.lunch +
      meals.dinners * MEAL_PRICES.dinner +
      meals.snacks * MEAL_PRICES.snack;
    const totalFoodCost = foodCostPerPerson * totalParticipants;

    // Gas costs
    const avgMpg =
      cars.length > 0
        ? cars.reduce((sum, car) => sum + (car.mpg || 0), 0) / cars.length
        : 25;
    const totalGallons = avgMpg > 0 ? totalMiles / avgMpg : 0;
    const totalGasCost = totalGallons * GAS_PRICE_PER_GALLON;
    const gasCostPerPerson =
      totalParticipants > 0 ? totalGasCost / totalParticipants : 0;

    // Other expenses
    const totalOtherExpenses = otherExpenses.reduce(
      (sum, e) => sum + (e.cost || 0),
      0,
    );
    const otherCostPerPerson =
      totalParticipants > 0 ? totalOtherExpenses / totalParticipants : 0;

    // Total trip budget
    const totalTripBudget = totalFoodCost + totalGasCost + totalOtherExpenses;

    // Per-person base cost
    const baseCostPerPerson =
      foodCostPerPerson + gasCostPerPerson + otherCostPerPerson;

    // Participant prices
    const nonMemberPrice = Math.ceil(baseCostPerPerson);
    const memberPrice = Math.max(0, nonMemberPrice - MEMBER_DISCOUNT);
    const driverPrice = Math.ceil(
      baseCostPerPerson * (1 - DRIVER_DISCOUNT_PERCENT),
    );

    return {
      totalFoodCost,
      totalGasCost,
      totalOtherExpenses,
      totalTripBudget,
      memberPrice,
      nonMemberPrice,
      driverPrice,
    };
  }, [meals, totalMiles, cars, otherExpenses]);

  const onSubmit = (data: BudgetFormData) => {
    console.log("Budget data:", data, budgetTotals);
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
                    name="meals.breakfasts"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Breakfasts</FieldLabel>
                        <Input type="number" min={0} {...field} />
                        <FieldError>
                          {errors.meals?.breakfasts?.message}
                        </FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="meals.lunches"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Lunches</FieldLabel>
                        <Input type="number" min={0} {...field} />
                        <FieldError>
                          {errors.meals?.lunches?.message}
                        </FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="meals.dinners"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Dinners</FieldLabel>
                        <Input type="number" min={0} {...field} />
                        <FieldError>
                          {errors.meals?.dinners?.message}
                        </FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="meals.snacks"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Snacks</FieldLabel>
                        <Input type="number" min={0} {...field} />
                        <FieldError>{errors.meals?.snacks?.message}</FieldError>
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
                  name="totalMiles"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Total Miles (Round Trip)</FieldLabel>
                      <Input type="number" min={0} placeholder="0" {...field} />
                      <FieldError>{errors.totalMiles?.message}</FieldError>
                    </Field>
                  )}
                />
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-medium">Cars</span>
                    <Badge variant={"secondary"}>{carFields.length}</Badge>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendCar({ mpg: 22 })}
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
                  <div className="flex"></div>
                </div>
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
                              name={`otherExpenses.${index}.description`}
                              render={({ field }) => (
                                <div className="flex flex-col">
                                  <Input
                                    placeholder="e.g., Campsite reservation"
                                    className="border-0 shadow-none px-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    {...field}
                                  />
                                  {errors.otherExpenses?.[index]
                                    ?.description && (
                                    <span className="text-xs text-destructive">
                                      {
                                        errors.otherExpenses[index].description
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
                              name={`otherExpenses.${index}.cost`}
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
                                        {...field}
                                      />
                                      <InputGroupAddon className="border-0 bg-transparent">
                                        <span className="text-muted-foreground">
                                          $
                                        </span>
                                      </InputGroupAddon>
                                    </InputGroup>
                                  </div>
                                  {errors.otherExpenses?.[index]?.cost && (
                                    <div className="text-xs text-destructive">
                                      {errors.otherExpenses[index].cost.message}
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
            <Button type="submit">Save Budget</Button>
          </div>
        </div>

        {/* Right column - Preview */}
        <div className="lg:w-80 lg:shrink-0">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base font-medium">
                  Budget & Prices
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="font-medium">Budget</p>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Food</span>
                  <span>{formatCurrency(budgetTotals.totalFoodCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gas</span>
                  <span>{formatCurrency(budgetTotals.totalGasCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Other</span>
                  <span>{formatCurrency(budgetTotals.totalOtherExpenses)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total</span>
                  <span>{formatCurrency(budgetTotals.totalTripBudget)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <p className="font-medium">Prices</p>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Member</span>
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.memberPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Non-Member</span>
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.nonMemberPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.driverPrice)}
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
