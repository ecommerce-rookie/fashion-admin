export type User = {
    email: string
    firstName: string
    lastName: string
    phone: string
    avatar: string
    status: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

export enum UserRole {
    ADMIN = 'Admin',
    STAFF = 'Staff',
    CUSTOMER = 'Customer'
}