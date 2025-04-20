import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateUser, DeleteUser, GetAllUsers, UpdateUser } from "../api/user-api"
import { UserRole } from "../type/user-type"

export const useUsersQuery = (params: {
    Page: number
    EachPage: number
    Roles: UserRole[]
    Search: string
    Statuss: string[]
}) => {
    const queryKey = ['users', params];
    const queryFn = async () => {
        return GetAllUsers(params);
    }

    return { queryKey, queryFn };
}


export const useCreateUserMutation = ({
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
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => CreateUser({
            email: email,
            firstName: firstName,
            lastName: lastName,
            avatar: avatar,
            phone: phone,
            status: status
        }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            return data;
        },
        onError: (error) => {
            return error;
        }
    })
}

export const useUpdateUserMutation = ({
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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => UpdateUser({
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            avatar: avatar,
            phone: phone,
            status: status
        }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            return data;
        },
        onError: (error) => {
            return error;
        }
    })
}


export const useDeleteUserMutation = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => DeleteUser(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            return data;
        },
        onError: (error) => {
            return error;
        }
    })
}