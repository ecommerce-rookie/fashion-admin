import { useParams } from "@tanstack/react-router";
import { Main } from "@/components/core/layout/main";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";

export function OrderDetail() {
    const { id } = useParams({ from: "/_authenticated/orders/$id" });
    const navigate = useNavigate();

    // Ở đây bạn có thể thêm code để lấy dữ liệu chi tiết đơn hàng theo id
    // Ví dụ: const { data: order, isLoading } = useQuery(['order', id], () => fetchOrderDetail(id));

    // Mock data - trong thực tế bạn sẽ thay thế bằng dữ liệu thật từ API
    const isLoading = false;
    const order = {
        id: id,
        orderNumber: `ORD-${id}`,
        date: "2025-04-22",
        status: "Đã giao hàng",
        customerName: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0912345678",
        address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
        paymentMethod: "COD",
        items: [
            {
                id: "1",
                name: "Áo thun nam",
                price: 250000,
                quantity: 2,
                total: 500000
            },
            {
                id: "2",
                name: "Quần jean",
                price: 450000,
                quantity: 1,
                total: 450000
            }
        ],
        subtotal: 950000,
        shippingFee: 30000,
        discount: 50000,
        total: 930000
    };

    const handleGoBack = () => {
        navigate({ to: "/orders" });
    };

    if (isLoading) {
        return (
            <Main>
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-9 w-24" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </Main>
        );
    }

    return (
        <Main>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-semibold">Chi tiết đơn hàng #{order.orderNumber}</h1>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    In đơn hàng
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin đơn hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-2">
                            <div className="grid grid-cols-2">
                                <dt className="font-medium text-gray-500">Mã đơn:</dt>
                                <dd>{order.orderNumber}</dd>
                            </div>
                            <div className="grid grid-cols-2">
                                <dt className="font-medium text-gray-500">Ngày đặt:</dt>
                                <dd>{order.date}</dd>
                            </div>
                            <div className="grid grid-cols-2">
                                <dt className="font-medium text-gray-500">Trạng thái:</dt>
                                <dd>
                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                        {order.status}
                                    </span>
                                </dd>
                            </div>
                            <div className="grid grid-cols-2">
                                <dt className="font-medium text-gray-500">Phương thức thanh toán:</dt>
                                <dd>{order.paymentMethod}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin khách hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-2">
                            <div className="grid grid-cols-2">
                                <dt className="font-medium text-gray-500">Họ tên:</dt>
                                <dd>{order.customerName}</dd>
                            </div>
                            <div className="grid grid-cols-2">
                                <dt className="font-medium text-gray-500">Email:</dt>
                                <dd>{order.email}</dd>
                            </div>
                            <div className="grid grid-cols-2">
                                <dt className="font-medium text-gray-500">Điện thoại:</dt>
                                <dd>{order.phone}</dd>
                            </div>
                            <div className="grid grid-cols-2">
                                <dt className="font-medium text-gray-500">Địa chỉ:</dt>
                                <dd>{order.address}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Chi tiết sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left pb-3">Sản phẩm</th>
                                    <th className="text-right pb-3">Đơn giá</th>
                                    <th className="text-right pb-3">Số lượng</th>
                                    <th className="text-right pb-3">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="py-3">{item.name}</td>
                                        <td className="text-right py-3">{item.price.toLocaleString('vi-VN')}đ</td>
                                        <td className="text-right py-3">{item.quantity}</td>
                                        <td className="text-right py-3">{item.total.toLocaleString('vi-VN')}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-col gap-2 items-end">
                        <div className="grid grid-cols-2 gap-x-8">
                            <span className="text-gray-500">Tạm tính:</span>
                            <span className="text-right">{order.subtotal.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8">
                            <span className="text-gray-500">Phí vận chuyển:</span>
                            <span className="text-right">{order.shippingFee.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8">
                            <span className="text-gray-500">Giảm giá:</span>
                            <span className="text-right">-{order.discount.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 font-semibold">
                            <span>Tổng cộng:</span>
                            <span className="text-right">{order.total.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Main>
    );
}