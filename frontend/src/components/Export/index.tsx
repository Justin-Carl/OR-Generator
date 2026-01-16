import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import moment from "moment"
import { useExport } from "@/context/ExportContext"
import { useApi } from "@/hooks/use-export"

type DateRange = { from: Date; to: Date } | undefined
const Export = () => {
    const api = useApi();

    const { exportData, openExport, updateOpenExport, exportType } = useExport();

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [dateRange, setDateRange] = useState<DateRange>({ from: new Date(), to: new Date() })

    const handleDateSelect = (range: any) => {
        setDateRange(range)
    }

    const handleClose = () => {
        updateOpenExport(false)
    }

    const handleInputClick = () => {
    }

    const handleExport = async () => {
        const body = {
            ...dateRange,
            type: exportType
        }
        await api.exportRequest("export/", body, { responseType: 'blob' });
    }

    useEffect(() => {
        const val = moment(dateRange?.from).format("MMMM DD, YYYY") + " - " + moment(dateRange?.to).format("MMMM DD, YYYY")
        setValue(val)
    }, [dateRange])

    useEffect(() => {
        if (exportData) {
            console.log(exportData)
            const blob = new Blob([exportData], { type: "text/csv;charset=utf-8" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = exportType + '.csv';
            document.body.appendChild(a); // sometimes needed
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    }, [exportData]);

    return (
        <Dialog open={openExport} onOpenChange={handleClose} >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col w-full gap-3">
                        <Label htmlFor="date" className="px-1">
                            Date Range
                        </Label>
                        <div className="relative flex gap-2">
                            <Input
                                id="date"
                                value={value}
                                // placeholder="June 01, 2025"
                                className="bg-background pr-10 w-full"
                                readOnly
                                onClick={handleInputClick}
                            />
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date-picker"
                                        variant="ghost"
                                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                    >
                                        <CalendarIcon className="size-3.5" />
                                        <span className="sr-only">Select date</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="end"
                                    alignOffset={-8}
                                    sideOffset={10}
                                >
                                    <Calendar
                                        mode="range"
                                        captionLayout="dropdown"
                                        selected={dateRange}
                                        onSelect={(range) => handleDateSelect(range)} // ✅ wrap in a function

                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleClose} variant="outline">Cancel</Button>
                    <Button onClick={handleExport} type="submit">Export</Button>

                </DialogFooter>
                {/* <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}

export default Export;
