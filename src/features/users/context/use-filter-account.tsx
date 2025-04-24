import { DataFacedFilter, FilterTable } from "@/components/core/table/filter-table";
import { useDebounceValue } from "@/hooks/use-debounce-value";
import { usePagination } from "@/hooks/use-pagination";
import { useUsersQuery } from "@/services/query/user-query";
import { User, UserRole, UserStatus } from "@/services/type/user-type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface AccountFilterProps {
  initSearch: string;
  initStatus?: UserStatus[];
  initRole?: UserRole[];
}

export interface AccountFilter extends FilterTable<User> {
  status?: UserStatus[] | undefined;
  setStatus?: Dispatch<SetStateAction<UserStatus[] | undefined>>;
}

export function useAccountFilter({
  initSearch,
  initStatus,
  initRole,
}: AccountFilterProps): AccountFilter {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const [search, setSearch] = useState(initSearch);
  const [status, setStatus] = useState<UserStatus[] | undefined>(initStatus);
  const debounceSearch = useDebounceValue(search, 300);

  const { data, isLoading } = useUsersQuery({
    page: pagination.page,
    eachPage: pagination.pageSize,
    roleName: initRole,
    status: status,
    search: debounceSearch,
  });

  useEffect(() => {
    if (!isLoading) {
      pagination.setPageCount(data?.totalPages ?? 1);
    }
  }, [data, isLoading, pagination]);

  const facedList: DataFacedFilter[] = [
    {
      name: "status",
      list: [
        { label: "Active", value: "Active" },
        { label: "Pending", value: "Pending" },
        { label: "Deleted", value: "Deleted" },
        { label: "Blocked", value: "Blocked" },
      ],
      setSelect: (value: string[]) => setStatus?.(value as UserStatus[]),
    },
  ];

  return {
    data: Array.isArray(data?.data) ? data.data : [],
    placeholder: "Filter user",
    pagination,
    isLoading,
    search,
    status,
    setSearch,
    setStatus,
    facedFilter: facedList,
  };
}
