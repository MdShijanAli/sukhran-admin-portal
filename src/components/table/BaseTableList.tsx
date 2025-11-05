import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseTable, Column } from "./BaseTable";

export interface FilterOption {
  label: string;
  value: string;
}

export interface ActionButton {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export interface BaseTableListProps<T> {
  // Card Header
  title: string;
  description?: string;
  headerActions?: ActionButton[];

  // Search
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Filters
  filters?: {
    label?: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }[];

  // Additional toolbar elements
  toolbarActions?: ReactNode;

  // Table props
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (item: T) => string | number;
  rowClassName?: (item: T) => string;

  // Pagination (optional for future)
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  summaryLists?: Array<{
    title: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    value: string | number;
  }>;
}

export function BaseTableList<T>({
  title,
  description,
  headerActions,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
  toolbarActions,
  columns,
  data,
  isLoading,
  emptyMessage,
  getRowKey,
  rowClassName,
  showPagination = false,
  currentPage,
  totalPages,
  onPageChange,
  summaryLists = [],
}: BaseTableListProps<T>) {
  return (
    <div className="space-y-3">
      {summaryLists.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryLists.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {headerActions && headerActions.length > 0 && (
              <div className="flex items-center gap-2">
                {headerActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      onClick={action.onClick}
                      variant={action.variant || "default"}
                    >
                      {Icon && <Icon className="h-4 w-4 mr-2" />}
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Toolbar: Search, Filters, and Actions */}
          {(onSearchChange || filters || toolbarActions) && (
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {/* Search Input */}
              {onSearchChange && (
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="max-w-sm"
                />
              )}

              {/* Filters */}
              {filters &&
                filters.map((filter, index) => (
                  <Select
                    key={index}
                    value={filter.value}
                    onValueChange={filter.onChange}
                  >
                    <SelectTrigger className={filter.className || "w-[180px]"}>
                      <SelectValue
                        placeholder={filter.placeholder || "Select..."}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}

              {/* Additional Toolbar Actions */}
              {toolbarActions}
            </div>
          )}

          {/* Table */}
          <BaseTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            getRowKey={getRowKey}
            rowClassName={rowClassName}
          />

          {/* Pagination (placeholder for future implementation) */}
          {showPagination &&
            currentPage !== undefined &&
            totalPages !== undefined &&
            onPageChange && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
