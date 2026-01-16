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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import moment from 'moment'
import { ChevronDownIcon } from "lucide-react"

import { formatMoney } from "@/lib/utils"

const _CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
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

        let n = {
            [target.id]: target.value
        }

        if (target.id === "total_amount" || target.id === "vatable_sales" || target.id === "vat_amount" || target.id === "vat_exempt_sales") {
            let format_number = target.value.replace(/[^0-9.]/g, "");
            // Optional: prevent multiple dots
            const parts = target.value.split(".");
            if (parts.length > 2) {
                format_number = parts[0] + "." + parts[1];
            }
            n = {
                [target.id]: format_number
            }

        }
        setMyData((prev) => {
            return { ...prev, ...n }
        })
    }

    const handleEdit = async () => {
        const res = await api.editReceipt("receipt/edit", myData);
    }

    const [openCalendar, setOpenCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

    const onDateChange = (date) => {
        setOpenCalendar(false)
        setSelectedDate(date)
        const f_date = moment(date).format('MM/DD/YYYY')
        setMyData((prev) => {
            return { ...prev, date: f_date }
        })
    }

    const handleViewImage = (image_name) => {
        const imageUrl = _CLIENT_URL + "or-reader-media/image/" + image_name;
        window.open(imageUrl, "_blank");
    }

    useEffect(() => {
        if (!api.error && !api.loading) {
            onChange()
        }
    }, [api.error, api.loading])
    useEffect(() => { setOpen(open) }, [open])
    useEffect(() => {
        if (data) {
            data.total_amount = formatMoney(data.total_amount)
            console.log(data)
            setMyData(data)
        }
    }, [data])
    useEffect(() => { if (myData?.date) setSelectedDate(myData?.date) }, [myData?.date])
    useEffect(() => { if (type.toLowerCase() === 'edit') { setIsView(false) } else { setIsView(true) }; }, [type])
    return (
        <Dialog open={isOpen} onOpenChange={handleChange} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl">{type} Receipt</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
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
                                Address
                            </Label>
                            <Input
                                id="address"
                                type="text"
                                name="address"
                                value={myData?.address}
                                onChange={handleDataChange}
                                readOnly={isView}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="expense_insights_category">
                                Category
                            </Label>
                            <Input
                                id="expense_insights_category"
                                type="text"
                                name="expense_insights_category"
                                value={myData?.expense_insights_category}
                                onChange={handleDataChange}
                                readOnly={isView}
                            />
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="vat_exempt_sales">
                            VAT Exempt Sales
                        </Label>
                        <Input
                            id="vat_exempt_sales"
                            type="text"
                            name="vat_exempt_sales"
                            value={isView ? formatMoney(myData?.vat_exempt_sales) : myData?.vat_exempt_sales}
                            onChange={handleDataChange}
                            readOnly={isView}
                        />
                    </div>
                </div> */}



                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-full justify-between font-normal"
                                    >
                                        {myData?.date ? moment(myData?.date).format('MMMM DD, YYYY') : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        month={selectedDate}
                                        captionLayout="dropdown"
                                        onSelect={(date) => onDateChange(date)}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="vat_reg_tin">VAT Reg. TIN</Label>
                            <Input
                                id="vat_reg_tin"
                                type="text"
                                name="vat_reg_tin"
                                value={myData?.vat_reg_tin}
                                onChange={handleDataChange}
                                readOnly={isView}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="vatable_sales">VATable Sales</Label>
                            <Input
                                id="vatable_sales"
                                type="text"
                                name="vatable_sales"
                                value={isView ? formatMoney(myData?.vatable_sales) : myData?.vatable_sales}
                                onChange={handleDataChange}
                                readOnly={isView}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="vat_exempt_sales">
                                VAT Exempt Sales
                            </Label>
                            <Input
                                id="vat_exempt_sales"
                                type="text"
                                name="vat_exempt_sales"
                                value={isView ? formatMoney(myData?.vat_exempt_sales) : myData?.vat_exempt_sales}
                                onChange={handleDataChange}
                                readOnly={isView}
                            />
                        </div>


                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="vat_exempt_sales">
                                VAT Amount
                            </Label>
                            <Input
                                id="vat_amount"
                                type="text"
                                name="vat_amount"
                                value={isView ? formatMoney(myData?.vat_amount) : myData?.vat_amount}
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
                                value={isView ? formatMoney(myData?.total_amount) : myData?.total_amount}
                                onChange={handleDataChange}
                                readOnly={isView}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="vat_compliance_notes">
                                VAT Compliance Notes
                            </Label>
                            <Textarea placeholder="Type your message here." id="vat_compliance_notes"
                                name="vat_compliance_notes"
                                value={myData?.vat_compliance_notes}
                                readOnly={isView}
                                onChange={handleDataChange} />
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

                    <div className="flex items-center gap-2">
                        <div className="relative max-h-[200px] overflow-hidden rounded-[0.625rem] group">
                            {/* Overlay */}
                            <div className="overlay absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button onClick={() => handleViewImage(myData.imageName)} variant="outline">Full View</Button>

                            </div>
                            <img src={`${_CLIENT_URL}or-reader-media/image/${myData.imageName}`} alt="" />
                        </div>
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

