import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Info } from "lucide-react"

export function DifficultyModal() {
  const difficultyLevels = [
    { level: 1, description: "No physical activity." },
    { level: 2, description: "Leisurely walk." },
    {
      level: 3,
      description:
        "2-5 miles less than 1000 ft of total elevation gain on well maintained trails. About 2-3 hours continuous activity",
    },
    {
      level: 4,
      description:
        "4-6 miles, about 1000 ft of elevation gain, well maintained trails. About 3 hours of continuous activity.",
    },
    {
      level: 5,
      description: "6-8 miles, about 1500ft of elevation gain on maintained trials. 4-5 hours continuous activity",
    },
    {
      level: 6,
      description:
        "8-10 miles, about 2000 ft of elevation gain, well maintained trails. 4-6 hours of continuous activity.",
    },
    {
      level: 7,
      description:
        "10-14 miles, over 2500 ft of elevation gain, variable trail conditions possible. Full day of continuous activity.",
    },
    {
      level: 8,
      description:
        "At high altitude. 12-16 total miles, over 3000 ft of elevation gain, variable trail conditions possible. Full day of continuous activity.",
    },
    {
      level: 9,
      description:
        "Technical skills may be necessary. At high altitude with physical elevation gain. Scrambling over rocks likely involved.",
    },
    { level: 10, description: "u gunna die" },
  ]

  return (
    <Dialog>
      <DialogTrigger className="hover:underline text-xs gap-1 flex text-muted-foreground">
        Rating System
        <Info className="size-4" strokeWidth={1.5} />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Trip Difficulty Rating System</DialogTitle>
          <DialogDescription>
            Understand what each difficulty level means for physical activity and experience required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {difficultyLevels.map((item) => (
            <div key={item.level} className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {item.level}
                </div>
                <p className="text-sm leading-relaxed text-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">
          **If you have any questions or concerns about the physical activity, recommended prior experience, or gear
          needed on any kind of trip please contact the guides as soon as possible!!
        </p>
      </DialogContent>
    </Dialog>
  )
}
