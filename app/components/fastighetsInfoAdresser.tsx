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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import type { SortingState } from "@tanstack/react-table";
import type { ColumnFiltersState } from "@tanstack/react-table";

import { flexRender } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

interface DataItem {
  id: number;
  adress: string;
  verksamhet: string;
}

const columns = [
  {
    accessorKey: "adress",
    header: "Adress",
  },
  {
    accessorKey: "verksamhet",
    header: "Verksamhet",
  },
];

export function FastighetsInfoAdresser(props: any) {
  const [data, setData] = useState<DataItem[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    const stored = localStorage.getItem("adresser");
    const allAdresser: DataItem[] = stored ? JSON.parse(stored) : [];

    const filteredAdresser = allAdresser
      .filter((item) => item.id === props.fastighet.id)
      .reverse();

    setData(filteredAdresser);
  }, [props.fastighet.id]);

  function handleSave() {
    const adress = document.getElementById("adress") as HTMLInputElement;
    const verksamhet = document.getElementById(
      "verksamhet"
    ) as HTMLInputElement;

    if (!adress.value) {
      toast("Fyll i adress");
      return;
    }

    const id = props.fastighet.id;

    const newEntry: DataItem = {
      id,
      adress: adress.value,
      verksamhet: verksamhet.value,
    };

    const existingAdresser = localStorage.getItem("adresser");
    const adresser = existingAdresser ? JSON.parse(existingAdresser) : [];

    adresser.push(newEntry);
    localStorage.setItem("adresser", JSON.stringify(adresser));

    const filteredAdresser = adresser
      .filter((item: DataItem) => item.id === props.fastighet.id)
      .reverse();
    setData(filteredAdresser);

    toast("Adress sparad");

    adress.value = "";
    verksamhet.value = "";
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

  useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  return (
    <div className="grid gap-4 py-4 ml-5 mr-5 ">
      <div className=" min-h-65 w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="">
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
                    <TableCell key={cell.id} className="">
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
      <div className="flex space-x-4 py-1  ">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Lägg till</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lägg till adress</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className=" flex gap-2 ">
              <Input id="adress" placeholder="Grafikergatan 2a" />
              <Input id="verksamhet" placeholder="Kontor" />
              <Button onClick={handleSave}>Lägg till</Button>
            </div>
          </DialogContent>
        </Dialog>
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
