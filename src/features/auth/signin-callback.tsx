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
                toast.success("Đăng nhập thành công!");
                navigate({ to: "/" });
            } catch (error) {
                console.error("Đăng nhập thất bại:", error);
                toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
                navigate({ to: "/sign-in-2" });
            }
        };

        processLogin();
    }, [processLoginCallback, navigate]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Đang xử lý đăng nhập...</h2>
                <p className="mt-2 text-muted-foreground">Vui lòng đợi trong giây lát.</p>
            </div>
        </div>
    );
}