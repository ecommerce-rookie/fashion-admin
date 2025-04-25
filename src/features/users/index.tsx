import { Main } from '@/components/core/layout/main'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { DataTable } from '@/components/core/table/table'
import TableProvider from '@/stores/table-context';
import { useAccountFilter } from './context/use-filter-account';


export default function Users() {
  const filter = useAccountFilter({
    initSearch: "",
    initStatus: [],
    initRole: [],
  });

  return (
    <Main>
      <TableProvider>

        <DataTable
          columns={columns}
          filter={filter}
          subTitle="Manage your Users here."
          title="User List"
        />


        <UsersDialogs />
      </TableProvider>
    </Main>
  )
}
