import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateProductMutation, useUpdateProductMutation } from "@/services/query/product-query";
import { ProductDetail } from "@/services/type/product-type";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductActionDialogProps {
    open: boolean;
    onOpenChange: () => void;
    currentRow?: ProductDetail;
}

const formSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    unitPrice: z
        .string()
        .transform((val) => (val === "" ? undefined : parseFloat(val)))
        .optional(),
    purchasePrice: z
        .string()
        .transform((val) => (val === "" ? undefined : parseFloat(val)))
        .optional(),
    description: z.string().optional(),
    status: z.string().min(1, "Status is required"),
    categoryId: z
        .string()
        .transform((val) => (val === "" ? undefined : parseInt(val, 10)))
        .optional(),
    quantity: z
        .string()
        .transform((val) => (val === "" ? undefined : parseInt(val, 10)))
        .optional(),
    gender: z.string().optional(),
    slug: z.string().optional(),
    isDeleted: z.boolean().optional(),
    sizes: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductActionDialog({
    open,
    onOpenChange,
    currentRow,
}: ProductActionDialogProps) {
    const { mutateAsync: createProduct, isPending: isCreating } =
        useCreateProductMutation();
    const { mutateAsync: updateProduct, isPending: isUpdating } =
        useUpdateProductMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: currentRow?.Name || "",
            unitPrice: currentRow?.unitPrice?.toString() || "",
            purchasePrice: currentRow?.purchasePrice?.toString() || "",
            description: currentRow?.description || "",
            status: currentRow?.status || "ACTIVE",
            categoryId: currentRow?.categoryId?.toString() || "",
            quantity: currentRow?.quantity?.toString() || "0",
            gender: currentRow?.gender || "",
            slug: currentRow?.slug || "",
            isDeleted: currentRow?.isDeleted || false,
            sizes: currentRow?.sizes || [],
        },
    });

    async function onSubmit(values: FormValues) {
        try {
            if (currentRow) {
                await updateProduct({
                    id: currentRow.id,
                    ...values,
                });
            } else {
                await createProduct(values);
            }

            onOpenChange();
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    const statusOptions = ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"];
    const genderOptions = ["MALE", "FEMALE", "UNISEX"];
    const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {currentRow ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="unitPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="purchasePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Category ID"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {statusOptions.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {genderOptions.map((gender) => (
                                                    <SelectItem key={gender} value={gender}>
                                                        {gender}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="product-slug" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Product description"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isDeleted"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Deleted</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isCreating || isUpdating}
                            >
                                {isCreating || isUpdating
                                    ? "Saving..."
                                    : currentRow
                                        ? "Update Product"
                                        : "Create Product"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}