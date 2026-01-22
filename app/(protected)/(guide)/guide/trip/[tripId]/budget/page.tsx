"use client"

import { useForm, useFieldArray, Controller } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { z } from "zod/v4"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Plus, Trash2 } from "lucide-react"

const BudgetSchema = z.object({
  meals: z.object({
    breakfasts: z.coerce.number().min(0, "Must be 0 or more"),
    lunches: z.coerce.number().min(0, "Must be 0 or more"),
    dinners: z.coerce.number().min(0, "Must be 0 or more"),
    snacks: z.coerce.number().min(0, "Must be 0 or more"),
  }),
  totalMiles: z.coerce.number().min(0, "Must be 0 or more"),
  cars: z
    .array(
      z.object({
        mpg: z.coerce.number().min(1, "MPG must be at least 1"),
      })
    )
    .min(1, "At least one car is required"),
  miscExpenses: z.array(
    z.object({
      description: z.string().min(1, "Description required"),
      cost: z.coerce.number().min(0.01, "Cost must be greater than 0"),
    })
  ),
})

type BudgetFormData = z.infer<typeof BudgetSchema>

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
      cars: [{ mpg: 25 }],
      miscExpenses: [],
    },
  })

  const {
    fields: carFields,
    append: appendCar,
    remove: removeCar,
  } = useFieldArray({
    control,
    name: "cars",
  })

  const {
    fields: expenseFields,
    append: appendExpense,
    remove: removeExpense,
  } = useFieldArray({
    control,
    name: "miscExpenses",
  })

  const miscExpenses = watch("miscExpenses")
  const totalMiscCost = miscExpenses.reduce((sum, e) => sum + (e.cost || 0), 0)

  const onSubmit = (data: BudgetFormData) => {
    console.log("Budget data:", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Meals */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Meals</CardTitle>
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
                    <FieldError>{errors.meals?.breakfasts?.message}</FieldError>
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
                    <FieldError>{errors.meals?.lunches?.message}</FieldError>
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
                    <FieldError>{errors.meals?.dinners?.message}</FieldError>
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

      {/* Section 2: Mileage */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Mileage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Controller
            control={control}
            name="totalMiles"
            render={({ field }) => (
              <Field className="max-w-xs">
                <FieldLabel>Total Miles Driven</FieldLabel>
                <Input type="number" min={0} placeholder="0" {...field} />
                <FieldError>{errors.totalMiles?.message}</FieldError>
              </Field>
            )}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cars</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendCar({ mpg: 25 })}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Car
              </Button>
            </div>
            {errors.cars?.root && (
              <p className="text-sm text-destructive">{errors.cars.root.message}</p>
            )}
            <div className="space-y-2">
              {carFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-14 shrink-0">
                    Car {index + 1}
                  </span>
                  <Controller
                    control={control}
                    name={`cars.${index}.mpg`}
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          className="w-20"
                          {...field}
                        />
                        <span className="text-sm text-muted-foreground">MPG</span>
                      </div>
                    )}
                  />
                  {errors.cars?.[index]?.mpg && (
                    <span className="text-sm text-destructive">
                      {errors.cars[index].mpg.message}
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCar(index)}
                    disabled={carFields.length === 1}
                    className="text-muted-foreground hover:text-destructive ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Miscellaneous Expenses */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Miscellaneous Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenseFields.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-36 text-right">Cost</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseFields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell className="py-2">
                      <Controller
                        control={control}
                        name={`miscExpenses.${index}.description`}
                        render={({ field }) => (
                          <div>
                            <Input
                              placeholder="Description"
                              className="border-0 shadow-none px-0 h-8 focus-visible:ring-0"
                              {...field}
                            />
                            {errors.miscExpenses?.[index]?.description && (
                              <span className="text-xs text-destructive">
                                {errors.miscExpenses[index].description.message}
                              </span>
                            )}
                          </div>
                        )}
                      />
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <Controller
                        control={control}
                        name={`miscExpenses.${index}.cost`}
                        render={({ field }) => (
                          <div>
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-muted-foreground">$</span>
                              <Input
                                type="number"
                                min={0}
                                step={0.01}
                                placeholder="0.00"
                                className="border-0 shadow-none px-0 h-8 w-20 text-right focus-visible:ring-0"
                                {...field}
                              />
                            </div>
                            {errors.miscExpenses?.[index]?.cost && (
                              <span className="text-xs text-destructive">
                                {errors.miscExpenses[index].cost.message}
                              </span>
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
                {expenseFields.length > 0 && (
                  <TableRow className="border-t-2">
                    <TableCell className="font-medium py-2">Total</TableCell>
                    <TableCell className="text-right font-medium py-2">
                      ${totalMiscCost.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground py-3 text-center">
              No expenses added yet.
            </p>
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
    </form>
  )
}
