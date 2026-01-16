//@ts-nocheck
import type { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"

import moment from 'moment'

import { EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { formatMoney } from "@/lib/utils"

export type CategoriesType = {
    id: number,
    description: string,
    title: string,
}

export const columns: ColumnDef<ReceiptType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </Button>
            )
        },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        header: "Actions",
        cell: ({ row, onExport, onEdit, onView }: any) => {
            const data = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <EllipsisVertical />
                            {/* <MoreHorizontal className="h-4 w-4" /> */}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">

                        {onEdit ? (
                            <DropdownMenuItem onClick={() => onEdit?.(data)}>Edit</DropdownMenuItem>
                        ) : null}
                        {onView ? (
                            <DropdownMenuItem onClick={() => onView?.(data)}>View</DropdownMenuItem>
                        ) : null}
                        {onExport ? (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onExport?.(data)}
                                >
                                    Export
                                </DropdownMenuItem>
                            </>
                        ) : null}

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]