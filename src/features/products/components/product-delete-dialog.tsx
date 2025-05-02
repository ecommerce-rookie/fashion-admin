import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductPreview } from "@/services/type/product-type";
import { useDeleteProductMutation } from "@/services/query/product-query";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

interface ProductDeleteDialogProps {
    open: boolean;
    onOpenChange: () => void;
    currentRow: ProductPreview;
}

export function ProductDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: ProductDeleteDialogProps) {
    const [isPermanently, setIsPermanently] = useState(false);
    const { mutateAsync: deleteProduct, isPending } = useDeleteProductMutation();

    const handleDelete = async () => {
        try {
            await deleteProduct({ id: currentRow.id, isHard: isPermanently });
            onOpenChange();
        } catch {
            toast.error(
                "Failed to delete product. Please try again later.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        product <span className="font-bold">{currentRow.name}</span> from your
                        database.
                    </AlertDialogDescription>
                    <div className="flex items-center space-x-2 mt-4">
                        <Checkbox onCheckedChange={(checked) => setIsPermanently(!!checked)} />
                        <Label>Delete Permentmantly</Label>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}