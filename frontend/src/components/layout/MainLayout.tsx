import * as React from 'react';
import { SiteHeader } from './Header'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AlertComp } from "../alert/Alert"
import { AppSidebar } from "./Sidebar"

interface Props {
    children: React.ReactNode;
    title: string;
}

export default function MainLayout({
    children,
    title
}: Props) {

    return (

        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <AlertComp />
                <SiteHeader title={title} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>

        </SidebarProvider>

    );
}
