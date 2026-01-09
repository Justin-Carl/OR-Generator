import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";

import { useApi } from "@/hooks/use-user"

const ProtectedRoute = () => {
    const api = useApi();
    useEffect(() => {
        api.checkSession("user/check-session");
    }, []);

    if (api.loading) return (<>...Loading</>); // or spinner

    return <Outlet />;
};

export default ProtectedRoute;