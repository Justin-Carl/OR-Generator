//@ts-nocheck
import * as React from "react"
import {
    ReceiptText,
    ClipboardList
} from "lucide-react"

import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Categories",
            url: "/categories",
            icon: ClipboardList,
        },
        {
            title: "Receipt",
            url: "/receipts",
            icon: ReceiptText,
        },
    ],
    // projects: [
    //     {
    //         name: "Design Engineering",
    //         url: "#",
    //         icon: Frame,
    //     },
    //     {
    //         name: "Sales & Marketing",
    //         url: "#",
    //         icon: PieChart,
    //     },
    //     {
    //         name: "Travel",
    //         url: "#",
    //         icon: Map,
    //     },
    // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <ReceiptText className="!size-5" />
                                <span className="text-base font-semibold">OR Reader</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}


