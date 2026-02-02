"use client";

import { useGuides } from "@/data/client/users/get-guides";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

type GuideMultiSelectProps = {
  values: string[];
  onValuesChange: (values: string[]) => void;
  excludeUserIds?: string[];
  placeholder?: string;
  disabled?: boolean;
};

export function GuideMultiSelect({
  values,
  onValuesChange,
  excludeUserIds = [],
  placeholder = "Select guides",
  disabled = false,
}: GuideMultiSelectProps) {
  const { data: guidesData, isLoading } = useGuides();
  const guides = guidesData ?? [];
  const excludeSet = new Set(excludeUserIds);

  return (
    <MultiSelect values={values} onValuesChange={onValuesChange}>
      <MultiSelectTrigger className="w-full" disabled={disabled}>
        <MultiSelectValue placeholder={placeholder} />
      </MultiSelectTrigger>
      <MultiSelectContent>
        {isLoading ? (
          <div className="p-2 text-sm text-muted-foreground text-center">
            Loading guides...
          </div>
        ) : (
          guides
            .filter((guide) => !excludeSet.has(guide.user_id))
            .map((guide) => (
              <MultiSelectItem key={guide.user_id} value={guide.user_id}>
                {guide.profiles.first_name} {guide.profiles.last_name}
              </MultiSelectItem>
            ))
        )}
      </MultiSelectContent>
    </MultiSelect>
  );
}
