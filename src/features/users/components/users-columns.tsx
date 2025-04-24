import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";


import { UserTableRowActions } from "./user-table-row-actions";

import { User } from "@/services/type/user-type";
import { DataTableColumnHeader } from "@/components/core/table/data-table-column-header";
import LongText from "@/components/long-text";
import { cn } from "@/lib/utils";
import { callTypes, userTypes } from "@/constants/user-constant";

export const columns: ColumnDef<User>[] = [
  {
    id: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const fullName = `${row.original.firstName == null ? "" : " "}${row.original.lastName}`;

      return (
        <div className="flex items-center gap-x-2">
          <Avatar className="size-8">
            <AvatarImage
              alt={row.original.lastName}
              src={row.original.avatar ?? ""}
            />
            <AvatarFallback>{row.original.lastName[0]}</AvatarFallback>
          </Avatar>
          <LongText className="max-w-36">{fullName}</LongText>
        </div>
      );
    },
    meta: { className: "w-36" },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div>{row.original.phone}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      const badgeColor = callTypes.get(status);

      return (
        <div className="flex space-x-2">
          <Badge className={cn("capitalize", badgeColor)} variant="outline">
            {row.original.status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, _, value) => {
      return value.includes(row.original.status);
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const { role } = row.original;

      const userType = userTypes.find(
        ({ value }: { value: string }) => value === role,
      );

      if (!userType) {
        return null;
      }

      return (
        <div className="flex items-center gap-x-2">
          {userType.icon && (
            <userType.icon className="text-muted-foreground" size={16} />
          )}
          <span className="text-sm capitalize">{row.original.role}</span>
        </div>
      );
    },
    filterFn: (row, _, value) => {
      return value.includes(row.original.role);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: UserTableRowActions,
  },
];
