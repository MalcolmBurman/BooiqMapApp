import React, { useEffect, useState, useRef } from "react";
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
import { ArrowUpDown } from "lucide-react";
import { Trash2 } from "lucide-react";

import { flexRender } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Label } from "../components/ui/label";
import { FastighetsInfoAddAdress } from "./fastighetsInfoAddAdress";

interface DataItem {
  id: number;
  adress: string;
}

export function FastighetsInfoAdresser(props: any) {
  const [data, setData] = useState<DataItem[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [listUpdated, setListUpdated] = useState(false);

  const fetchAdresses = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/getAddresses/${props.fastighet.id}`
      );
      if (!res.ok) {
        return;
      }
      const json = await res.json();
      setData(json.address.reverse());
      return;
    } catch (err) {
      return;
    }
  };

  const deleteAddress = async (id: number, pointId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/deleteAddress/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        return;
      }

      setListUpdated(!listUpdated);
      if (props.forceNullDrawControl) {
        props.onMapUpdate(!props.mapState);
      } else {
        props.mapRef.removeLayer(pointId);
        props.mapRef.removeSource(pointId);
        props.fetchAddresses();
      }
      return;
    } catch (err) {
      return;
    }
  };

  const columns = [
    {
      accessorKey: "adress",
      header: ({ column }: any) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }: any) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-destructive hover:text-white"
            size="sm"
            onClick={() => {
              deleteAddress(row.original.id, row.original.mapObject[0].id);
            }}
          >
            <Trash2 className="size-5" />
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    fetchAdresses();
  }, [props.fastighet.id, listUpdated]);

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

  useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  return (
    <div className="grid gap-4 py-4 ml-5 mr-5 ">
      <div className=" min-h-56 border rounded-lg">
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
                  Inga adresser sparade.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full justify-between py-1">
        <div className="flex">
          {props.forceNullDrawControl ||
          props.drawControlRef.current == null ? (
            <FastighetsInfoAddAdress
              fastighet={props.fastighet}
              onSave={() => setListUpdated(!listUpdated)}
              onMapUpdate={props.onMapUpdate}
              mapState={props.mapState}
            />
          ) : (
            <Button
              variant={"outline"}
              onClick={() => {
                const instance =
                  props.drawControlRef.current?.getTerraDrawInstance();
                instance?.setMode("point");
                props.setDrawingAdress(true);
              }}
            >
              Lägg till
            </Button>
          )}
        </div>

        <div className="flex gap-2 items-center">
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
    </div>
  );
}
