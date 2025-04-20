import axios from "axios"
import { createQueryString, orderEndpoint } from "../endpoint"

export const GetAllOrders = async (params: {
    Page: number
    EachPage: number
    OrderStatuss: string[]
    PaymentMethods: string[]
    Search: string
}) => {

    try {
        const queryString = createQueryString(params)
        const response = await axios.get(`${orderEndpoint}?${queryString}`)
        const paginationHeader = response.headers['x-pagination'];
        const metadata = JSON.parse(paginationHeader || '{}');

        return {
            success: true,
            status: response.status,
            data: {
                data: response.data,
                totalCount: metadata.TotalCount,
                pageSize: metadata.PageSize,
                currentPage: metadata.CurrentPage,
                totalPages: metadata.TotalPages
            }
        }

    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            return {
                success: false,
                status: e.response.status,
                message: e.response.data.message || 'An error occurred',
                data: e.response.data
            };
        }

        return {
            success: false,
            status: 500,
            message: 'An error occurred',
            data: null
        };
    }
}