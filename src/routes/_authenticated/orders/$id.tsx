import { OrderDetail } from "@/features/orders/components/order-detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_authenticated/orders/$id')({
    component: OrderDetail,
})