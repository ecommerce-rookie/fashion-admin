import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useTable } from "@/stores/table-context";

interface DataTableRowActionsProps<T> {
    row: Row<T>;
}

export function ProductTableRowActions<T>({
    row,
}: DataTableRowActionsProps<T>) {
    const { setOpen, setCurrentRow } = useTable();

    // const product = row.original as Product;

    const onView = () => {
        // navigate(`/products/${product.id}`);
    };

    const onViewInModal = () => {
        setCurrentRow(row.original);
        setOpen("view");
    };

    const onEdit = () => {
        setCurrentRow(row.original);
        setOpen("edit");
    };

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
                <DropdownMenuItem onClick={onViewInModal}>
                    <Eye className="mr-2 h-4 w-4" />
                    Quick View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
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