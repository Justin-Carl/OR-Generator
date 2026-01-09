//@ts-nocheck
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { UploadProps, ReceiptFileData } from "@/components/receipt.ts"
import { useEffect, useState } from "react"

import { useApi } from "@/hooks/use-receipt"

const UploadReceipt = ({ open, onChange }: UploadProps) => {
    const api = useApi();

    const [isOpen, setOpen] = useState(false);
    const [file, setFile] = useState<File[] | null>(null);
    const [isUploading, setIsUploading] = useState(false);


    const handleChange = () => {
        onChange()
    }

    const handleFileChange = (e: any) => {
        const files = e.target.files
        if (!files) return

        setFile(files)
    }

    const handleUpload = async () => {
        if (!file || file.length === 0) return;
        setIsUploading(true)
        const fd = new FormData();
        fd.append("file", file[0]);

        const res = await api.uploadReceipt("receipt/upload", fd);
        setIsUploading(false)
    }

    useEffect(() => { setOpen(open) }, [open])
    return (
        <Dialog open={isOpen} onOpenChange={handleChange} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Receipt</DialogTitle>
                    <DialogDescription>
                        Please upload your receipt. Make sure the image is well-lit, in focus, and fully shows all text. This helps us extract the information accurately.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="file" className="sr-only">
                            Image
                        </Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleChange} variant="outline">Cancel</Button>
                    <Button onClick={handleUpload} disabled={isUploading} type="submit">Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

}

export default UploadReceipt;

