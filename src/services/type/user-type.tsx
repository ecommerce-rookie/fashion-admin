export type User = {
    id: string
    email: string
    firstName?: string
    lastName: string
    phone: string
    avatar: string
    status: string
    isDeleted: boolean
    createdAt: string
    updatedAt?: string
    role: UserRole
}

export enum UserRole {
    ADMIN = 'Admin',
    STAFF = 'Staff',
    CUSTOMER = 'Customer'
}

export enum UserStatus {
    ACTIVE = 'Active',
    DELETED = 'Deleted',
    PENDING = 'Pending',
    BLOCKED = 'Blocked'
}