import { productEndpoint } from "../endpoint";
import fetchPaginatedData, { Pagination, ResponseModel } from "../common";
import axiosServices, { axiosClientUpload } from "@/lib/axios";
import { ProductDetail, ProductPreview } from "../type/product-type";


export const getAllProducts = async ({
    page,
    eachPage,
    sortBy,
    isAscending,
    categories,
    search,
    minPrice,
    maxPrice,
    isNew,
    isSale,
    sizes
}: {
    page: number;
    eachPage: number;
    sortBy?: string;
    isAscending?: boolean;
    categories?: number[];
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isNew?: boolean;
    isSale?: boolean;
    sizes?: string[];
}): Promise<Pagination<ProductPreview[]>> => {
    const cleanedCategories = categories && categories.length > 0
        ? categories.map(category => category.toString())
        : undefined;

    return await fetchPaginatedData(
        `${productEndpoint}/manage`,
        {
            page,
            eachPage,
            sortBy,
            isAscending,
            categories: cleanedCategories,
            search,
            minPrice,
            maxPrice,
            isNew,
            isSale,
            sizes
        }
    )
}

export const getProductBySlug = async (slug: string): Promise<ResponseModel<ProductDetail>> => {

    const response = await axiosServices.get(`${productEndpoint}/${slug}`)

    return response.data
}

export const CreateProduct = async (data: FormData): Promise<ResponseModel<string>> => {
    const response = await axiosClientUpload.post(productEndpoint, data);

    return response.data;
};

export const UpdateProduct = async ({
    slug,
    data
}: {
    slug: string;
    data: FormData;
}): Promise<ResponseModel<string>> => {
    const response = await axiosClientUpload.patch(`${productEndpoint}/${slug}`, data);

    return response.data;
};

export const DeleteProduct = async ({
    id
}: {
    id: string;
}): Promise<ResponseModel<string>> => {
    const response = await axiosServices.delete(`${productEndpoint}/${id}`);

    return response.data;
};
