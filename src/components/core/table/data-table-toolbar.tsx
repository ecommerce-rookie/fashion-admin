import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconCross } from "@tabler/icons-react";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

import { useTable } from "@/stores/table-context";
import { FilterTable } from "./filter-table";

interface DataTableToolbarProps<T> {
  readonly filter: FilterTable<T>;
}

export function DataTableToolbar<T>({ filter }: DataTableToolbarProps<T>) {
  const { table } = useTable();
  const isFiltered = table ? table.getState().columnFilters.length > 0 : false;

  const resetFilter = () => {
    table?.resetColumnFilters();
    filter.facedFilter?.forEach((data) => {
      data.setSelect?.([]);
      data.setSingleSelect?.("");
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          placeholder={filter.placeholder}
          value={filter.search ?? ""}
          onChange={(event) => filter.setSearch?.(event?.target?.value ?? "")}
        />
        <div className="flex gap-x-2">
          {filter.facedFilter?.map((data) => (
            <DataTableFacetedFilter
              key={data.name}
              column={table?.getColumn(data.name)}
              options={data.list}
              setSelect={data.setSelect}
              setSingleSelect={data.setSingleSelect}
              title={data.name}
            />
          ))}
        </div>
        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            variant="ghost"
            onClick={resetFilter}
          >
            Reset
            <IconCross className="ml-2 size-4" />
          </Button>
        )}
      </div>
      {table && <DataTableViewOptions table={table} />}
    </div>
  );
}
