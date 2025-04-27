import { useTable } from "@/stores/table-context";
import { ProductDeleteDialog } from "./product-delete-dialog";
import { ProductDetailDialog } from "./product-detail-dialog"; // We'll create this next
import { ProductsActionDialog } from "./product-action-dialog";

export function ProductDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useTable();

    return (
        <>
            <ProductsActionDialog
                key={`product-add`}
                currentRow={currentRow}
                open={open === "add"}
                mode="add"
                onOpenChange={() => {
                    setOpen("add");
                    setTimeout(() => {
                        setCurrentRow(null);
                    }, 500);
                }}
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