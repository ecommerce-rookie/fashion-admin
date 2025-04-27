import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProductDetail } from "@/services/type/product-type";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductDetailDialogProps {
    open: boolean;
    onOpenChange: () => void;
    currentRow: ProductDetail;
}

export function ProductDetailDialog({
    open,
    onOpenChange,
    currentRow,
}: ProductDetailDialogProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{currentRow.name}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[70vh] pr-4">
                    <div className="space-y-6">
                        {/* Product Basic Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                            <Separator className="mb-4" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">ID</p>
                                    <p className="text-sm break-all">{currentRow.id}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                                    <Badge variant={
                                        currentRow.status === "ACTIVE" ? "default" :
                                            currentRow.status === "INACTIVE" ? "secondary" : "destructive"
                                    }>
                                        {currentRow.status}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Unit Price</p>
                                    <p className="text-sm">{currentRow.unitPrice ? `$${currentRow.unitPrice.toFixed(2)}` : "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Purchase Price</p>
                                    <p className="text-sm">{currentRow.purchasePrice ? `$${currentRow.purchasePrice.toFixed(2)}` : "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Quantity</p>
                                    <p className="text-sm">{currentRow.quantity ?? 0}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Gender</p>
                                    <p className="text-sm capitalize">{currentRow.gender ?? "Unisex"}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Category ID</p>
                                    <p className="text-sm">{currentRow.categoryId ?? "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <Separator className="mb-4" />
                            <p className="text-sm whitespace-pre-wrap">{currentRow.description || "No description available"}</p>
                        </div>

                        {/* Available Sizes */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Available Sizes</h3>
                            <Separator className="mb-4" />

                            {currentRow.sizes && currentRow.sizes.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {currentRow.sizes.map((size) => (
                                        <Badge key={size} variant="outline">{size}</Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No sizes specified</p>
                            )}
                        </div>

                        {/* Metadata */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Metadata</h3>
                            <Separator className="mb-4" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Created At</p>
                                    <p className="text-sm">{formatDate(currentRow.createdAt)}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Updated At</p>
                                    <p className="text-sm">{formatDate(currentRow.updatedAt)}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Created By</p>
                                    <p className="text-sm">{currentRow.author.lastName ?? "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Deleted</p>
                                    <p className="text-sm">{currentRow.isDeleted ? "Yes" : "No"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}