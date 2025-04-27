import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateProduct, DeleteProduct, getAllProducts, getProductBySlug, UpdateProduct } from "../api/product-api"
import { toast } from "sonner"

export const useProductsQuery = (params: {
    page: number
    eachPage: number
    sortBy?: string
    isAscending?: boolean
    categories?: number[]
    search?: string
    minPrice?: number
    maxPrice?: number
    isNew?: boolean
    isSale?: boolean
    sizes?: string[]
}) => {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => getAllProducts(params),
    })
}

export const useProductBySlugQuery = (slug: string) => {
    return useQuery({
        queryKey: ["product-by-id", slug],
        queryFn: () => getProductBySlug(slug),
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