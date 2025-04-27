import { useTable } from "@/stores/table-context";
import { ProductActionDialog } from "./product-action-dialog";
import { ProductDeleteDialog } from "./product-delete-dialog";
import { ProductDetailDialog } from "./product-detail-dialog"; // We'll create this next

export function ProductDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useTable();

    return (
        <>
            <ProductActionDialog
                key="product-add"
                open={open === "add"}
                onOpenChange={() => setOpen("add")}
            />

            {currentRow && (
                <>
                    <ProductDetailDialog
                        currentRow={currentRow}
                        open={open === "view"}
                        onOpenChange={() => {
                            setOpen("view");
                            setTimeout(() => {
                                setCurrentRow(null);
                            }, 500);
                        }}
                    />

                    <ProductActionDialog
                        key={`product-edit-${currentRow.id}`}
                        currentRow={currentRow}
                        open={open === "edit"}
                        onOpenChange={() => {
                            setOpen("edit");
                            setTimeout(() => {
                                setCurrentRow(null);
                            }, 500);
                        }}
                    />

                    <ProductDeleteDialog
                        key={`product-delete-${currentRow.id}`}
                        currentRow={currentRow}
                        open={open === "delete"}
                        onOpenChange={() => {
                            setOpen("delete");
                            setTimeout(() => {
                                setCurrentRow(null);
                            }, 500);
                        }}
                    />
                </>
            )}
        </>
    );
}