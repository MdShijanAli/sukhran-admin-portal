import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxSelectProps<T> {
  options: T[];
  value: string | number;
  onValueChange: (value: string | number) => void;
  onSelect?: (item: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  getOptionValue: (option: T) => string | number;
  getOptionLabel: (option: T) => string;
  renderOption?: (option: T) => React.ReactNode;
  renderTrigger?: (selected: T | undefined) => React.ReactNode;
  icon?: React.ReactNode;
}

export function ComboboxSelect<T>({
  options,
  value,
  onValueChange,
  onSelect,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  isLoading = false,
  disabled = false,
  className,
  getOptionValue,
  getOptionLabel,
  renderOption,
  renderTrigger,
  icon,
}: ComboboxSelectProps<T>) {
  const [open, setOpen] = useState(false);

  //   console.log("ComboboxSelect value:", value);
  const selectedOption = options.find((option) => {
    console.log("Comparing:", getOptionValue(option), "with", value);
    return getOptionValue(option) === value;
  });

  console.log("Selected Option:", selectedOption);

  const handleSelect = (option: T) => {
    const optionValue = getOptionValue(option);
    onValueChange(optionValue);
    if (onSelect) {
      onSelect(option);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
        >
          {renderTrigger && selectedOption
            ? renderTrigger(selectedOption)
            : selectedOption
            ? getOptionLabel(selectedOption)
            : placeholder}
          {icon || (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{isLoading ? "Loading..." : emptyText}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option, index) => {
              const optionValue = getOptionValue(option);
              const isSelected = value === optionValue;

              return (
                <CommandItem
                  key={`${optionValue}-${index}`}
                  value={getOptionLabel(option)}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {renderOption ? renderOption(option) : getOptionLabel(option)}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
