/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from "@tanstack/react-table";
import {
  IconDotsCircleHorizontal,
  IconEdit,
  IconInfoCircle,
  IconStatusChange,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTable } from "@/stores/table-context";
import { useNavigate } from "@tanstack/react-router";

interface OrderTableRowActionsProps<T> {
  row: Row<T>;
}

export function OrderTableRowActions<T>({
  row,
}: Readonly<OrderTableRowActionsProps<T>>) {
  const { setOpen, setCurrentRow } = useTable();
  const navigate = useNavigate();

  const goToOrderDetail = (orderId: string) => {
    navigate({ to: "/orders/$id", params: { id: orderId } });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="data-[state=open]:bg-muted flex size-8 p-0"
          variant="ghost"
        >
          <IconDotsCircleHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            goToOrderDetail((row.original as any).id);
          }}
        >
          View Details
          <DropdownMenuShortcut>
            <IconInfoCircle size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("edit");
          }}
        >
          Next Status
          <DropdownMenuShortcut>
            <IconStatusChange size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("delete");
          }}
        >
          Update Status
          <DropdownMenuShortcut>
            <IconEdit size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
