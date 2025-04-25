import { orderEndpoint } from "../endpoint"
import fetchPaginatedData, { Pagination } from "../common"
import { Order } from "../type/order-type"

export const GetAllOrders = async (params: {
    page: number
    eachPage: number
    orderStatuss?: string[]
    paymentMethods?: string[]
    search?: string
}): Promise<Pagination<Order>> => {

    return await fetchPaginatedData(
        orderEndpoint, params
    )
}