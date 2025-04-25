import { DataTable } from "@/components/core/table/table";
import TableProvider from "@/stores/table-context";
import { columns } from "./components/order-columns";
import { useOrderFilter } from "./context/use-filter-order";
import { Main } from "@/components/core/layout/main";
import { OrderDialogs } from "./components/order-dialogs";

export function Orders() {
    const filter = useOrderFilter({
        initSearch: ""
    });

    return (

        <TableProvider>
            <Main>
                <DataTable
                    columns={columns}
                    filter={filter}
                    subTitle="Manage your Orders here."
                    title="Order List"
                />
                <OrderDialogs />
            </Main>
        </TableProvider>
    );
}