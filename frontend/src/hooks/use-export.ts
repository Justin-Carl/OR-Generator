//@ts-nocheck

import axios from "axios";
import type {AxiosRequestConfig } from "axios";
import { useState } from "react";
import { useAlert } from "@/context/AlertContext";
import {getDeviceInfo} from "@/lib/utils";
import { useExport } from "@/context/ExportContext";

interface UseApiReturn<T>{
    loading: boolean;
    error: string | null;
    exportRequest: (url: string, body?: any,  config?: AxiosRequestConfig) => Promise<void>;
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
    const {addExportData} = useExport();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {updateAlert} = useAlert();



    const handleRequestExport = async (request: () => Promise<any>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request();
            console.log(response)
            addExportData(response.data)
            updateAlert({message: "Export Success!", alive: true})
        } catch (err: any) {
            updateAlert({status: "error", message: err?.response?.data?.message || "Something went wrong", alive: true})
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }



    const exportRequest = (url: string, body?: any,  config?: AxiosRequestConfig) => handleRequestExport(() => apiClient.post(url,body, config))
   

    return { loading, error, exportRequest };
}