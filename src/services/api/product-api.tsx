import { productEndpoint } from "../endpoint";
import fetchPaginatedData, { Pagination, ResponseModel } from "../common";
import axiosServices, { axiosClientUpload } from "@/lib/axios";
import { Product } from "../type/product-type";

export const GetAllProducts = async ({
    Page,
    EachPage,
    SortBy,
    IsAscending,
    Categories,
    Search,
    MinPrice,
    MaxPrice,
    IsNew,
    IsSale,
    Sizes
}: {
    Page: number;
    EachPage: number;
    SortBy?: string;
    IsAscending?: boolean;
    Categories?: number[];
    Search?: string;
    MinPrice?: number;
    MaxPrice?: number;
    IsNew?: boolean;
    IsSale?: boolean;
    Sizes?: string[];
}): Promise<Pagination<Product[]>> => {
    const cleanedCategories = Categories && Categories.length > 0
        ? Categories.map(category => category.toString())
        : undefined;

    return await fetchPaginatedData(
        productEndpoint,
        {
            Page,
            EachPage,
            SortBy,
            IsAscending,
            Categories: cleanedCategories,
            Search,
            MinPrice,
            MaxPrice,
            IsNew,
            IsSale,
            Sizes
        }
    );
};

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
