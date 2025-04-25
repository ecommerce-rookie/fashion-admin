import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateProduct, DeleteProduct, GetAllProducts, UpdateProduct } from "../api/product-api"
import { toast } from "sonner"

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
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => GetAllProducts(params),
    })
}


export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create-product"],
        mutationFn: CreateProduct,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });

            toast.success(data.message ?? "Create successfully");

            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    })
}


export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["update-product"],
        mutationFn: UpdateProduct,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });

            toast.success(data.message ?? "Create successfully");

            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    })
}


export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["delete-product"],
        mutationFn: DeleteProduct,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });

            toast.success(data.message ?? "Create successfully");

            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    })
}