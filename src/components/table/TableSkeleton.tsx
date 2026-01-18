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
import { Column } from "./BaseTable";

interface TableSkeletonProps<T> {
  columns: Column<T>[];
  enableCheckbox?: boolean;
  rows?: number;
}

export function TableSkeleton<T>({
  columns,
  enableCheckbox = false,
  rows = 5,
}: TableSkeletonProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableCheckbox && (
                <TableHead className="w-[50px]">
                  <Skeleton className="h-4 w-4" />
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
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                {enableCheckbox && (
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
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
