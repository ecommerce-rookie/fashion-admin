import axios from "axios";
import { userEndpoint } from "../endpoint";
import { User, UserRole } from "../type/user-type";
import fetchPaginatedData, { Pagination, ResponseModel } from "../common";
import axiosServices from "@/lib/axios";

export const GetAllUsers = async (params: {
    Page: number
    EachPage: number
    Roles?: UserRole[]
    Search?: string
    Statuss?: string[]
}): Promise<Pagination<User[]>> => {
    return await fetchPaginatedData<User[]>(
        userEndpoint,
        {
            Page: params.Page,
            EachPage: params.EachPage,
            Roles: params.Roles,
            Search: params.Search,
            Statuss: params.Statuss
        },
    )
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
}): Promise<ResponseModel<string>> => {

    const response = await axiosServices.post(userEndpoint, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        avatar: avatar,
        status: status,
    })

    return response.data;
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

    const response = await axiosServices.patch(`${userEndpoint}/${id}`, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        avatar: avatar,
        status: status,
    })

    return response.data;
}

export const UpdateUserStatus = async ({
    userId,
    status
}: {
    userId: string,
    status: string
}): Promise<ResponseModel<string>> => {
    const response = await axiosServices.patch(`${userEndpoint}/${userId}`, {
        status: status
    })

    return response.data;
}

export const DeleteUser = async ({
    id
}: {
    id: string
}): Promise<ResponseModel<string>> => {

    const response = await axios.delete(`${userEndpoint}/${id}`)

    return response.data;
}