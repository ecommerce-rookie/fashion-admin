import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useTable } from "@/stores/table-context";
import { useNavigate } from "@tanstack/react-router";
import { ProductPreview } from "@/services/type/product-type";

interface DataTableRowActionsProps {
    row: Row<ProductPreview>;
}

export function ProductTableRowActions({
    row,
}: DataTableRowActionsProps) {
    const navigate = useNavigate()
    const { setOpen, setCurrentRow } = useTable();

    const onView = () => {
        navigate({ to: "/products/$id", params: { id: row.original.slug } });
    }

    const onDelete = () => {
        setCurrentRow(row.original);
        setOpen("delete");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}