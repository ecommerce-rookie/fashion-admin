/* eslint-disable no-console */
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function SigninCallback() {
    const navigate = useNavigate();
    const { processLoginCallback } = useAuthStore((state) => state.auth);

    useEffect(() => {
        const processLogin = async () => {
            try {
                await processLoginCallback();
                toast.success("Login successful!");
                navigate({ to: "/" });
            } catch (error) {
                console.error("Login fail!", error);
                toast.error("Login failed! Please try again.");
                navigate({ to: "/sign-in" });
            }
        };

        processLogin();
    }, [processLoginCallback, navigate]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Login Processing...</h2>
                <p className="mt-2 text-muted-foreground">Please wait.</p>
            </div>
        </div>
    );
}