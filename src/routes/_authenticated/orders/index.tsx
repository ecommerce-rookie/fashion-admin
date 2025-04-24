import { Orders } from "@/features/orders";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_authenticated/orders/')({
  component: Orders,
})