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

import moment from 'moment'

import { EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { formatMoney } from "@/lib/utils"

export type ReceiptType = {
    id: number,
    company_name: string,
    status: "AI" | "Updated",
    total_amount: string,
    receipt_date: string
}

export const columns: ColumnDef<ReceiptType>[] = [
    {
        accessorKey: "company_name",
        header: "Company Name",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }: any) => {
            const data = row.original;

            return moment(data.date).format('MMMM DD, YYYY');
        }
    },
    {
        accessorKey: "total_amount",
        header: "Total Amount",
        cell: ({ row }) => {
            const data = row.original

            return formatMoney(data.total_amount);
        }
    },
    // {
    //     accessorKey: "status",
    //     header: "Status",
    // },
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
                        <DropdownMenuItem onClick={() => onEdit?.(data)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView?.(data)}>View</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onExport?.(data)}
                        >
                            Export
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]