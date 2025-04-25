import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function SignoutCallback() {
    const navigate = useNavigate();
    const { processLogoutCallback } = useAuthStore((state) => state.auth);

    useEffect(() => {
        const processLogout = async () => {
            try {
                await processLogoutCallback();
                toast.success("Đăng xuất thành công!");
                navigate({ to: "/sign-in-2" });
            } catch (error) {
                console.error("Đăng xuất thất bại:", error);
                toast.error("Có lỗi xảy ra trong quá trình đăng xuất.");
                navigate({ to: "/" });
            }
        };

        processLogout();
    }, [processLogoutCallback, navigate]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Đang xử lý đăng xuất...</h2>
                <p className="mt-2 text-muted-foreground">Vui lòng đợi trong giây lát.</p>
            </div>
        </div>
    );
}