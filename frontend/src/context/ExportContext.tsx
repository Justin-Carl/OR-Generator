import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ExportContextType {
    exportData: any;
    addExportData: (data: any) => void;

    openExport: boolean;
    updateOpenExport: (data: boolean) => void;

    exportType: string;
    updateExportType: (data: string) => void;

    clear: () => void;
}

// Create the context
const ExportContext = createContext<ExportContextType | undefined>(undefined);

// Provider component
export const ExportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [openExport, setOpenExport] = useState(false);
    const [exportType, setExportType] = useState("");
    const [exportData, setExportData] = useState<any>(null);

    const updateOpenExport = (data: boolean) => setOpenExport(data);
    const updateExportType = (data: string) => setExportType(data);
    const addExportData = (data: any) => { console.log("=====", data); setExportData(data) };

    const clear = () => setOpenExport(false);

    return (
        <ExportContext.Provider value={{ openExport, updateOpenExport, exportType, updateExportType, exportData, addExportData, clear }}>
            {children}
        </ExportContext.Provider>
    );
};

// Custom hook for consuming the context
export const useExport = (): ExportContextType => {
    const context = useContext(ExportContext);
    if (!context) {
        throw new Error("useExport must be used within a ExportProvider");
    }
    return context;
};