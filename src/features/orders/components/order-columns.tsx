import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/core/table/data-table-column-header";
import LongText from "@/components/long-text";
import { Order } from "@/services/type/order-type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "./order-status-badge";
import { PaymentMethodBadge } from "./payment-method-badge";
import { OrderTableRowActions } from "./order-table-row-actions";

export const columns: ColumnDef<Order>[] = [
  {
    id: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const fullName = `${row.original.customer.firstName == null ? "" : " "}${row.original.customer.lastName}`;

      return (
        <div className="flex items-center gap-x-2">
          <Avatar className="size-8">
            <AvatarImage
              alt={row.original.customer.lastName ?? ""}
              src={row.original.customer.avatar ?? ""}
            />
            <AvatarFallback>{row.original.customer.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <LongText className="max-w-36">{fullName}</LongText>
        </div>
      );
    },
    meta: { className: "w-36" },
  },
  {
    id: "orderDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => {
      return (
        <div>{formatDate(row.original.createdAt)}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <OrderStatusBadge status={row.original.orderStatus} />
      );
    },
  },
  {
    id: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => {
      return (
        <div>{row.original.totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</div>
      );
    },
  },
  {
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => {
      return (
        <PaymentMethodBadge method={row.original.paymentMethod} />
      );
    },
  },
  {
    id: "Total Items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Items" />
    ),
    cell: ({ row }) => {
      return (
        <div>{row.original.totalItems}</div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <OrderTableRowActions row={row} />,
  },
];
