import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TableSkeleton } from "./TableSkeleton";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface BaseTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (item: T) => string | number;
  rowClassName?: (item: T) => string;
  // Checkbox props
  enableCheckbox?: boolean;
  checkboxCondition?: (item: T) => boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
}

export function BaseTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data available",
  getRowKey,
  rowClassName,
  enableCheckbox = false,
  checkboxCondition,
  selectedRows = [],
  onSelectionChange,
}: BaseTableProps<T>) {
  const [internalSelected, setInternalSelected] =
    useState<(string | number)[]>(selectedRows);

  // Sync with parent's selectedRows prop
  useEffect(() => {
    setInternalSelected(selectedRows);
  }, [selectedRows]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableRows = data
        .filter((item) => !checkboxCondition || checkboxCondition(item))
        .map((item) => getRowKey(item));
      setInternalSelected(selectableRows);
      onSelectionChange?.(selectableRows);
    } else {
      setInternalSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (key: string | number, checked: boolean) => {
    const newSelected = checked
      ? [...internalSelected, key]
      : internalSelected.filter((k) => k !== key);
    setInternalSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const selectableItems = data?.filter(
    (item) => !checkboxCondition || checkboxCondition(item)
  );
  const isAllSelected =
    selectableItems.length > 0 &&
    selectableItems.every((item) => internalSelected.includes(getRowKey(item)));
  const isSomeSelected = internalSelected.length > 0 && !isAllSelected;

  if (isLoading) {
    return (
      <TableSkeleton
        columns={columns}
        enableCheckbox={enableCheckbox}
        rows={5}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {enableCheckbox && (
                  <TableHead className="w-[50px]">
                    <Checkbox disabled />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableCheckbox ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-md border min-w-max">
        <Table>
          <TableHeader>
            <TableRow>
              {enableCheckbox && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={
                      isSomeSelected ? "data-[state=checked]:bg-primary" : ""
                    }
                    disabled={selectableItems.length === 0}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const rowKey = getRowKey(item);
              const isSelectable =
                !checkboxCondition || checkboxCondition(item);
              const isSelected = internalSelected.includes(rowKey);

              return (
                <TableRow
                  key={rowKey}
                  className={rowClassName ? rowClassName(item) : ""}
                >
                  {enableCheckbox && (
                    <TableCell>
                      {isSelectable ? (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectRow(rowKey, checked as boolean)
                          }
                          aria-label={`Select row ${rowKey}`}
                        />
                      ) : (
                        <Checkbox disabled aria-label="Not selectable" />
                      )}
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render
                        ? column.render(item, index)
                        : String(
                            (item as Record<string, unknown>)[column.key] ?? ""
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
