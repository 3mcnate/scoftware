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
  details?: string | string[];
}

export function TripDetailItem({
  icon: Icon,
  label,
  value,
  titleAction,
  details,
}: TripDetailItemProps) {
  const detailsArray = Array.isArray(details) ? details : details ? [details] : [];

  return (
    <Item variant="outline" className="items-start">
      <ItemMedia>
        <Icon className="h-5 w-5 text-primary" />
      </ItemMedia>
      <ItemContent>
        <div className="flex items-center justify-between w-full">
          <ItemTitle>
            {label}
          </ItemTitle>
          {titleAction}
        </div>
        <ItemDescription>
          {value}
        </ItemDescription>
        {detailsArray.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {detailsArray.map((detail, index) => (
              <p key={index} className="text-xs text-muted-foreground">
                {detail}
              </p>
            ))}
          </div>
        )}
      </ItemContent>
    </Item>
  );
}
