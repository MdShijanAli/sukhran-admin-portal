import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, RefreshCw, X } from "lucide-react";
import { ApiService } from "@/services/createApiService";
import { StoreWithData } from "../table/BaseTableList";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";

interface ComboboxSelectProps<T> {
  // Static options (use this OR service/store)
  options?: T[];
  value: string | number | (string | number)[];
  onValueChange: (value: string | number | (string | number)[]) => void;
  onSelect?: (item: T | T[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  getOptionValue: (option: T) => string | number;
  getOptionLabel: (option: T) => string;
  renderOption?: (option: T) => React.ReactNode;
  renderTrigger?: (selected: T | T[] | undefined) => React.ReactNode;
  icon?: React.ReactNode;
  // Service integration (alternative to static options)
  service?: ApiService<T>;
  serviceMethod?: keyof ApiService<T>;
  store?: StoreWithData<T>;
  // Store data key (e.g., 'products', 'packages', 'users')
  storeDataKey?: string;
  // Additional query params
  additionalParams?: Record<string, string>;
  // Enable search with API
  enableApiSearch?: boolean;
  // Multi-select mode
  multiple?: boolean;
  maxSelections?: number;
  showSelectedCount?: boolean;
}

export function ComboboxSelect<T>({
  options: staticOptions,
  value,
  onValueChange,
  onSelect,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  isLoading: externalLoading = false,
  disabled = false,
  className,
  getOptionValue,
  getOptionLabel,
  renderOption,
  renderTrigger,
  icon,
  service,
  serviceMethod,
  store,
  storeDataKey = "data",
  additionalParams = {},
  enableApiSearch = true,
  multiple = false,
  maxSelections,
  showSelectedCount = true,
}: ComboboxSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasFetchedInitial, setHasFetchedInitial] = useState(false);

  // Determine data source: static options or store data
  const getOptionsFromStore = (): T[] => {
    if (!store) return [];
    // Try to get data from store using storeDataKey
    const storeData = (store as any)[storeDataKey];
    return Array.isArray(storeData) ? storeData : [];
  };

  const options = staticOptions || getOptionsFromStore();
  const isLoading =
    externalLoading || internalLoading || store?.isLoading || false;

  // Fetch data from API
  const fetchData = async (search?: string) => {
    if (!service || !store) {
      console.warn(
        "ComboboxSelect: service and store required for API fetching",
      );
      return;
    }

    try {
      setInternalLoading(true);

      // Build query params
      const params = new URLSearchParams();

      if (search && enableApiSearch) {
        params.append("search", search);
      }

      // Add additional params
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const queryString = params.toString();

      // Call service method
      if (serviceMethod && typeof service[serviceMethod] === "function") {
        await (service[serviceMethod] as any)(queryString);
      } else if (typeof service.fetchLists === "function") {
        await service.fetchLists(queryString);
      } else {
        console.error("ComboboxSelect: No valid service method found");
      }
    } catch (error) {
      console.error("ComboboxSelect: Failed to fetch data:", error);
      toast.error("Failed to load options");
    } finally {
      setInternalLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (service && store && !staticOptions) {
      const storeData = getOptionsFromStore();
      // Only fetch if store is empty and we haven't fetched yet
      if (storeData.length === 0 && !hasFetchedInitial) {
        fetchData();
        setHasFetchedInitial(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, staticOptions]);

  // Handle search with debouncing
  useEffect(() => {
    if (service && store && enableApiSearch && searchQuery) {
      const debounce = setTimeout(() => {
        fetchData(searchQuery);
      }, 300);

      return () => clearTimeout(debounce);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Normalize value to array for easier handling
  const valueArray = Array.isArray(value) ? value : value ? [value] : [];

  const selectedOptions = options.filter((option) => {
    const optionValue = getOptionValue(option);
    return valueArray.includes(optionValue);
  });

  const handleSelect = (option: T) => {
    const optionValue = getOptionValue(option);

    if (multiple) {
      const isSelected = valueArray.includes(optionValue);

      if (isSelected) {
        // Remove from selection
        const newValue = valueArray.filter((v) => v !== optionValue);
        onValueChange(newValue);
        if (onSelect) {
          const newSelectedOptions = options.filter((opt) =>
            newValue.includes(getOptionValue(opt)),
          );
          onSelect(newSelectedOptions);
        }
      } else {
        // Add to selection (check max limit)
        if (maxSelections && valueArray.length >= maxSelections) {
          toast.error(`You can only select up to ${maxSelections} items`);
          return;
        }
        const newValue = [...valueArray, optionValue];
        onValueChange(newValue);
        if (onSelect) {
          const newSelectedOptions = options.filter((opt) =>
            newValue.includes(getOptionValue(opt)),
          );
          onSelect(newSelectedOptions);
        }
      }
    } else {
      // Single select
      onValueChange(optionValue);
      if (onSelect) {
        onSelect(option);
      }
      setOpen(false);
    }
  };

  const handleRemoveItem = (
    optionValue: string | number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (multiple) {
      const newValue = valueArray.filter((v) => v !== optionValue);
      onValueChange(newValue);
      if (onSelect) {
        const newSelectedOptions = options.filter((opt) =>
          newValue.includes(getOptionValue(opt)),
        );
        onSelect(newSelectedOptions);
      }
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(multiple ? [] : "");
    if (onSelect) {
      onSelect(multiple ? [] : ({} as T));
    }
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
            "w-full justify-between min-h-10 h-auto",
            !valueArray.length && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex-1 flex items-center gap-1 flex-wrap">
            {renderTrigger && selectedOptions.length > 0 ? (
              renderTrigger(multiple ? selectedOptions : selectedOptions[0])
            ) : selectedOptions.length > 0 ? (
              multiple ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {showSelectedCount && selectedOptions.length > 2 ? (
                    <Badge variant="secondary" className="rounded-sm">
                      {selectedOptions.length} selected
                    </Badge>
                  ) : (
                    selectedOptions.map((option) => (
                      <Badge
                        key={getOptionValue(option)}
                        variant="secondary"
                        className="rounded-sm gap-1"
                      >
                        {getOptionLabel(option)}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={(e) =>
                            handleRemoveItem(getOptionValue(option), e)
                          }
                        />
                      </Badge>
                    ))
                  )}
                </div>
              ) : (
                getOptionLabel(selectedOptions[0])
              )
            ) : (
              placeholder
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {valueArray.length > 0 && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
                onClick={handleClearAll}
              />
            )}
            {icon || <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
        style={{ maxHeight: "400px" }}
      >
        <Command shouldFilter={!enableApiSearch}>
          <div className="relative">
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={(value) => {
                if (enableApiSearch && service && store) {
                  setSearchQuery(value);
                }
              }}
            />
            {service && store && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  fetchData();
                }}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4 text-muted-foreground",
                    isLoading && "animate-spin",
                  )}
                />
              </button>
            )}
          </div>
          <CommandEmpty>{isLoading ? "Loading..." : emptyText}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {multiple && valueArray.length > 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                {valueArray.length} selected
                {maxSelections && ` (max: ${maxSelections})`}
              </div>
            )}
            {options.map((option, index) => {
              const optionValue = getOptionValue(option);
              const isSelected = valueArray.includes(optionValue);

              return (
                <CommandItem
                  key={`${optionValue}-${index}`}
                  value={getOptionLabel(option)}
                  onSelect={() => handleSelect(option)}
                  className={cn(multiple && "cursor-pointer")}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center border border-primary",
                      multiple ? "rounded" : "rounded-full",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50",
                    )}
                  >
                    <Check
                      className={cn("h-3 w-3", !isSelected && "opacity-0")}
                    />
                  </div>
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
