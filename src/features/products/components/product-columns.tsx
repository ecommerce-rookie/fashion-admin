import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/core/table/data-table-column-header";
import LongText from "@/components/long-text";
import { Badge } from "@/components/ui/badge";
import { ProductTableRowActions } from "./product-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductPreview } from "@/services/type/product-type";
import { IconStarFilled, IconUser } from "@tabler/icons-react";

export const columns: ColumnDef<ProductPreview>[] = [
    {
        id: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-x-2">
                    <Avatar className="size-8">
                        <AvatarImage
                            alt={row.original.name}
                            src={row.original.image ?? ""}
                        />
                        <AvatarFallback>Thumbnail</AvatarFallback>
                    </Avatar>
                    <LongText className="max-w-36">{row.original.name}</LongText>
                </div>
            );
        },
        meta: { className: "w-36" },
    },
    {
        id: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-x-2">
                    {
                        row.original.unitPrice !== row.original.purchasePrice ? (
                            <>
                                <span>{row.original.purchasePrice}</span>
                                <span className="text-muted-foreground">{row.original.unitPrice}</span>
                            </>
                        ) : (
                            <span>{row.original.unitPrice}</span>
                        )
                    }

                </div>
            );
        },
    },
    {
        id: "feedback",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Feedback" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-x-2 w-full">
                    <div className="flex items-center gap-x-2">
                        <span>{row.original.star} </span>
                        <IconStarFilled size={16} />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <span>{row.original.reviewCount ?? 0}</span>
                        <IconUser size={16} />
                    </div>
                </div>
            );
        },
    },
    {
        id: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";

            switch (status.toLowerCase()) {
                case "active":
                    badgeVariant = "default";
                    break;
                case "inactive":
                    badgeVariant = "secondary";
                    break;
                case "out_of_stock":
                    badgeVariant = "destructive";
                    break;
                default:
                    badgeVariant = "outline";
            }

            return (
                <Badge variant={badgeVariant}>{status}</Badge>
            );
        },
    },
    {
        id: "tags",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tags" />
        ),
        cell: ({ row }) => {
            return (

                <div className="flex items-center gap-x-2">
                    {row.original.isNew && (
                        <Badge variant="default" className="text-xs">
                            New
                        </Badge>
                    )}
                    {row.original.categoryName && (
                        <Badge variant="outline" className="text-xs">
                            {row.original.categoryName}
                        </Badge>
                    )}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ProductTableRowActions,
    },
];