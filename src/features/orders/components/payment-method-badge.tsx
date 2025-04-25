import { Badge } from "@/components/ui/badge"
import { PaymentMethod } from "@/services/type/order-type"

interface PaymentMethodBadgeProps {
    method: string
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
    const methodConfig = {
        cash: { label: PaymentMethod.Cash, variant: "outline" as const },
        payos: { label: PaymentMethod.PayOS, variant: "secondary" as const },
        zalopay: { label: PaymentMethod.ZaloPay, variant: "default" as const },
        momo: { label: PaymentMethod.Momo, variant: "default" as const, className: "bg-pink-500 hover:bg-pink-600" as const },
        vnpay: { label: PaymentMethod.VnPay, variant: "default" as const, className: "bg-blue-500 hover:bg-blue-600" as const },
    }

    const config = methodConfig[method.toLowerCase() as keyof typeof methodConfig] || methodConfig.cash

    return <Badge variant={config.variant}>{config.label}</Badge>
}