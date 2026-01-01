import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BaseSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  [key: string]: unknown; // Allow additional properties
}

interface BaseSelectProps {
  // Basic props
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;

  // Data source - either static list or API method
  options?: BaseSelectOption[];
  apiMethod?: (searchQuery?: string) => Promise<unknown>;

  // Mapping functions for API response
  mapResponse?: (response: unknown) => BaseSelectOption[];

  // Search configuration
  searchable?: boolean;
  searchPlaceholder?: string;
  searchMinLength?: number;
  searchDebounceMs?: number;

  // Display configuration
  emptyMessage?: string;
  loadingMessage?: string;

  // Additional features
  allowClear?: boolean;
  onClear?: () => void;
}

export function BaseSelect({
  value,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
  required = false,
  className,
  id,
  options: staticOptions = [],
  apiMethod,
  mapResponse,
  searchable = false,
  searchPlaceholder = "Search...",
  searchMinLength = 0,
  searchDebounceMs = 300,
  emptyMessage = "No options found",
  loadingMessage = "Loading...",
  allowClear = false,
  onClear,
}: BaseSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiOptions, setApiOptions] = useState<BaseSelectOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isApiMode = !!apiMethod;

  // Fetch API data
  const fetchApiData = useCallback(
    async (search?: string) => {
      if (!apiMethod) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiMethod(search);

        if (mapResponse) {
          const mappedOptions = mapResponse(response);
          setApiOptions(mappedOptions);
        } else {
          // Try to extract data from common response structures
          const data = (response as { data?: unknown })?.data || response;

          if (Array.isArray(data)) {
            // Assume array items have id/name or value/label structure
            const options = data.map((item: unknown) => {
              const obj = item as Record<string, unknown>;
              return {
                value: String(obj.id || obj.value || ""),
                label: String(obj.name || obj.label || obj.title || ""),
                ...obj,
              };
            });
            setApiOptions(options);
          }
        }
      } catch (err) {
        console.error("Error fetching select options:", err);
        setError("Failed to load options");
        setApiOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiMethod, mapResponse]
  );

  // Debounced search for API
  useEffect(() => {
    if (!isApiMode || !searchable || !isOpen) return;

    if (searchQuery.length < searchMinLength) {
      // If search is too short, fetch without filter
      if (searchMinLength === 0) {
        fetchApiData("");
      }
      return;
    }

    const timer = setTimeout(() => {
      fetchApiData(searchQuery);
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    isApiMode,
    searchable,
    isOpen,
    searchMinLength,
    searchDebounceMs,
    fetchApiData,
  ]);

  // Initial fetch for API mode
  useEffect(() => {
    if (isApiMode && isOpen && apiOptions.length === 0 && !isLoading) {
      fetchApiData("");
    }
  }, [isApiMode, isOpen, apiOptions.length, isLoading, fetchApiData]);

  // Filter static options locally
  const filteredStaticOptions = useMemo(() => {
    if (isApiMode) return [];

    if (!searchable || !searchQuery) {
      return staticOptions;
    }

    const query = searchQuery.toLowerCase();
    return staticOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query)
    );
  }, [staticOptions, searchQuery, searchable, isApiMode]);

  // Get current options to display
  const displayOptions = isApiMode ? apiOptions : filteredStaticOptions;

  // Find selected option
  const selectedOption = displayOptions.find((opt) => opt.value === value);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger id={id} className={cn("relative", className)}>
        <SelectValue placeholder={placeholder}>
          {selectedOption?.label || placeholder}
        </SelectValue>
        {allowClear && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 hover:bg-muted rounded p-1"
            tabIndex={-1}
          >
            <span className="text-xs">✕</span>
          </button>
        )}
      </SelectTrigger>
      <SelectContent>
        {searchable && (
          <div className="flex items-center border-b px-3 pb-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-6 text-sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingMessage}
          </div>
        )}

        {!isLoading && error && (
          <div className="py-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!isLoading && !error && displayOptions.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}

        {!isLoading &&
          !error &&
          displayOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

export default BaseSelect;
