import { categoryEndpoint } from "../endpoint";
import fetchPaginatedData, { Pagination, ResponseModel } from "../common";
import axiosServices from "@/lib/axios";
import { Category } from "../type/category-type";

export const GetAllCategories = async ({
    page,
    eachPage,
    search
}: {
    page: number;
    eachPage: number;
    search?: string;
}): Promise<Pagination<Category[]>> => {
    return await fetchPaginatedData(
        categoryEndpoint,
        {
            page,
            eachPage,
            search
        }
    )
}

export const CreateCategory = async ({
    name,
    description
}: {
    name: string;
    description: string;
}): Promise<ResponseModel<string>> => {
    const response = await axiosServices.post(categoryEndpoint, {
        name,
        description
    })

    return response.data
}

export const UpdateCategory = async ({
    id,
    name,
    description
}: {
    id: string;
    name: string;
    description: string;
}): Promise<ResponseModel<string>> => {
    const response = await axiosServices.patch(`${categoryEndpoint}/${id}`, {
        name,
        description
    })

    return response.data
}

export const DeleteCategory = async ({
    id
}: {
    id: number;
}): Promise<ResponseModel<string>> => {
    const response = await axiosServices.delete(`${categoryEndpoint}/${id}`)

    return response.data
}
