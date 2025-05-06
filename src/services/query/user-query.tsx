import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CreateUser, DeleteUser, GetAllUsers, getAuthor, UpdateUser, UpdateUserStatus } from "../api/user-api"
import { UserRole } from "../type/user-type"

export const useUsersQuery = ({
    page,
    eachPage,
    status,
    search,
    roleName,
}: {
    page: number;
    eachPage: number;
    status?: string[];
    search?: string;
    roleName?: UserRole[];
}) => {
    return useQuery({
        queryKey: ["users", page, eachPage, status, search, roleName],
        queryFn: () =>
            GetAllUsers({
                Page: page,
                EachPage: eachPage,
                Statuss: status,
                Search: search,
                Roles: roleName,
            }),
    });
};


export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create-user"],
        mutationFn: CreateUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });

            toast.success(data.message ?? "Create successfully");

            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    });
};

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["update-user"],
        mutationFn: UpdateUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success(data.message ?? "Update successfully");
            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    });
};


export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["delete-user"],
        mutationFn: DeleteUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success(data.message ?? "Delete successfully");
            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    });
};

export const useUpdateUserStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["update-user-status"],
        mutationFn: UpdateUserStatus,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success(data.message ?? "Status updated successfully");
            return data;
        },
        onError: (error) => {
            toast.error(error.message ?? "Some error occurred");
        },
    });
};

export const useGetAuthorQuery = () => {
    return useQuery({
        queryKey: ["author"],
        queryFn: () => getAuthor(),
    });
}