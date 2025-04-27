import ProductDetail from "@/features/products/product-detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_authenticated/products/$id')({
    component: ProductDetail,
})