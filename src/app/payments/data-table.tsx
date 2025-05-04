"use client";

import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/TablePagination";
import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function getPriority(step: number): string[] {
  const baseOrder = ["success", "pending", "failed", "processing"];
  const effectiveStep = step === -1 ? 0 : step % 4;
  return [
    ...baseOrder.slice(effectiveStep),
    ...baseOrder.slice(0, effectiveStep),
  ];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [statusSortStep, setStatusSortStep] = useState(-1);

  const columnsWithSorting = useMemo(() => {
    return columns.map((col) => {
      if (col.accessorKey === "status") {
        return {
          ...col,
          sortingFn: (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => {
            const statusA = rowA.getValue(columnId) as string;
            const statusB = rowB.getValue(columnId) as string;
            const priority = getPriority(statusSortStep);
            return priority.indexOf(statusA) - priority.indexOf(statusB);
          },
          header: () => {
            return (
              <Button
                variant="ghost"
                onClick={() => {
                  setStatusSortStep((prev) => (prev + 1) % 4);
                  setSorting([{ id: "status", desc: false }]);
                }}
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
        };
      }
      return col;
    });
  }, [columns, statusSortStep]);

  const table = useReactTable({
    data,
    columns: columnsWithSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
