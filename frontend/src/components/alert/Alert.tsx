//@ts-nocheck
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import { useAlert } from "@/context/AlertContext";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { useEffect } from "react";

export function AlertComp() {
    const { alertData, updateAlert } = useAlert();

    useEffect(() => {
        if (alertData?.alive) {
            setTimeout(() => {
                updateAlert({ ...alertData, alive: false })
            }, 3000)
        }
    }, [alertData])

    return (
        <>
            {alertData?.alive ? (
                <div className="grid max-w-xl items-start gap-4 absolute top-2 right-2 z-1000">
                    <Alert className={alertData?.status === "error" ? "bg-red-500" : "bg-green-400"}>
                        <CheckCircle2Icon />
                        <AlertTitle>
                            {alertData.message}
                        </AlertTitle>
                    </Alert>
                </div>
            ) : null}
        </>

    )
}
