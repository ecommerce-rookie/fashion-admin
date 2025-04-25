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

export type Author = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
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