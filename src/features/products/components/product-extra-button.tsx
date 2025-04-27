import { Button } from "@/components/ui/button";
import { useTable } from "@/stores/table-context";

export function ProductExtraButton() {
    
    const { setOpen } = useTable();

    return (
        <Button onClick={() => setOpen('add')}>
            Add
        </Button>
    )
}