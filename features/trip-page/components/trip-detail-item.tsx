import {
  Item,
  ItemMedia,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemFooter,
} from "@/components/ui/item";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface TripDetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  footer?: ReactNode;
  details?: string | string[];
}

export function TripDetailItem({
  icon: Icon,
  label,
  value,
  footer,
  details,
}: TripDetailItemProps) {
  const detailsArray = Array.isArray(details) ? details : details ? [details] : [];

  return (
    <Item variant="outline" className="p-4 items-start">
      <ItemMedia>
        <Icon className="h-5 w-5 text-primary" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {label}
        </ItemTitle>
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
        {footer}
      </ItemContent>
    </Item>
  );
}
