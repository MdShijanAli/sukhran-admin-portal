import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  subWeeks,
} from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

interface BaseDatePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  numberOfMonths?: number;
  disabled?: boolean;
}

export function BaseDatePicker({
  value,
  onChange,
  placeholder,
  className,
  numberOfMonths = 2,
  disabled = false,
}: BaseDatePickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setIsOpen(false);
  };

  const presetRanges = [
    {
      label: t("today") || "Today",
      getValue: () => {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    {
      label: t("yesterday") || "Yesterday",
      getValue: () => {
        const yesterday = subDays(new Date(), 1);
        return { from: yesterday, to: yesterday };
      },
    },
    {
      label: t("lastWeek") || "Last Week",
      getValue: () => {
        const today = new Date();
        const lastWeekStart = startOfWeek(subWeeks(today, 1));
        const lastWeekEnd = endOfWeek(subWeeks(today, 1));
        return { from: lastWeekStart, to: lastWeekEnd };
      },
    },
    {
      label: t("thisMonth") || "This Month",
      getValue: () => {
        const today = new Date();
        return { from: startOfMonth(today), to: endOfMonth(today) };
      },
    },
    {
      label: t("lastMonth") || "Last Month",
      getValue: () => {
        const today = new Date();
        const lastMonth = subMonths(today, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      },
    },
    {
      label: t("thisYear") || "This Year",
      getValue: () => {
        const today = new Date();
        return { from: startOfYear(today), to: endOfYear(today) };
      },
    },
    {
      label: t("lastYear") || "Last Year",
      getValue: () => {
        const today = new Date();
        const lastYear = subMonths(today, 12);
        return { from: startOfYear(lastYear), to: endOfYear(lastYear) };
      },
    },
  ];

  const handlePresetClick = (range: DateRange | undefined) => {
    onChange(range);
    if (range) {
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full sm:w-[280px] justify-start text-left font-normal z-10",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "LLL dd, y")} -{" "}
                {format(value.to, "LLL dd, y")}
              </>
            ) : (
              format(value.from, "LLL dd, y")
            )
          ) : (
            <span>
              {placeholder || t("selectDateRange") || "Pick a date range"}
            </span>
          )}
          {value && (
            <span className="z-50" onClick={handleClear}>
              <X className="ml-auto h-4 w-4 hover:opacity-70" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Preset Options Sidebar */}
          <div className="border-r p-2 flex flex-col gap-1 min-w-[140px]">
            {presetRanges.map((preset, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handlePresetClick(preset.getValue())}
                className="justify-start font-normal"
              >
                {preset.label}
              </Button>
            ))}
            <div className="border-t my-1" />
            <Button
              variant="dark"
              size="sm"
              onClick={() => handlePresetClick(undefined)}
              className="justify-start font-normal"
            >
              {t("reset") || "Reset"}
            </Button>
          </div>

          {/* Calendar */}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={(range) => {
              onChange(range);
              // Auto-close when both dates are selected
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={numberOfMonths}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
