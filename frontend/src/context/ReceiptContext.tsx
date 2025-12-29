import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ReceiptImageData, ReceiptData } from "@/types/receipt";

interface ReceiptContextType {
    receipts: ReceiptData;
    addReceipts: (data: ReceiptData) => void;

    receiptImages: ReceiptImageData[];
    addReceiptImages: (data: ReceiptImageData[]) => void;

    exportData: any;
    addExportData: (data: any) => void;

    alertData: any;
    updateAlert: (data: any) => void;

    clearReceipts: () => void;
}

// Create the context
const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

// Provider component
export const ReceiptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [receipts, setReceipts] = useState<ReceiptData>({ list: [] });
    const [receiptImages, setReceiptImages] = useState<ReceiptImageData[]>([]);

    const [exportData, setExportData] = useState<any>(null);


    const addReceipts = (data: ReceiptData) => setReceipts(data);
    const addReceiptImages = (data: ReceiptImageData[]) => setReceiptImages(data);

    const addExportData = (data: any) => setExportData(data);


    const clearReceipts = () => setReceipts({ list: [] });

    const [alertData, setAlertData] = useState<any>(null);
    const updateAlert = (data: boolean) => setAlertData(data);
    return (
        <ReceiptContext.Provider value={{ alertData, updateAlert, receipts, receiptImages, addReceiptImages, addReceipts, exportData, addExportData, clearReceipts }}>
            {children}
        </ReceiptContext.Provider>
    );
};

// Custom hook for consuming the context
export const useReceipt = (): ReceiptContextType => {
    const context = useContext(ReceiptContext);
    if (!context) {
        throw new Error("useReceipt must be used within a ReceiptProvider");
    }
    return context;
};