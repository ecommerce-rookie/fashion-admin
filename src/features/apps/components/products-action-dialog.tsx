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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategoriesQuery } from '@/services/query/category-query'
import { Category } from '@/services/type/category-type'
import { useQuery } from '@tanstack/react-query'
import { Plus, Upload, X } from 'lucide-react'
import { useState } from 'react'


interface Props {
    mode: 'add' | 'edit'
    open: boolean
    onOpenChange: (open: boolean) => void
}


export function ProductsActionDialog({ mode, open, onOpenChange }: Props) {


    const [name, setName] = useState('')
    const [unitPrice, setUnitPrice] = useState(0)
    const [purchasePrice, setPurchasePrice] = useState(0)
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [sizes, setSizes] = useState<string[]>([])
    const [sizeList, setSizeList] = useState<string[]>(['xs', 's', 'm', 'l', 'xl', 'xxl'])
    const [category, setCategory] = useState('')
    const [gender, setGender] = useState('')
    const [files, setFiles] = useState<File[]>([])

    const { data, isLoading } = useQuery(
        useCategoriesQuery()
    );

    const categoryList: Category[] = isLoading ? [] : data?.data

    const isEdit = mode == 'edit'

    const handleSelectSize = (selectedSize: string) => {
        setSizes((prev) => [...prev, selectedSize])
        setSizeList((prev) => prev.filter((item) => item !== selectedSize))
    }

    const handleRemoveSize = (sizeToRemove: string) => {
        setSizes((prev) => prev.filter((item) => item !== sizeToRemove))
        setSizeList((prev) => [...prev, sizeToRemove])
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                onOpenChange(state)
            }}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-left'>
                    <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update the product here. ' : 'Create new product here. '}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full overflow-y-auto py-1 pr-4'>

                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Name</p>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter name'
                            type='text'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Unit Price</p>
                        <Input
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(Number(e.target.value))}
                            placeholder="Enter unit price"
                            type="number"
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Purchase Price</p>
                        <Input
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(Number(e.target.value))}
                            placeholder="Enter purchase price"
                            type="number"
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Description</p>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Enter description'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Quantity</p>
                        <Input
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            placeholder='Enter quantity'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Category</p>
                        <Select
                            value={category}
                            onValueChange={(e) => setCategory(e)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryList.map((item, index) => (
                                    <SelectItem
                                        key={index}
                                        value={item.id.toString()}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='col-span-full flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Sizes</p>
                        <div className={`grid grid-cols-4 gap-2 `}>
                            {sizes.map((item) => (
                                <div key={item} className='flex flex-row bg-black text-white w-full justify-between items-center rounded px-2 py-1'>
                                    <p className='text-xs font-bold tracking-widest uppercase'>{item}</p>
                                    <button
                                        onClick={() => handleRemoveSize(item)}
                                        className='hover:text-red-500'
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Select onValueChange={(val) => handleSelectSize(val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a size" />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeList.map((item, index) => (
                                    <SelectItem
                                        key={index}
                                        className='uppercase'
                                        value={item}
                                    >
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='col-span-full flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Gender</p>
                        <Select
                            value={gender}
                            onValueChange={(e) => setGender(e)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={'male'}>
                                    Male
                                </SelectItem>
                                <SelectItem value={'female'}>
                                    Female
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='col-span-full flex flex-col gap-2'>
                        <p className='text-sm font-semibold tracking-wider'>Images</p>
                        <label htmlFor="file-upload">
                            <div className="flex flex-row gap-4 items-center bg-black px-3 py-2 rounded hover:bg-[#333] cursor-pointer w-fit">
                                <p className='text-white text-xs font-semibold tracking-wider'>
                                    {files.length === 0 ? 'Choose Images' : 'Add Images'}
                                </p>
                                {files.length === 0 ? (
                                    <Upload size={17} className='text-white' />
                                ) : (
                                    <Plus size={17} className='text-white' />
                                )}
                            </div>
                        </label>

                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const newFiles = Array.from(e.target.files);
                                    setFiles((prev) => [...prev, ...newFiles]);
                                    e.target.value = '';
                                }
                            }}
                        />
                        {files.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {files.slice(0, 3).map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative group border rounded overflow-hidden"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${index}`}
                                            className="object-cover w-full h-24"
                                        />
                                        <button
                                            onClick={() =>
                                                setFiles((prev) => prev.filter((_, i) => i !== index))
                                            }
                                            className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {files.length > 3 && (
                                    <div className="flex items-center justify-center border rounded bg-gray-100 text-gray-600 font-semibold text-lg">
                                        +{files.length - 3}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <DialogFooter>
                    <Button>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
