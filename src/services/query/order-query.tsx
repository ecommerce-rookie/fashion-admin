import { useQuery } from "@tanstack/react-query"
import { GetAllOrders } from "../api/order-api"

export const useOrdersQuery = (params: {
    page: number
    eachPage: number
    orderStatuss?: string[]
    paymentMethods?: string[]
    search?: string
}) => {
    return useQuery({
        queryKey: ["orders", params],
        queryFn: () => GetAllOrders(params),
    })
}