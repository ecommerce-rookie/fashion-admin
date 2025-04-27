import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCategory, DeleteCategory, GetAllCategories, UpdateCategory } from "../api/category-api";
import { toast } from "sonner";

export const useCategoriesQuery = ({
    page,
    eachPage,
    search
}: {
    page: number;
    eachPage: number;
    search?: string;
}) => {
    return useQuery({
        queryKey: ["categories", page, eachPage, search],
        queryFn: () => GetAllCategories({ page, eachPage, search }),
    })
}

export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["create-category"],
        mutationFn: CreateCategory,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });

            toast.success(data.message ?? "Create successfully");

            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    })
}

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["update-category"],
        mutationFn: UpdateCategory,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });

            toast.success(data.message ?? "Update successfully");

            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    })
}

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["delete-category"],
        mutationFn: DeleteCategory,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });

            toast.success("Delete successfully");

            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    })
}