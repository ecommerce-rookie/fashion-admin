import { Main } from "@/components/core/layout/main";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTable } from "@/stores/table-context";
import { ProductActionDialog } from "./components/product-action-dialog";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useProductBySlugQuery } from "@/services/query/product-query";

export default function ProductDetail() {
    const { id } = useParams({ from: "/_authenticated/products/$id" })
    const navigate = useNavigate()
    const { data, isLoading } = useProductBySlugQuery(id || "")
    const product = data?.data


    const handleEdit = () => {
        
    };

    const handleDelete = () => {
        
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleString()
    };

    if (isLoading) {
        return (
            <Main>
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-60 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                    <div>
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                </div>
            </Main>
        );
    }

    if (!product) {
        return (
            <Main>
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-muted-foreground mb-6">The product you are looking for does not exist or has been deleted.</p>
                    <Button onClick={() => navigate({ to: "/products" })}>
                        Back to Products
                    </Button>
                </div>
            </Main>
        );
    }

    return (
        <Main>
            <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="icon" onClick={() => navigate({ to: "/products" })}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        <Badge variant={
                            product.status === "ACTIVE" ? "default" :
                                product.status === "INACTIVE" ? "secondary" : "destructive"
                        }>
                            {product.status}
                        </Badge>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Main content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Product details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID</p>
                                        <p className="break-all">{product.id}</p>
                                    </div>
                                    {/* <div>
                                        <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                        <p>{product.slug || "N/A"}</p>
                                    </div> */}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                                    <p className="whitespace-pre-wrap">{product.description || "No description available"}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing & Inventory */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & Inventory</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Unit Price</p>
                                        <p className="text-lg font-medium">{product.unitPrice ? `$${product.unitPrice.toFixed(2)}` : "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Purchase Price</p>
                                        <p>{product.purchasePrice ? `$${product.purchasePrice.toFixed(2)}` : "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                                        <p>{product.quantity ?? 0} units</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <p>{product.status}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Available Sizes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Sizes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {product.sizes && product.sizes.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size: string) => (
                                            <Badge key={size} variant="outline">{size}</Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No sizes specified</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Metadata sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Category ID</p>
                                    <p>{product.categoryId ?? "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                                    <p className="capitalize">{product.gender ?? "Unisex"}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                    <p>{formatDate(product.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                                    <p>{formatDate(product.updatedAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created By</p>
                                    <p>{`${product.author.firstName} + ' ' + ${product.author.lastName}` ?? "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Deleted</p>
                                    <p>{product.isDeleted ? "Yes" : "No"}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            {/* {product && (
                <>
                    <ProductActionDialog
                        key={`product-edit-${product.id}`}
                        currentRow={product}
                        open={open === "edit"}
                        onOpenChange={() => {
                            setOpen("edit");
                            setTimeout(() => {
                                setCurrentRow(null);
                            }, 500);
                        }}
                    />
                </>
            )} */}
        </Main>
    );
}