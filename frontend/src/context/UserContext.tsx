import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface UserContextType {
    token: string | null;
    addToken: (data: string | null) => void;

    alertData: any;
    updateAlert: (data: any) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

    const addToken = (data: string | null) => setToken(data);


    const [alertData, setAlertData] = useState<any>(null);
    const updateAlert = (data: boolean) => setAlertData(data);

    return (
        <UserContext.Provider value={{ alertData, updateAlert, token, addToken }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for consuming the context
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};