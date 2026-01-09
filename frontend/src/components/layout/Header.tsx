//@ts-nocheck
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from "@/hooks/use-user"
import { useUser } from "@/context/UserContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

interface Props {
    title: string
}
export function SiteHeader({ title }: Props) {
    const api = useApi();
    const { token } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.login("user/logout");
    }

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token])
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{title}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button onClick={handleLogout} size="sm" className="hidden sm:flex">
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}
