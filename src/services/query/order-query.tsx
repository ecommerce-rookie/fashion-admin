import { GetAllOrders } from "../api/order-api"

export const useOrdersQuery = (params: {
    Page: number
    EachPage: number
    OrderStatuss: string[]
    PaymentMethods: string[]
    Search: string
}) => {
    const queryKey = ['orders', params];
    const queryFn = async () => {
        return GetAllOrders(params);
    }

    return { queryKey, queryFn };
}