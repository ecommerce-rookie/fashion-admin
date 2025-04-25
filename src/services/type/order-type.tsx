import { Author } from "./user-type";

export enum OrderStatus {
    Pending = "Pending",
    Processing = "Processing",
    Shipping = "Shipping",
    Delivered = "Delivered",
    Cancelled = "Cancelled",
}

export enum PaymentMethod {
    Cash = "Cash",
    PayOS = "PayOS",
    ZaloPay = "ZaloPay",
    Momo = "Momo",
    VnPay = "VnPay",
}

export type Order = {
    id: string;
    totalPrice: number;
    address: string | null;
    orderStatus: OrderStatus;
    paymentMethod: PaymentMethod;
    nameReceiver: string | null;
    totalItems: number;
    createdAt: string;
    updatedAt: string | null;
    customer: Author;
};