import { DataTable } from "@/components/core/table/table";
import { columns } from "./components/product-columns";
import TableProvider from "@/stores/table-context";
import { ProductDialogs } from "./components/product-dialogs";
import { Main } from "@/components/core/layout/main";
import { useProductFilter } from "./context/use-filter-product";
import { ProductExtraButton } from "./components/product-extra-button";
import { Button } from "@/components/ui/button";

export default function Products() {

    const filter = useProductFilter({
        initSearch: "",
    });

    return (
        <TableProvider>
            <Main>
                <DataTable
                    columns={columns}
                    filter={filter}
                    extraButton={
                        <ProductExtraButton />
                    }
                    subTitle="Manage your product inventory."
                    title="Products List"
                />
                <ProductDialogs />
            </Main>
        </TableProvider>
    )
}