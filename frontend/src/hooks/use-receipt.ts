//@ts-nocheck
import axios from "axios";
import type {AxiosRequestConfig } from "axios";
import { useState } from "react";
import { useReceipt } from "@/context/ReceiptContext";
import { useAlert } from "@/context/AlertContext";
import {getDeviceInfo} from "@/lib/utils";

interface UseApiReturn<T>{
    loading: boolean;
    error: string | null;
    getReceipt: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;
    uploadReceipt: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;
    exportReceipts: (url: string, body?: any, config?: AxiosRequestConfig) => Promise<void>;
    editReceipt: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;
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
    const {addReceipts, addExportData} = useReceipt();
    const {updateAlert} = useAlert();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequest = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
            addReceipts(response.data);
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
            addReceipts(response.data.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

     const handleUploadReceipt = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request()
            if(response.data.error){
            updateAlert({status: "error",message: response.data.message || "Something went wrong", alive: true})
            setError(err?.response?.data?.message || "Something went wrong");   
        } else {
            updateAlert({message: response.data.message || "Uploaded successfully!", alive: true})
            }
            // addReceipts(response.data);
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
            if(response.data.error){
                updateAlert({status: "error",message: response.data.message || "Something went wrong", alive: true})
                setError(err?.response?.data?.message || "Something went wrong");
            } else {
                addExportData(response.data)
                updateAlert({message: "Export Success!", alive: true})
            }
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
             if(response.data.error){
                updateAlert({status: "error",message: response.data.message || "Something went wrong", alive: true})
                setError(err?.response?.data?.message || "Something went wrong");
            } else {
                updateAlert({message: response.data.message || "Updated successfully!", alive: true})
            }
        } catch (err: any) {
            updateAlert({status: "error", message: err?.response?.data?.message || "Something went wrong", alive: true})
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const getReceipt = (url: string, body?: any,  config?: AxiosRequestConfig) => handleGetRequest(() => apiClient.post(url,body, config))
    const uploadReceipt = (url: string, body?: any,  config?: AxiosRequestConfig) => handleUploadReceipt(() => apiClient.post(url,body, config))
    
    const exportReceipts = (url: string, body?: any, config?: AxiosRequestConfig) => handleExportRequest(() => apiClient.post(url, body, config))

    const editReceipt = (url: string, body?: any,  config?: AxiosRequestConfig) => handleEditRequest(() => apiClient.post(url,body, config))
    const del = (url: string, config?: AxiosRequestConfig) => handleRequest(() => apiClient.delete(url, config))

    return { loading, error, getReceipt, uploadReceipt, exportReceipts, editReceipt, del };
}