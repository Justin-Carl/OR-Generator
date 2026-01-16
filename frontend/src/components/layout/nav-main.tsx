"use client"

import { type Icon } from "@tabler/icons-react"
import { Link } from "react-router-dom"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroupLabel
} from "@/components/ui/sidebar"

const ROUTER_BASENAME = import.meta.env.VITE_ROUTER_BASENAME
export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupContent >
                <SidebarGroupLabel>Manage</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item, key) => (

                        <Link to={item.url} key={key}>
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton isActive={location.pathname === ROUTER_BASENAME + item.url} tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Link>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
