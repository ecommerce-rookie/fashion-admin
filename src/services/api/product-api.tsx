import axios from "axios"
import { authApiConfig, createQueryString, productEndpoint } from "../endpoint"

export const GetAllProducts = async (params: {
    Page: number
    EachPage: number
    SortBy?: string
    IsAscending?: boolean
    Categories?: number[]
    Search?: string
    MinPrice?: number
    MaxPrice?: number
    IsNew?: boolean
    IsSale?: boolean
    Sizes?: string[]
}) => {

    try {
        const queryString = createQueryString(params)
        const response = await axios.get(`${productEndpoint}?${queryString}`)
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

export const CreateProduct = async (data: FormData) => {

    const config = authApiConfig();

    if (!config) {
        return;
    }

    try {

        const response = await axios.post(
            productEndpoint,
            data,
            {
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data',
                },
            });
        return {
            success: true,
            status: response.status,
            data: response.data
        }

    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                status: error.response.status,
                message: error.response.data.message || 'An error occurred',
                data: error.response.data
            };
        } else {
            return {
                success: false,
                status: 500,
                message: 'An unexpected error occurred',
                data: null
            };
        }

    }
}

export const UpdateProduct = async (data: { data: FormData, slug: string }) => {

    const config = authApiConfig();

    if (!config) {
        return;
    }

    try {

        const response = await axios.post(
            `${productEndpoint}/${data.slug}`,
            data.data,
            {
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data',
                },
            });
        return {
            success: true,
            status: response.status,
            data: response.data
        }

    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                status: error.response.status,
                message: error.response.data.message || 'An error occurred',
                data: error.response.data
            };
        } else {
            return {
                success: false,
                status: 500,
                message: 'An unexpected error occurred',
                data: null
            };
        }

    }
}

export const DeleteProduct = async (id: string) => {

    const config = authApiConfig();

    if (!config) {
        return;
    }

    try {

        const response = await axios.delete(`${productEndpoint}/${id}`)

        return {
            success: true,
            status: response.status,
            data: response.data
        }

    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                status: error.response.status,
                message: error.response.data.message || 'An error occurred',
                data: error.response.data
            };
        } else {
            return {
                success: false,
                status: 500,
                message: 'An unexpected error occurred',
                data: null
            };
        }

    }
}
