import {
  Item,
  ItemMedia,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface TripDetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  titleAction?: ReactNode;
}

export function TripDetailItem({
  icon: Icon,
  label,
  value,
  titleAction,
}: TripDetailItemProps) {

  return (
    <Item variant="outline" className="items-start bg-muted/30">
      <ItemMedia>
        <Icon className="h-5 w-5" />
      </ItemMedia>
      <ItemContent>
        <div className="flex items-center justify-between w-full">
          <ItemTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {label}
          </ItemTitle>
          {titleAction}
        </div>
        <ItemDescription className="font-medium text-foreground">
          {value}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
