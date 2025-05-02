import { productEndpoint } from "../endpoint";
import fetchPaginatedData, { Pagination, ResponseModel } from "../common";
import axiosServices, { axiosClientUpload } from "@/lib/axios";
import { ProductCreate, ProductDetail, ProductPreview, ProductUpdate } from "../type/product-type";


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

    const response = await axiosServices.get(`${productEndpoint}/manage/${slug}`)

    return response.data
}

export const CreateProduct = async (data: ProductCreate): Promise<ResponseModel<string>> => {
    const formData = new FormData();
    formData.append("name", data.Name);
    formData.append("unitPrice", data.UnitPrice.toString());
    formData.append("purchasePrice", data.PurchasePrice.toString());
    formData.append("description", data.Description);
    formData.append("status", data.Status);
    formData.append("gender", data.Gender);
    formData.append("categoryId", data.CategoryId.toString());
    formData.append("quantity", data.Quantity.toString());
    formData.append("sizes", JSON.stringify(data.Sizes));
    data.Sizes?.forEach((size) => {
        formData.append("sizes", size);
    })
    data?.Files?.forEach((image) => {
        formData.append("files", image as File);
    });

    const response = await axiosClientUpload.postForm(productEndpoint, formData);

    return response.data;
};

export const UpdateProduct = async ({
    slug,
    data
}: {
    slug: string;
    data: ProductUpdate;
}): Promise<ResponseModel<string>> => {
    const response = await axiosClientUpload.patch(`${productEndpoint}/${slug}`, data);

    return response.data;
};

export const DeleteProduct = async ({
    id,
    isHard
}: {
    id: string;
    isHard?: boolean;
}): Promise<ResponseModel<string>> => {
    const response = await axiosServices.delete(`${productEndpoint}/${id}?isHard=${isHard}`);

    return response.data;
};
