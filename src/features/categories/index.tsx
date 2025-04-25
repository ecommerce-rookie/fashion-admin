import { DataTable } from "@/components/core/table/table";
import { columns } from "./components/category-columns";
import { useCategoryFilter } from "./context/use-filter-category";
import TableProvider from "@/stores/table-context";
import { CategoryDialogs } from "./components/category-dialogs";
import { Main } from "@/components/core/layout/main";

export default function Categories() {
    const filter = useCategoryFilter({
        initSearch: "",
    });

    return (
        <TableProvider>
            <Main>
                <DataTable
                    columns={columns}
                    filter={filter}
                    subTitle="Manage your Categories here."
                    title="Category List"
                />

                <CategoryDialogs />
            </Main>
        </TableProvider>
    )
}