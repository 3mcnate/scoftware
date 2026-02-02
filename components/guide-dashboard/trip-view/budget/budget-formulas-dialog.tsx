"use client";

import { Button } from "@/components/ui/button";
import {
  Info,
} from "lucide-react";
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
import { BudgetInputs } from "@/utils/math";


export function BudgetFormulasDialog({
	formulas,
	inputs,
	scope,
}: {
	formulas: string;
	inputs: BudgetInputs;
	scope: Map<string, number>;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="icon" variant="ghost">
					<Info className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="min-w-[400px] md:min-w-[800px]!">
				<DialogHeader>
					<DialogTitle>Budget Formulas</DialogTitle>
					<DialogDescription>
						View the budget formulas used to calculate the prices and budget for
						this trip.
					</DialogDescription>
				</DialogHeader>
				<div className="h-128 overflow-scroll">
					<pre className="text-sm"># Inputs from your trip</pre>
					{Object.entries(inputs).map(([key, value]) => (
						<pre key={key} className="text-sm">
							{key} = <span className="text-blue-500">{value}</span>
						</pre>
					))}
					<pre className="text-sm mt-3">{formulas}</pre>
					<p className="text-sm font-semibold mb-3">All calculated values:</p>
					{Array.from(scope.entries()).map(([key, value]) => (
						<pre key={key} className="text-sm">
							{key} = <span className="text-blue-500">{value}</span>
						</pre>
					))}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={"outline"}>Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
