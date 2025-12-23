import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, RefreshCw } from "lucide-react";
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

interface ComboboxSelectProps<T> {
  // Static options (use this OR service/store)
  options?: T[];
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
        "ComboboxSelect: service and store required for API fetching"
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
  }, [service, store, staticOptions]);

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

  const selectedOption = options.find((option) => {
    return getOptionValue(option) === value;
  });

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
                    isLoading && "animate-spin"
                  )}
                />
              </button>
            )}
          </div>
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
