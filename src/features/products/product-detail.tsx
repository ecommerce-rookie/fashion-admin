import { Main } from "@/components/core/layout/main";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useProductBySlugQuery, useUpdateProductMutation } from "@/services/query/product-query";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit2, Save, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategoriesQuery } from "@/services/query/category-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ProductSize, ProductStatus, ProductUpdate } from "@/services/type/product-type";
import { IconStarFilled, IconUser } from "@tabler/icons-react";
import ImageUploader from "@/components/ui/image-upload";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productUpdateSchema, ProductUpdateFormValues } from "./product-update-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

export default function ProductDetail() {
    const { id } = useParams({ from: "/_authenticated/products/$id" });
    const [isEditing, setIsEditing] = useState(false);

    const { data, isLoading: isProductLoading } = useProductBySlugQuery(id || "");
    const { data: categories, isLoading: isCategoryLoading } = useCategoriesQuery({
        page: -1,
        eachPage: 10
    });
    const { mutateAsync: updateProduct } = useUpdateProductMutation();

    const product = data?.data;
    const navigate = useNavigate();
    const isLoading = isProductLoading || isCategoryLoading;

    // Create form with Zod validation
    const form = useForm<ProductUpdateFormValues>({
        resolver: zodResolver(productUpdateSchema),
        defaultValues: {
            Name: "",
            Description: "",
            CategoryId: 0,
            Gender: "",
            UnitPrice: 0,
            PurchasePrice: 0,
            Quantity: 0,
            Status: ProductStatus.Available,
            Sizes: [],
            slug: "",
            images: [],
            Files: []
        },
        mode: "onChange"
    });

    // Update form values when product data is loaded
    useEffect(() => {
        if (!isLoading && !product) {
            navigate({ to: "/products" });
        } else if (!isLoading && product) {
            form.reset({
                Name: product.name || "",
                Description: product.description || "",
                CategoryId: product.categoryId,
                Gender: product.gender,
                UnitPrice: product.unitPrice,
                PurchasePrice: product.purchasePrice,
                Quantity: product.quantity || 0,
                Status: product.status,
                Sizes: product.sizes,
                slug: id || "",
                images: product.images || [],
                Files: []
            });
        }
    }, [isLoading, product, navigate, form, id]);

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
        setIsEditing(!isEditing);
        if (!isEditing) {
            // Reset form when entering edit mode to ensure latest data
            if (product) {
                form.reset({
                    Name: product.name || "",
                    Description: product.description || "",
                    CategoryId: product.categoryId,
                    Gender: product.gender,
                    UnitPrice: product.unitPrice,
                    PurchasePrice: product.purchasePrice,
                    Quantity: product.quantity || 0,
                    Status: product.status,
                    Sizes: product.sizes,
                    slug: id || "",
                    images: product.images || [],
                    Files: []
                });
            }
        }
    };

    // Handle form submission
    const onSubmit = async (values: ProductUpdateFormValues) => {
        if (!product) return;

        try {
            const productUpdateData: ProductUpdate = {
                ...values,
                slug: id || "",
                Files: values.Files?.map((fileObj) => fileObj.file).filter((file): file is File => !!file)
            };

            await updateProduct({ slug: id || "", data: productUpdateData });
            setIsEditing(false);
            // Show success notification or feedback here
        } catch {
            toast.error("Failed to update product. Please try again.");
        }
    };

    const handleSizeToggle = (size: ProductSize) => {
        const currentSizes = form.getValues("Sizes");
        if (currentSizes.includes(size)) {
            form.setValue("Sizes", currentSizes.filter(s => s !== size), { shouldValidate: true });
        } else {
            form.setValue("Sizes", [...currentSizes, size], { shouldValidate: true });
        }
    };

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
                                <Button
                                    className="h-9"
                                    onClick={form.handleSubmit(onSubmit)}
                                    disabled={!form.formState.isValid}
                                >
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
                            <FormProvider {...form}>
                                <FormField
                                    control={form.control}
                                    name="Name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="text-xl font-bold h-10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </FormProvider>
                        ) : (
                            <h1 className="text-2xl font-bold tracking-tight">{product?.name}</h1>
                        )}
                        <div className="mt-1 flex items-center gap-3">
                            <Badge
                                variant={form.getValues("Status") === ProductStatus.Available ? "outline" : "default"}
                                className="rounded-md px-2 py-1 text-xs font-medium"
                            >
                                {form.getValues("Status")}
                            </Badge>
                            <span className="text-sm text-muted-foreground">ID: {product?.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <FormProvider {...form}>
                <Form {...form}>
                    <form className="flex-1 py-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardContent className="pt-6">
                                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="Description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-muted-foreground">Description</FormLabel>
                                                        <FormControl>
                                                            {isEditing ? (
                                                                <Textarea
                                                                    {...field}
                                                                    rows={4}
                                                                />
                                                            ) : (
                                                                <p className="text-sm">
                                                                    {product?.description ?? "No description available."}
                                                                </p>
                                                            )}
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="CategoryId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium text-muted-foreground">Category</FormLabel>
                                                            <FormControl>
                                                                {isEditing ? (
                                                                    <Select
                                                                        value={field.value.toString()}
                                                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                                                    >
                                                                        <SelectTrigger>
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
                                                                    <p className="text-sm">{categories?.data.find(c => c.id === product?.categoryId)?.name || 'Unknown'} (ID: {product?.categoryId})</p>
                                                                )}
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="Gender"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium text-muted-foreground">Gender</FormLabel>
                                                            <FormControl>
                                                                {isEditing ? (
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger>
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
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
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
                                                <FormField
                                                    control={form.control}
                                                    name="UnitPrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium text-muted-foreground">Unit Price</FormLabel>
                                                            <FormControl>
                                                                {isEditing ? (
                                                                    <div className="relative">
                                                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                                        <Input
                                                                            {...field}
                                                                            type="number"
                                                                            className="pl-7"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-lg font-semibold">
                                                                        {formatCurrency(product?.unitPrice ?? 0)}
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="PurchasePrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium text-muted-foreground">Purchase Price</FormLabel>
                                                            <FormControl>
                                                                {isEditing ? (
                                                                    <div className="relative">
                                                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                                        <Input
                                                                            {...field}
                                                                            type="number"
                                                                            className="pl-7"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{formatCurrency(product?.purchasePrice ?? 0)}</p>
                                                                )}
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="Quantity"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium text-muted-foreground">Quantity</FormLabel>
                                                            <FormControl>
                                                                {isEditing ? (
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        min="0"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{product?.quantity} units</p>
                                                                )}
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="Status"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium text-muted-foreground">Status</FormLabel>
                                                            <FormControl>
                                                                {isEditing ? (
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {Object.values(ProductStatus).map((status) => (
                                                                                <SelectItem key={status} value={status}>
                                                                                    {status}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                ) : (
                                                                    <p className="text-sm font-medium">
                                                                        <Badge
                                                                            variant={product?.status === ProductStatus.Available ? "outline" : "default"}
                                                                            className="rounded-md px-2 py-1 text-xs font-medium"
                                                                        >
                                                                            {product?.status}
                                                                        </Badge>
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
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
                                        <FormField
                                            control={form.control}
                                            name="images"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        {isEditing ? (
                                                            <ImageUploader
                                                                defaultMode="multiple"
                                                                showModeToggle={false}
                                                                value={field.value}
                                                                onChange={(newImages) => field.onChange(newImages)}
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
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Variants */}
                                <Card>
                                    <CardContent className="pt-6">
                                        <h2 className="text-lg font-semibold mb-4">Variants</h2>
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="Sizes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-muted-foreground">Sizes</FormLabel>
                                                        <FormControl>
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.values(ProductSize).map((size) =>
                                                                    isEditing ? (
                                                                        <Button
                                                                            key={size}
                                                                            type="button"
                                                                            variant={field.value.includes(size) ? "default" : "outline"}
                                                                            size="sm"
                                                                            onClick={() => handleSizeToggle(size)}
                                                                            className="h-9 w-12"
                                                                        >
                                                                            {size}
                                                                        </Button>
                                                                    ) : (
                                                                        <Badge
                                                                            key={size}
                                                                            variant={field.value.includes(size) ? "default" : "outline"}
                                                                            className={`h-9 w-12 flex items-center justify-center ${!field.value.includes(size) && "opacity-50"}`}
                                                                        >
                                                                            {size}
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </Form>
            </FormProvider>
        </Main>
    );
}
