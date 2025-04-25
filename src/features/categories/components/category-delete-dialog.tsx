"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Category } from "@/services/type/category-type";
import { useDeleteCategoryMutation } from "@/services/query/category-query";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Category;
}

export function CategoryDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { mutateAsync: deleteCategory } = useDeleteCategoryMutation();

  const handleDelete = async () => {

    await deleteCategory({
      id: currentRow.id,
    });

    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      destructive
      confirmText="Delete"
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the category
            from the system. This cannot be undone.
          </p>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can be affected directly to
              user.
            </AlertDescription>
          </Alert>
        </div>
      }
      handleConfirm={handleDelete}
      open={open}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Category
        </span>
      }
      onOpenChange={onOpenChange}
    />
  );
}
