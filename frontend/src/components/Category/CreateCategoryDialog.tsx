import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

import { categoryData } from "@/types/category"

import type { CategoryDialogProps } from "@/types/category"
import { useEffect, useState } from "react"

import { useApi } from "@/hooks/use-category"

const CategoryDialog = ({ open, data, type, onChange }: CategoryDialogProps) => {
    const api = useApi();

    const [isOpen, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [myData, setData] = useState(categoryData);

    useEffect(() => {
        setData(data)
    }, [type])

    const handleDataChange = (e: any) => {
        const target = e.target;
        let d = {
            [target.id]: target.value
        }

        console.log(d)

        setData((prev) => {
            return {
                ...prev,
                ...d
            }
        })
    }

    const handleChange = () => {
        onChange()
    }

    const handleSubmit = async () => {
        let t = "create";
        if (type === "Edit") {
            t = "edit"
        }

        await api.createCategory("category/" + t, myData);
        setIsUploading(false)
        onChange()
    }

    useEffect(() => { setOpen(open) }, [open])
    return (
        <Dialog open={isOpen} onOpenChange={handleChange} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type} Category</DialogTitle>
                    {/* <DialogDescription>
                        Please upload your receipt. Make sure the image is well-lit, in focus, and fully shows all text. This helps us extract the information accurately.
                    </DialogDescription> */}
                </DialogHeader>
                <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-end">
                        <div className="flex flex-row gap-2">
                            <Checkbox
                                id="status"
                                name="status"
                                checked={myData.status}
                                onCheckedChange={(checked) => setData((prev) => { return { ...prev, status: checked === true } })}
                                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                disabled={type == "View"}
                            />
                            <Label htmlFor="terms">Active</Label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            name="title"
                            value={myData.title}
                            onChange={handleDataChange}
                            readOnly={type == "View"}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">
                            Description
                        </Label>
                        <Textarea
                            placeholder="Type your description here."
                            id="description"
                            name="description"
                            value={myData.description}
                            onChange={handleDataChange}
                            readOnly={type == "View"}
                        />
                    </div>


                </div>
                {type === "View" ? null : (
                    <DialogFooter className="sm:justify-end">
                        <Button onClick={handleChange} variant="outline">Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isUploading} type="submit">Submit</Button>
                    </DialogFooter>
                )}

            </DialogContent>
        </Dialog>
    );

}

export default CategoryDialog;

