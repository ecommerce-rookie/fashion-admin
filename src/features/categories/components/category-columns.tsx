import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/core/table/data-table-column-header";
import LongText from "@/components/long-text";
import { Category } from "@/services/type/category-type";
import { DataTableRowActions } from "@/components/core/table/data-table-row-actions";

export const columns: ColumnDef<Category>[] = [
  {
    id: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <LongText className="max-w-36">{row.original.name}</LongText>
      );
    },
    meta: { className: "w-36" },
  },
  {
    id: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <LongText className="max-w-36">{row.original.description}</LongText>
      );
    },
    meta: { className: "w-36" },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: DataTableRowActions,
  },
];
