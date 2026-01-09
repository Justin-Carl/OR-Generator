import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AlertContextType {
    alertData: any;
    updateAlert: (data: any) => void;
}

// Create the context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Provider component
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alertData, setAlertData] = useState<any>(null);
    const updateAlert = (data: boolean) => setAlertData(data);

    return (
        <AlertContext.Provider value={{ alertData, updateAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

// Custom hook for consuming the context
export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};