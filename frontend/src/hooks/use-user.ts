//@ts-nocheck
import axios from "axios";
import type {AxiosRequestConfig } from "axios";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import {getDeviceInfo} from "@/lib/utils";
import { useAlert } from "@/context/AlertContext";

interface UseApiReturn<T>{
    loading: boolean;
    error: string | null;
    checkSession: (url: string, config?: AxiosRequestConfig) => Promise<void>;
    login: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;
    logout: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;

}

let apiClient: any;
const base_url = import.meta.env.VITE_API_BASE_URL;
const getDI = await getDeviceInfo();
// Initialize apiClient synchronously
apiClient = axios.create({
    baseURL: base_url,
    headers: {
        platformVersion: getDI?.platformVersion || "none",
        platform: getDI?.platform || "none",
    },
    withCredentials: true

});



export const useApi = <T = any>(): UseApiReturn<T> => {
    const {addToken} = useUser();
    const {updateAlert} = useAlert();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckSession = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
            addToken(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const handleLoginRequest = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
           addToken(response.data.token);
            updateAlert({message: "Login Success!", alive: true})
        } catch (err: any) {
            console.log(err?.response?.data?.message || "Something went wrong")
            updateAlert({status: "error", message: err?.response?.data?.message || "Something went wrong", alive: true})
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const handleLogoutRequest = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
           addToken(null);
            updateAlert({message: "Logout Success!", alive: true})
        } catch (err: any) {
            updateAlert({status: "error", message: err?.response?.data?.message || "Something went wrong", alive: true})
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const checkSession = (url: string, config?: AxiosRequestConfig) => handleCheckSession(() => apiClient.get(url, config))
      const login = (url: string, body?: any,  config?: AxiosRequestConfig) => handleLoginRequest(() => apiClient.post(url,body, config))

      const logout = (url: string, body?: any,  config?: AxiosRequestConfig) => handleLogoutRequest(() => apiClient.post(url,body, config))

    return { loading, error, checkSession, login, logout };
}