//@ts-nocheck
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { ReceiptArgumentsDataOutputProps, ReceiptEditProps } from "@/types/receipt"
import { receiptArgumentsData } from "@/types/receipt"

import { useEffect, useState } from "react"

import { useApi } from "@/hooks/use-receipt"

const ReceiptDialog = ({ open, data, type, onChange }: ReceiptEditProps) => {
    const api = useApi();
    const { loading, error } = api

    const [isOpen, setOpen] = useState(false);
    const [isView, setIsView] = useState(false);

    const [myData, setMyData] = useState<ReceiptArgumentsDataOutputProps>(receiptArgumentsData);

    const handleChange = () => {
        onChange()
    }

    const handleDataChange = (e: any) => {
        const target = e.target
        setMyData((prev) => {
            console.log(prev)
            return { ...prev, [target.id]: target.value }
        })
    }

    const handleEdit = async () => {
        console.log(myData)
        const res = await api.editReceipt("receipt/", myData);
        console.log(res)
    }

    useEffect(() => { setOpen(open) }, [open])
    useEffect(() => { setMyData(data) }, [data])
    useEffect(() => { if (type.toLowerCase() === 'edit') { setIsView(false) } else { setIsView(true) }; }, [type])
    return (
        <Dialog open={isOpen} onOpenChange={handleChange} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl">{type} Receipt</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="company_name">
                            Company Name
                        </Label>
                        <Input
                            id="company_name"
                            type="text"
                            name="company_name"
                            value={myData?.company_name}
                            onChange={handleDataChange}
                            readOnly={isView}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="vat_exempt_sales">
                            VAT Exempt Sales
                        </Label>
                        <Input
                            id="vat_exempt_sales"
                            type="text"
                            name="vat_exempt_sales"
                            value={myData?.vat_exempt_sales}
                            onChange={handleDataChange}
                            readOnly={isView}
                        />
                    </div>
                </div>
                {/* <div className="grid grid-flow-col grid-rows-3 gap-4">
                    <div className="row-span-3 ...">01</div>
                    <div className="col-span-2 ...">02</div>
                    <div className="col-span-2 row-span-2 ...">03</div>
                </div> */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="text"
                            name="date"
                            value={myData?.date}
                            onChange={handleDataChange}
                            readOnly={isView}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="total_amount">Total Amount</Label>
                        <Input
                            id="total_amount"
                            type="text"
                            name="total_amount"
                            value={myData?.total_amount}
                            onChange={handleDataChange}
                            readOnly={isView}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="description">
                            Description
                        </Label>
                        <Textarea placeholder="Type your message here." id="description"
                            name="description"
                            value={myData?.description}
                            readOnly={isView}
                            onChange={handleDataChange} />


                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleChange} variant="outline">Cancel</Button>
                    {isView ? null : (<Button disabled={loading} onClick={handleEdit} type="submit">Save</Button>)}

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

}

export default ReceiptDialog;

