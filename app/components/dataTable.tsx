import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ArrowUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { FastighetsInfo } from "./fastighetsInfo";

interface DataItem {
  id: number;
  fastighetsagare: string;
  beteckning: string;
  area: number;
  byggar: number;
  mapObject: any;
}

export function DataTable() {
  const columns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          className="mr-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "beteckning",
      header: "Beteckning",
      cell: ({ row }: any) => (
        <FastighetsInfo fastighet={row.original} onRefresh={refreshData} />
      ),
    },
    {
      accessorKey: "fastighetsagare",
      header: ({ column }: any) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Fastighetsägare
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (props: any) => <>{props.getValue()}</>,
    },
    {
      accessorKey: "area",
      header: ({ column }: any) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Area (m²)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (props: any) => <>{props.getValue()}</>,
    },
    {
      accessorKey: "byggar",
      header: ({ column }: any) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Byggår
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (props: any) => <>{props.getValue()}</>,
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = useState<DataItem[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    const stored = localStorage.getItem("properties");
    setData(
      JSON.parse(stored ? stored : "[]")
        .slice()
        .reverse()
    );
  }, []);

  function refreshData() {
    const stored = localStorage.getItem("properties");
    setData(
      JSON.parse(stored ? stored : "[]")
        .slice()
        .reverse()
    );
  }

  const table = useReactTable<DataItem>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="rounded-md border px-5">
      <div className="flex items-center py-4 pl-10">
        <Input
          placeholder="Filtrera fastighetsägare..."
          value={
            (table.getColumn("fastighetsagare")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("fastighetsagare")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="min-h-[52vh] mx-10 mb-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="pr-50">
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
                    <TableCell key={cell.id} className="pr-50">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Inga fastigheter sparade.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-3 py-4 pr-10">
        <div className="flex-1 text-sm text-muted-foreground pl-10">
          {table.getFilteredSelectedRowModel().rows.length} av{" "}
          {table.getFilteredRowModel().rows.length} rader valda.
        </div>
        <Label>
          Sida {table.getState().pagination.pageIndex + 1} av{" "}
          {table.getPageCount()}
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Föregående
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Nästa
        </Button>
      </div>
    </div>
  );
}
