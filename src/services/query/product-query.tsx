import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateProduct, DeleteProduct, GetAllProducts, UpdateProduct } from "../api/product-api"

export const useProductsQuery = (params: {
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
    const queryKey = ['products', params];
    const queryFn = async () => {
        return GetAllProducts(params);
    }

    return { queryKey, queryFn };
}


export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => CreateProduct(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            return data;
        },
        onError: (error) => {
            return error;
        }
    })
}


export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { data: FormData, slug: string }) => UpdateProduct(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            return data;
        },
        onError: (error) => {
            return error;
        }
    })
}


export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => DeleteProduct(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            return data;
        },
        onError: (error) => {
            return error;
        }
    })
}