"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Save } from "lucide-react"

interface BudgetItem {
  id: number
  description: string
  category: string
  amount: number
}

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<BudgetItem[]>([
    { id: 1, description: "Transportation - Bus rental", category: "Transport", amount: 450 },
    { id: 2, description: "Permits and park fees", category: "Fees", amount: 120 },
    { id: 3, description: "Group camping gear rental", category: "Equipment", amount: 200 },
    { id: 4, description: "First aid supplies", category: "Safety", amount: 50 },
    { id: 5, description: "Group meals (Day 1)", category: "Food", amount: 180 },
  ])

  const [newExpense, setNewExpense] = useState({ description: "", category: "", amount: "" })

  const tripFee = 75
  const participants = 12
  const totalRevenue = tripFee * participants
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const netBalance = totalRevenue - totalExpenses

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          description: newExpense.description,
          category: newExpense.category || "Other",
          amount: Number.parseFloat(newExpense.amount),
        },
      ])
      setNewExpense({ description: "", category: "", amount: "" })
    }
  }

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold text-green-600">${totalRevenue}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {participants} participants × ${tripFee}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-600">${totalExpenses}</p>
                <p className="text-xs text-muted-foreground mt-1">{expenses.length} expense items</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p className={`text-2xl font-semibold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${netBalance}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{netBalance >= 0 ? "Under budget" : "Over budget"}</p>
              </div>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${netBalance >= 0 ? "bg-green-100" : "bg-red-100"}`}
              >
                <DollarSign className={`h-6 w-6 ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip Fee Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Fee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-2 flex-1 max-w-xs">
              <Label htmlFor="tripFee">Fee per participant</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="tripFee" type="number" defaultValue={75} className="pl-9" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Current revenue: ${tripFee} × {participants} = ${totalRevenue}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExpense(expense.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add Expense Form */}
          <div className="flex gap-3 pt-4 border-t">
            <Input
              placeholder="Expense description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-32"
            />
            <div className="relative w-28">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="pl-9"
              />
            </div>
            <Button onClick={addExpense} variant="outline" className="bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Budget
        </Button>
      </div>
    </div>
  )
}
