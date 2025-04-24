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
    <TableProvider>
      <Main>
        {/* <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div> */}
        <DataTable
          columns={columns}
          filter={filter}
          subTitle="Manage your Users here."
          title="User List"
        />
      </Main>

      <UsersDialogs />
    </TableProvider>
  )
}
