import { Author } from "./user-type"

export type ProductPreview = {
    id: string
    name: string
    unitPrice: number
    purchasePrice: number
    status: string
    image: string
    isNew: boolean
    slug: string
    author: Author
    categoryName: string
    reviewCount: number
    star: number
}

export type ProductDetail = {
    id: string
    name: string | null
    unitPrice: number
    purchasePrice: number
    description: string | null
    status: ProductStatus
    categoryId: number
    categoryName: string | null
    quantity: number | null
    colors: string[]
    sizes: ProductSize[]
    gender: string
    images: string[]
    author: {
        id: string
        firstName: string | null
        lastName: string | null
        avatar: string | null
    }
    isNew: boolean
    star: number
    reviewCount: number
    createdAt: string
    updatedAt: string
    isDeleted: boolean
}

export enum ProductStatus {
    Available = 'Available',
    OutOfStock = 'OutOfStock',
    Blocked = 'Blocked',
    Deleted = 'Deleted',
}

export enum ProductSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
}

export type ProductCreate = {
    Name: string
    UnitPrice: number
    PurchasePrice: number
    Description: string
    Status: ProductStatus
    CategoryId: number
    Quantity: number
    Sizes?: ProductSize[]
    Gender: string
    Files?: File[] | ImageUpload[]
}

export type ProductUpdate = ProductCreate & {
    slug: string
    images?: string[]
}

export type ImageUpload = {
    file: File
    order: number
}