import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/services/type/order-type"

interface OrderStatusBadgeProps {
    status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const statusConfig = {
        pending: { label: OrderStatus.Pending, variant: "outline" as const },
        processing: { label: OrderStatus.Processing, variant: "secondary" as const },
        shipped: { label: OrderStatus.Shipping, variant: "default" as const },
        delivered: { label: OrderStatus.Delivered, variant: "default" as const },
        cancelled: { label: OrderStatus.Cancelled, variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return <Badge variant={config.variant}>{config.label}</Badge>
}
