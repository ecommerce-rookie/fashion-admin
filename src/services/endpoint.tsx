import { Token } from "@/enum/storage";
import { getCookie } from "@/utils/storage.util";

const endpoint = import.meta.env.VITE_API_ENDPOINT
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

export const productEndpoint = `${endpoint}/${apiPrefix}/products`
export const userEndpoint = `${endpoint}/${apiPrefix}/users`
export const orderEndpoint = `${endpoint}/${apiPrefix}/orders`
export const categoryEndpoint = `${endpoint}/${apiPrefix}/categories`