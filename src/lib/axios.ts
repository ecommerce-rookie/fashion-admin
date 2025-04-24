import axios, { AxiosError } from "axios";
import { getCookie } from "@/utils/storage.util";
import { Token } from "@/enum/storage";

const axiosServices = axios.create({
    baseURL: import.meta.env.API_URL,
    timeout: 50000,
});

axiosServices.interceptors.request.use(
    function (config) {
        const accessToken = getCookie(Token.JWT_TOKEN);
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        config.headers["Content-Type"] = "application/json";
        return config;
    },
    function (error) {
        return Promise.reject(new Error(error.message || 'Request error'));
    }
);

axiosServices.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        if (axios.isAxiosError(err) && err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data.message || 'An error occurred',
                data: err.response.data
            };
        }

        return {
            success: false,
            status: 500,
            message: 'An error occurred',
            data: null
        };
    }
);

const axiosUpload = axios.create({
    baseURL: import.meta.env.API_URL,
    timeout: 50000,
});

axiosUpload.interceptors.request.use(
    function (config) {
        const accessToken = getCookie(Token.JWT_TOKEN);
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        config.headers["Content-Type"] = "multipart/form-data";
        return config;
    },
    function (err) {
        if (axios.isAxiosError(err) && err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data.message || 'An error occurred',
                data: err.response.data
            };
        }

        return {
            success: false,
            status: 500,
            message: 'An error occurred',
            data: null
        };
    }
);

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error);
}

export const axiosClientUpload = axiosUpload;
export default axiosServices;
