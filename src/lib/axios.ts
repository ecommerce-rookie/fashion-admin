/* eslint-disable */
import axios, { AxiosError } from "axios";
import { getCookie } from "@/utils/storage.util";
import { Token } from "@/enum/storage";
import authService from "@/services/auth-service";

const axiosServices = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 50000,
});

axiosServices.interceptors.request.use(
    async function (config) {
        // Ưu tiên sử dụng token từ AuthService (OIDC)
        const accessToken = getCookie(Token.JWT_TOKEN);
        
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        } else {
            // Fallback: Sử dụng token cũ từ cookie nếu có
            const cookieToken = getCookie(Token.JWT_TOKEN);
            if (cookieToken) {
                config.headers["Authorization"] = `Bearer ${cookieToken}`;
            }
        }
        
        config.headers["Content-Type"] = "application/json";
        return config;
    },
    function (error) {
        return Promise.reject(error instanceof Error ? error : new Error(error?.message ?? 'Request error'));
    }
);

axiosServices.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        // Properly reject unauthorized errors so they can be caught by ReactQuery
        if (axios.isAxiosError(err) && err.response) {
            // For 401 and other auth errors, reject with the original error
            if (err.response.status === 401 || err.response.status === 403) {
                return Promise.reject(err);
            }
            
            // For other errors, you can keep your current approach if desired
            return {
                success: false,
                status: err.response.status,
                message: err.response.data.message ?? 'An error occurred',
                data: err.response.data
            };
        }

        return Promise.reject(err instanceof Error ? err : new Error('Unknown error'));
    }
);

const axiosUpload = axios.create({
    baseURL: import.meta.env.API_URL,
    timeout: 50000,
});

axiosUpload.interceptors.request.use(
    async function (config) {
        // Ưu tiên sử dụng token từ AuthService (OIDC)
        const accessToken = await authService.getAccessToken();
        
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        } else {
            // Fallback: Sử dụng token cũ từ cookie nếu có
            const cookieToken = getCookie(Token.JWT_TOKEN);
            if (cookieToken) {
                config.headers["Authorization"] = `Bearer ${cookieToken}`;
            }
        }
        
        config.headers["Content-Type"] = "multipart/form-data";
        return config;
    },
    function (err) {
        return Promise.reject(err instanceof Error ? err : new Error(err?.message ?? 'Request error'));
    }
);

axiosUpload.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        // Properly reject unauthorized errors so they can be caught
        if (axios.isAxiosError(err) && err.response) {
            // For 401 and other auth errors, reject with the original error
            if (err.response.status === 401 || err.response.status === 403) {
                return Promise.reject(err);
            }
            
            // For other errors, you can keep the current approach
            return {
                success: false,
                status: err.response.status,
                message: err.response.data.message ?? 'An error occurred',
                data: err.response.data
            };
        }

        return Promise.reject(err instanceof Error ? err : new Error('Unknown error'));
    }
);

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error);
}

export const axiosClientUpload = axiosUpload;
export default axiosServices;
