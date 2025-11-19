import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
  key: string;
  label: string;
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
}

export function BaseTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data available",
  getRowKey,
  rowClassName,
}: BaseTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-4 my-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
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
                  colSpan={columns.length}
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={getRowKey(item)}
                className={rowClassName ? rowClassName(item) : ""}
              >
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
