"use client";

import {
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { decryptKey } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
      redirect("/");
    }
  }, [encryptedKey]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-800 bg-gray-950 shadow-xl">
      <Table className="w-full">
        <TableHeader className="bg-gray-900 hover:bg-gray-950">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-800">
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="divide-y divide-gray-800">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="transition-colors hover:bg-gray-900/70"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-24 text-center text-gray-500"
              >
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t border-gray-800 bg-gray-900 px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
        >
          <Image
            src="/arrow.svg"
            width={16}
            height={16}
            alt="Previous"
            className="h-4 w-4"
          />
          Previous
        </Button>
        <div className="text-sm text-gray-400">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
        >
          Next
          <Image
            src="/arrow.svg"
            width={16}
            height={16}
            alt="Next"
            className="h-4 w-4 rotate-180"
          />
        </Button>
      </div>
    </div>
  );
}