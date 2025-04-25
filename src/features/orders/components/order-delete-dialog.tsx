"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Order, OrderStatus } from "@/services/type/order-type";
import { SelectDropdown } from "@/components/select-dropdown";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Order;
}

export function OrderUpdateDialog({ open, onOpenChange, currentRow }: Props) {
  // const { mutateAsync: deleteCategory } = useDeleteCategoryMutation();

  const handleUpdate = async () => {

    // await deleteCategory({
    //   id: currentRow.id,
    // });

    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      destructive={false}
      confirmText="Update"
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to update order{" "}
            <span className="font-bold">{currentRow.id}</span>?
          </p>

          <div>
            <SelectDropdown
              items={Object.values(OrderStatus).map((status) => {
                return {
                  label: status,
                  value: status
                }
              })}
              defaultValue={currentRow.orderStatus}
            />
          </div>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can be affected directly to
              user.
            </AlertDescription>
          </Alert>
        </div>
      }
      handleConfirm={handleUpdate}
      open={open}
      title={
        <span>
          <IconAlertTriangle
            className="stroke-yellow-600 mr-1 inline-block"
            size={18}
          />{" "}
          Update Status
        </span>
      }
      onOpenChange={onOpenChange}
    />
  );
}
