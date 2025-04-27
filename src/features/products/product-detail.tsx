import { Main } from "@/components/core/layout/main";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useProductBySlugQuery } from "@/services/query/product-query";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit2, Save, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useCategoriesQuery } from "@/services/query/category-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ProductStatus } from "@/services/type/product-type";
import { IconStarFilled, IconUser } from "@tabler/icons-react";
import ImageUploader from "@/components/ui/image-upload";

export default function ProductDetail() {
    const { id } = useParams({ from: "/_authenticated/products/$id" });
    const [isEditing, setIsEditing] = useState(false)

    const { data, isLoading: isProductLoading } = useProductBySlugQuery(id || "");
    const { data: categories, isLoading: isCategoryLoading } = useCategoriesQuery({
        page: -1,
        eachPage: 10
    });

    const product = data?.data;

    const [status, setStatus] = useState<ProductStatus>(product?.status ?? ProductStatus.Available)
    const [selectedSizes, setSelectedSizes] = useState(product?.sizes ?? [])
    const navigate = useNavigate();

    const isLoading = isProductLoading || isCategoryLoading;

    useEffect(() => {
        if (!isLoading && !product) {
            navigate({ to: "/products" });
        }
    }, [isLoading, product, navigate]);

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

    const toggleEditing = () => {
        setIsEditing(!isEditing)
    }

    const handleSizeToggle = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter((s) => s !== size))
        } else {
            setSelectedSizes([...selectedSizes, size])
        }
    }

    return (
        <Main>
            {/* Product Header */}
            <div className="border-b bg-background">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a
                            href="/products"
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" className="h-9" onClick={toggleEditing}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button className="h-9">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" className="h-9" onClick={toggleEditing}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button variant="destructive" className="h-9">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <div className="w-full max-w-xl">
                        {isEditing ? (
                            <Input defaultValue="Urban Striped Men's Shirt" className="text-xl font-bold h-10" />
                        ) : (
                            <h1 className="text-2xl font-bold tracking-tight">{product?.name}</h1>
                        )}
                        <div className="mt-1 flex items-center gap-3">
                            <Badge
                                variant={status === "Available" ? "outline" : "default"}
                                className="rounded-md px-2 py-1 text-xs font-medium"
                            >
                                {status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">ID: {product?.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 py-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="description" className="text-sm font-medium text-muted-foreground mb-1.5 block">
                                            Description
                                        </Label>
                                        {isEditing ? (
                                            <Textarea
                                                id="description"
                                                defaultValue={product?.description ?? ""}
                                                rows={4}
                                            />
                                        ) : (
                                            <p className="text-sm">
                                                {product?.description ?? "No description available."}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category" className="text-sm font-medium text-muted-foreground mb-1.5 block">
                                                Category
                                            </Label>
                                            {isEditing ? (
                                                <Select defaultValue={product?.categoryId.toString()}>
                                                    <SelectTrigger id="category">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories?.data.map((category) => (
                                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                                {category.name} (ID: {category.id})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p className="text-sm">Men&apos;s Clothing (ID: 3)</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="gender" className="text-sm font-medium text-muted-foreground mb-1.5 block">
                                                Gender
                                            </Label>
                                            {isEditing ? (
                                                <Select defaultValue={product?.gender}>
                                                    <SelectTrigger id="gender">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                        <SelectItem value="Unisex">Unisex</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p className="text-sm">{product?.gender}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing & Inventory */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="unitPrice" className="text-sm font-medium text-muted-foreground mb-1.5 block">
                                                Unit Price
                                            </Label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                    <Input id="unitPrice" value={product?.unitPrice} className="pl-7" />
                                                </div>
                                            ) : (
                                                <p className="text-lg font-semibold">
                                                    {formatCurrency(product?.unitPrice ?? 0)}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="purchasePrice"
                                                className="text-sm font-medium text-muted-foreground mb-1.5 block"
                                            >
                                                Purchase Price
                                            </Label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                    <Input id="purchasePrice" value={product?.purchasePrice} className="pl-7" />
                                                </div>
                                            ) : (
                                                <p className="text-lg font-semibold">{formatCurrency(product?.purchasePrice ?? 0)}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="quantity" className="text-sm font-medium text-muted-foreground mb-1.5 block">
                                                Quantity
                                            </Label>
                                            {isEditing ? (
                                                <Input id="quantity" type="number" value={product?.quantity ?? 0} min="0" />
                                            ) : (
                                                <p className="text-lg font-semibold">{product?.quantity} units</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="status" className="text-sm font-medium text-muted-foreground mb-1.5 block">
                                                Status
                                            </Label>
                                            {isEditing ? (
                                                <Select defaultValue={status} onValueChange={(value) => setStatus(value as ProductStatus)}>
                                                    <SelectTrigger id="status">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            Object.values(ProductStatus).map((status) => (
                                                                <SelectItem key={status} value={status}>
                                                                    {status}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p className="text-sm font-medium">
                                                    <Badge
                                                        variant={status === "Available" ? "outline" : "default"}
                                                        className="rounded-md px-2 py-1 text-xs font-medium"
                                                    >
                                                        {status}
                                                    </Badge>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4">Metadata</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                                            <p className="mt-1 text-sm">{formatDate(product?.createdAt)}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Updated At</h3>
                                            <p className="mt-1 text-sm">{formatDate(product?.updatedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-1">
                                            <h3 className="text-sm font-medium text-muted-foreground">Star: </h3>
                                            <p className="text-sm">{product?.star}</p>
                                            <IconStarFilled size={16} />
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <h3 className="text-sm font-medium text-muted-foreground">Reviews: </h3>
                                            <p className="text-sm">{product?.reviewCount}</p>
                                            <IconUser size={16} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={product?.author?.avatar ?? ""} alt="Author Avatar" />
                                                <AvatarFallback className="text-xs">CC</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{product?.author?.firstName == null ? "" : " " + product?.author.lastName}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Product Images */}
                        <Card>
                            <CardContent className="pt-6">
                                {isEditing ? (
                                    <ImageUploader
                                        defaultMode="multiple"
                                        showModeToggle={false}
                                        value={product?.images ?? []}
                                        label="Upload Product Images"
                                    />
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-semibold">Product Images</h2>
                                        </div>
                                        <div className="space-y-3">
                                            {product?.images.map((image, index) => (
                                                <div key={index} className="flex items-center gap-3 border rounded-md p-2">
                                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                        <img
                                                            src={image}
                                                            alt={`Product ${index}`}
                                                            width={64}
                                                            height={64}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">product-image-{index}.jpg</p>
                                                        <p className="text-xs text-muted-foreground">800 × 600 • 245 KB</p>
                                                    </div>
                                                    {isEditing && (
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                            </CardContent>
                        </Card>

                        {/* Variants */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-4">Variants</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Sizes</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) =>
                                                isEditing ? (
                                                    <Button
                                                        key={size}
                                                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handleSizeToggle(size)}
                                                        className="h-9 w-12"
                                                    >
                                                        {size}
                                                    </Button>
                                                ) : (
                                                    <Badge
                                                        key={size}
                                                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                                                        className={`h-9 w-12 flex items-center justify-center ${!selectedSizes.includes(size) && "opacity-50"}`}
                                                    >
                                                        {size}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </Main>
    );
}
