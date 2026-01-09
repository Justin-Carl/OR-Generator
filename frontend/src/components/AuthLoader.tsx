import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom";

import { useApi } from "@/hooks/use-user"
import { useUser } from "@/context/UserContext"

const ProtectedRoute = () => {
    const api = useApi();
    useEffect(() => {
        api.checkSession("user/check-session");
    }, []);

    if (api.loading) return (<>...Loading</>); // or spinner

    return <Outlet />;
};

export default ProtectedRoute;