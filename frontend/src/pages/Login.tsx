import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { ReceiptText } from "lucide-react"
import { useEffect, useState } from "react"
import { useApi } from "@/hooks/use-user"
import { useUser } from "@/context/UserContext"
import { useNavigate } from "react-router-dom";
import { AlertComp } from "@/components/alert/Alert"

export default function Login() {
    const api = useApi();
    const { token } = useUser();
    const navigate = useNavigate();

    const [data, setData] = useState({ email: "", password: "" })

    const handleSignIn = async () => {
        await api.login("user/login", data);
    }
    useEffect(() => {
        if (token) {
            navigate("/receipts", { replace: true });
        }
    }, [token, navigate])

    const handleDataChange = (e: any) => {
        const target = e.target

        let n = {
            [target.id]: target.value
        }


        setData((prev) => {
            return { ...prev, ...n }
        })
    }
    return (
        <div className="flex flex-col items-center gap-5 py-10">
            <AlertComp />
            <div className="flex flex-col items-center gap-5 w-full max-w-sm">
                <ReceiptText size={"50"} />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Sign in to OR Reader
                </h3>
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="text"
                    name="email"
                    value={data?.email}
                    onChange={handleDataChange} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password"
                    value={data?.password}
                    onChange={handleDataChange} />
            </div>
            <div className="w-full max-w-sm">
                <Button className="w-full" onClick={handleSignIn}>Sign In</Button>
            </div>
        </div>
    )
}

