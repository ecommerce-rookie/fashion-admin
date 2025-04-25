/* eslint-disable @typescript-eslint/no-explicit-any */
import { Token } from "@/enum/storage";
import { getCookie } from "@/utils/storage.util";

const apiPrefix = '/api/v1'

export const authApiConfig = () => {
    const token = getCookie(Token.JWT_TOKEN);
    return (
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export const createQueryString = (params: Record<string, any>): string => {
    const urlParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
        const value = params[key];
        if (Array.isArray(value)) {
            value.forEach(val => urlParams.append(key, val));
        } else if (value !== undefined && value !== null) {
            urlParams.append(key, value);
        }
    });

    return urlParams.toString();
};

export const productEndpoint = `${apiPrefix}/products`
export const userEndpoint = `${apiPrefix}/users`
export const orderEndpoint = `${apiPrefix}/orders`
export const categoryEndpoint = `${apiPrefix}/categories`