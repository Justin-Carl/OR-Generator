//@ts-nocheck
import axios from "axios";
import type {AxiosRequestConfig } from "axios";
import { useState } from "react";
import { useCategory } from "@/context/CategoryContext";
import { useAlert } from "@/context/AlertContext";
import {getDeviceInfo} from "@/lib/utils";

interface UseApiReturn<T>{
    loading: boolean;
    error: string | null;
    getCategory: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;
    createCategory: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;
    exportCategories: (url: string, body?: any, config?: AxiosRequestConfig) => Promise<void>;
    editCategory: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;
    del: (url: string, config?: AxiosRequestConfig) => Promise<void>;
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
    const {addCategories, addExportData} = useCategory();
    const {updateAlert} = useAlert();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequest = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
            addCategories(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const handleGetRequest = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request();
            addCategories(response.data.data?.list);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

     const handleAddRequest = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
            updateAlert({message: response.data.message || "Added successfully!", alive: true})
        } catch (err: any) {
            updateAlert({status: "error", message: err?.response?.data?.message || "Something went wrong", alive: true})
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const handleExportRequest = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
            addExportData(response.data)
            updateAlert({message: "Export Success!", alive: true})
        } catch (err: any) {
            updateAlert({status: "error", message: err?.response?.data?.message || "Something went wrong", alive: true})
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const handleEditRequest = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
            updateAlert({...response.data, alive: true})
        } catch (err: any) {
            updateAlert({status: "error", message: err?.response?.data?.message || "Something went wrong", alive: true})
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const getCategory = (url: string, body?: any,  config?: AxiosRequestConfig) => handleGetRequest(() => apiClient.post(url,body, config))
    const createCategory = (url: string, body?: any,  config?: AxiosRequestConfig) => handleAddRequest(() => apiClient.post(url,body, config))
    
    const exportCategories = (url: string, body?: any, config?: AxiosRequestConfig) => handleExportRequest(() => apiClient.post(url, body, config))

    const editCategory = (url: string, body?: any,  config?: AxiosRequestConfig) => handleEditRequest(() => apiClient.post(url,body, config))
    const del = (url: string, config?: AxiosRequestConfig) => handleRequest(() => apiClient.delete(url, config))

    return { loading, error, getCategory, createCategory, exportCategories, editCategory, del };
}