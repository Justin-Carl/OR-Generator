//@ts-nocheck

import { columns } from "@/components/columns/columns.tsx"
import type { ReceiptType } from "@/components/columns/columns.tsx"

import { DataTable } from "@/components/data-table/DataTable.tsx"
import { useEffect, useState } from "react"

import {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
} from "@/components/ui/button-group"

import {
    Button
} from "@/components/ui/button"
import { receiptArgumentsData } from "@/types/receipt"

import UploadReceipt from "./UploadReceiptDialog"
import ReceiptDialog from "./ReceiptDialog"
import { useApi } from "@/hooks/use-receipt"
import { useReceipt } from "@/context/ReceiptContext"
import { useUser } from "@/context/UserContext"

const Receipt = () => {
    const api = useApi();
    const { token } = useUser();

    const { receipts, exportData } = useReceipt();
    const [data, setData] = useState<ReceiptType[]>([])
    const [isOpen, setOpen] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("view");
    const [dialogData, setDialogData] = useState(receiptArgumentsData);

    const handleChange = () => {
        getReceipts();
        setOpen(false)
    }
    const handleDialogChange = () => {
        getReceipts();
        setDialogOpen(false)
    }
    const handelDialog = () => {
        setOpen(true)
    }

    const getReceipts = async () => {
        await api.getReceipt("receipt/", { sort: [["id", "DESC"]] });
    }

    useEffect(() => {
        if (token) {
            getReceipts();
        }

    }, [token]);

    const handleExport = async (data: any) => {
        const body = {
            filter: [{ column: "id", value: [data.id] }]
        }
        const res = await api.exportReceipts("receipt/export", body, { responseType: 'blob' });
    }

    const handleEdit = async (data: any) => {
        setDialogOpen(true)
        setDialogType("Edit")
        setDialogData(data)
    }


    const handleView = async (data: any) => {
        setDialogOpen(true)
        setDialogType("View")
        setDialogData(data)
    }

    const handleData = () => {
        let new_data: ReceiptType[] = []
        receipts.list.forEach(x => {
            if (typeof x.arguments !== "object") {
                x.arguments = JSON.parse(x.arguments);
                const z = x.arguments
                new_data.push({
                    id: x.id,
                    imageName: x.imageName,
                    ...z
                })
            }

        });

        setData(new_data)
    }

    useEffect(() => {
        if (receipts?.list.length > 0) {
            handleData()
        }
    }, [receipts]);

    useEffect(() => {
        if (exportData) {

            const url = window.URL.createObjectURL(new Blob([exportData]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv'; // filename
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }, [exportData]);

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-5">
                <ButtonGroup>
                    {/* <Button variant="outline" size="lg" >Export</Button>
                    <ButtonGroupSeparator /> */}
                    <Button onClick={handelDialog} variant="outline" size="lg" >Upload Receipt</Button>
                </ButtonGroup>
                <DataTable columns={columns} data={data} onView={handleView} onEdit={handleEdit} onExport={handleExport} />
            </div>
            <UploadReceipt open={isOpen} onChange={handleChange} />
            <ReceiptDialog open={isDialogOpen} type={dialogType} data={dialogData} onChange={handleDialogChange} />

        </div>
    )
}

export default Receipt;

