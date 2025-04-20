import axios from "axios";
import { authApiConfig, createQueryString, userEndpoint } from "../endpoint";
import { UserRole } from "../type/user-type";

export const GetAllUsers = async (params: {
    Page: number
    EachPage: number
    Roles: UserRole[]
    Search: string
    Statuss: string[]
}) => {

    try {
        const queryString = createQueryString(params)
        const response = await axios.get(`${userEndpoint}?${queryString}`)
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

export const CreateUser = async ({
    email,
    firstName,
    lastName,
    phone,
    avatar,
    status
}: {
    email: string
    firstName: string
    lastName: string
    phone: string
    avatar: string
    status: string
}) => {

    const config = authApiConfig();

    if (!config) {
        return;
    }

    try {

        const response = await axios.post(userEndpoint, {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            avatar: avatar,
            status: status,
        })
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

export const UpdateUser = async ({
    id,
    email,
    firstName,
    lastName,
    phone,
    avatar,
    status
}: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone: string
    avatar: string
    status: string
}) => {

    const config = authApiConfig();

    if (!config) {
        return;
    }

    try {

        const response = await axios.patch(`${userEndpoint}/${id}`, {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            avatar: avatar,
            status: status,
        })
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

export const DeleteUser = async (id: string) => {

    const config = authApiConfig();

    if (!config) {
        return;
    }

    try {

        const response = await axios.delete(`${userEndpoint}/${id}`)
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