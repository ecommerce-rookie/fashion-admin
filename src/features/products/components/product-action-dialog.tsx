/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import ImageUploader from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategoriesQuery } from '@/services/query/category-query'
import { useCreateProductMutation } from '@/services/query/product-query'
import { Category } from '@/services/type/category-type'
import { ProductCreate, ProductSize, ProductStatus } from '@/services/type/product-type'
import { Row } from '@tanstack/react-table'
import { AlertCircle, Plus, Store, Tag, Upload, X } from 'lucide-react'
import { useState } from 'react'
// Removing Zod import
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'


interface Props<T> {
    mode: 'add' | 'edit'
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Row<T>
}


export function ProductsActionDialog<T>({ mode, open, onOpenChange }: Props<T>) {

    const [formData, setFormData] = useState<ProductCreate>({
        Name: '',
        UnitPrice: 0,
        PurchasePrice: 0,
        Description: '',
        Quantity: 0,
        Sizes: [] as ProductSize[],
        CategoryId: 0,
        Gender: 'Male',
        Status: ProductStatus.Available,
        Files: []
    });

    const { mutateAsync: createProduct, isPending: isProductCreating } = useCreateProductMutation();

    const { data, isLoading } = useCategoriesQuery({
        page: -1,
        eachPage: 100,
        search: ''
    });

    const categoryList: Category[] = data ? data.data : [];

    const isEdit = mode === 'edit';

    const handleInputChange = (field: keyof ProductCreate, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Manual validation instead of using Zod
        const errors = [];

        if (!formData.Name) errors.push('Name is required');
        if (formData.UnitPrice <= 0) errors.push('Unit price must be positive');
        if (formData.PurchasePrice <= 0) errors.push('Purchase price must be positive');
        if (formData.Quantity < 0) errors.push('Quantity must be non-negative');
        if (!formData.Sizes || formData.Sizes.length === 0) errors.push('At least one size must be selected');
        if (!formData.CategoryId) errors.push('Category is required');
        if (!formData.Gender) errors.push('Gender is required');

        if (errors.length > 0) {
            toast.error(errors[0] || 'Please check the form for errors');
            return;
        }

        try {
            await createProduct(formData);

            toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
            onOpenChange(false);
        } catch {
            toast.error('Failed to create product. Please try again.');
        }
    };

    if (isLoading) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                onOpenChange(state);
            }}
        >
            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader className='text-left space-y-2'>
                    <div className="flex items-center">
                        <span className='bg-primary/10 p-2 rounded-md mr-3'>
                            <Store className='h-5 w-5 text-primary' />
                        </span>
                        <div>
                            <DialogTitle className='text-xl'>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                            <DialogDescription className='text-sm opacity-80'>
                                {isEdit ? 'Update the product here. ' : 'Create new product here. '}
                                Click save when you're done.
                            </DialogDescription>
                        </div>
                    </div>
                    <Separator />
                </DialogHeader>
                <ScrollArea className='max-h-[70vh]'>
                    <div className='grid grid-cols-1 gap-8 w-full py-2 px-1'>
                        {/* Product details */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Left column */}
                            <div className='space-y-4'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-medium'>Name</label>
                                    <Input
                                        value={formData.Name}
                                        onChange={(e) => handleInputChange('Name', e.target.value)}
                                        placeholder='Enter product name'
                                        type='text'
                                        className='border-slate-200 focus-visible:ring-primary/30'
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-medium'>Description</label>
                                    <Textarea
                                        value={formData.Description}
                                        onChange={(e) => handleInputChange('Description', e.target.value)}
                                        placeholder='Enter product description'
                                        className='border-slate-200 focus-visible:ring-primary/30'
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-medium'>Category</label>
                                    <Select
                                        value={formData.CategoryId ? formData.CategoryId.toString() : ''}
                                        onValueChange={(e) => handleInputChange('CategoryId', Number(e))}
                                    >
                                        <SelectTrigger className="w-full border-slate-200 focus-visible:ring-primary/30">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryList.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.id.toString()}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-3.5 w-3.5" />
                                                        {item.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-medium'>Gender</label>
                                    <Select
                                        value={formData.Gender}
                                        onValueChange={(e) => handleInputChange('Gender', e)}
                                    >
                                        <SelectTrigger className="w-full border-slate-200 focus-visible:ring-primary/30">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={'Male'}>
                                                <div className="flex items-center gap-2">
                                                    Male
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={'Female'}>
                                                <div className="flex items-center gap-2">
                                                    Female
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-medium'>Unit Price ($)</label>
                                        <Input
                                            value={formData.UnitPrice}
                                            onChange={(e) => handleInputChange('UnitPrice', Number(e.target.value))}
                                            placeholder="0.00"
                                            type="number"
                                            className='border-slate-200 focus-visible:ring-primary/30'
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-medium'>Purchase Price ($)</label>
                                        <Input
                                            value={formData.PurchasePrice}
                                            onChange={(e) => handleInputChange('PurchasePrice', Number(e.target.value))}
                                            placeholder="0.00"
                                            type="number"
                                            className='border-slate-200 focus-visible:ring-primary/30'
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-medium'>Quantity</label>
                                    <Input
                                        value={formData.Quantity}
                                        onChange={(e) => handleInputChange('Quantity', Number(e.target.value))}
                                        placeholder='Enter quantity'
                                        type='number'
                                        className='border-slate-200 focus-visible:ring-primary/30'
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <div className="flex items-center justify-between">
                                        <label className='text-sm font-medium'>Sizes</label>
                                        <Badge variant="outline" className="text-xs font-normal py-0 px-2">
                                            {formData.Sizes?.length || 0}/6
                                        </Badge>
                                    </div>

                                    <div className={`grid grid-cols-3 gap-2 mb-2`}>
                                        {formData.Sizes?.map((item) => (
                                            <div key={item} className='flex items-center justify-between bg-primary/10 rounded-md px-3 py-1.5 text-xs'>
                                                <span className='font-semibold tracking-wider uppercase'>{item}</span>
                                                <button
                                                    onClick={() => handleInputChange('Sizes', formData.Sizes?.filter((size) => size !== item) || [])}
                                                    className='hover:text-destructive'
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={cn(
                                        "w-full p-0.5 grid grid-cols-6 gap-1 rounded-md border border-slate-200",
                                        (formData.Sizes?.length || 0) >= 6 && "opacity-50"
                                    )}>
                                        {Object.values(ProductSize).map((size) => (
                                            <button
                                                key={size}
                                                disabled={(formData.Sizes?.length || 0) >= 6 || formData.Sizes?.includes(size)}
                                                onClick={() => handleInputChange('Sizes', [...(formData.Sizes || []), size])}
                                                className={cn(
                                                    "uppercase text-xs py-2 rounded",
                                                    formData.Sizes?.includes(size)
                                                        ? "bg-primary text-white font-medium"
                                                        : "hover:bg-primary/10"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product images */}
                        <Card className="border-none shadow-sm">
                            <CardContent className='p-4 bg-muted/30 rounded-lg'>
                                <div className='flex flex-col gap-3'>
                                    <h3 className='text-sm font-semibold flex items-center'>
                                        <Upload className='h-4 w-4 mr-2' /> Product Images
                                    </h3>
                                    <ImageUploader
                                        showModeToggle={false}
                                        defaultMode='multiple'
                                        onChange={(files) => handleInputChange('Files', Array.isArray(files) ? files : [files].filter(Boolean))}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>

                <DialogFooter className="pt-2">
                    {!formData.Name || !formData.CategoryId || !formData.Gender || !formData.Sizes?.length ? (
                        <div className="flex items-center text-amber-600 text-xs mr-auto mb-1">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            Please fill in all required fields
                        </div>
                    ) : null}
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isProductCreating || !formData.Name || !formData.CategoryId || !formData.Gender || !formData.Sizes?.length}
                        className="gap-1"
                    >
                        {isProductCreating ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                {isEdit ? 'Update Product' : 'Create Product'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}