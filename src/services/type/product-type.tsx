export type Product = {
    id: string
    name: string
    unitPrice: number
    purchasePrice: number
    status: string
    image: string
    isNew: boolean
    slug: string
}

export type ProductDetail = {
    Name: string
    UnitPrice: number
    PurchasePrice: number
    Description: string
    Quantity: number
    Sizes: string[]
    CategoryId: string
    Gender: string
    Files: File[]
}