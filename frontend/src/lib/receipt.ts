import {api } from "./api";
import type { ReceiptImageData } from "@/types/receipt";

export const extractReceiptData = async (file: File): Promise<ReceiptImageData> => {
    const formData = new FormData();

    formData.append("file", file);

    const reponse = await api.post("/receipt/upload", formData, {
         headers: { "Content-Type": "multipart/form-data" },
    })

    return reponse.data;
}