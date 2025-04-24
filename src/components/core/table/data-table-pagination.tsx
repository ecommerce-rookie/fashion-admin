import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import {
  IconArrowsLeft,
  IconArrowsRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

import { Pagination } from "@/hooks/use-pagination";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination: Pagination;
}

export function DataTablePagination<TData>({
  table,
  pagination,
}: DataTablePaginationProps<TData>) {
  return (
    <div
      className="float-end flex items-center justify-between text-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => {
              pagination.setPageSize(Number(value));
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pagination.page} of {pagination.pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="hidden size-8 p-0 lg:flex"
            disabled={pagination.page === 0}
            variant="outline"
            onClick={() => pagination.setPage(1)}
          >
            <span className="sr-only">Go to first page</span>
            <IconArrowsLeft className="size-4" />
          </Button>
          <Button
            className="size-8 p-0"
            disabled={pagination.page === 1}
            variant="outline"
            onClick={() => pagination.setPage(pagination.page - 1)}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            className="size-8 p-0"
            disabled={pagination.page >= pagination.pageCount}
            variant="outline"
            onClick={() => pagination.setPage(pagination.page + 1)}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            className="hidden size-8 p-0 lg:flex"
            disabled={pagination.page >= pagination.pageCount}
            variant="outline"
            onClick={() => pagination.setPage(pagination.pageCount)}
          >
            <span className="sr-only">Go to last page</span>
            <IconArrowsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
