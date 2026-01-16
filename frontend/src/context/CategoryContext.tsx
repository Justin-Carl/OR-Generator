import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { categoryList, type CategoryData } from "@/types/category";

interface CategoryContextType {
    categories: CategoryData[];
    addCategories: (data: CategoryData[]) => void;

    exportData: any;
    addExportData: (data: any) => void;

    alertData: any;
    updateAlert: (data: any) => void;

    clear: () => void;
}

// Create the context
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Provider component
export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState(categoryList);

    const [exportData, setExportData] = useState<any>(null);


    const addCategories = (data: CategoryData[]) => setCategories(data);

    const addExportData = (data: any) => setExportData(data);


    const clear = () => setCategories([]);

    const [alertData, setAlertData] = useState<any>(null);
    const updateAlert = (data: boolean) => setAlertData(data);
    return (
        <CategoryContext.Provider value={{ alertData, updateAlert, categories, addCategories, exportData, addExportData, clear }}>
            {children}
        </CategoryContext.Provider>
    );
};

// Custom hook for consuming the context
export const useCategory = (): CategoryContextType => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory must be used within a CategoryProvider");
    }
    return context;
};