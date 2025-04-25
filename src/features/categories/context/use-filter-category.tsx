import { useDebounceValue } from "@/hooks/use-debounce-value";
import { usePagination } from "@/hooks/use-pagination";
import { useCategoriesQuery } from "@/services/query/category-query";
import { useEffect, useState } from "react";

interface CateoryFilterProps {
  initSearch: string;
}

export function useCategoryFilter({
  initSearch,
}: CateoryFilterProps) {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const [search, setSearch] = useState(initSearch);
  const debounceSearch = useDebounceValue(search, 300);

  const { data, isLoading } = useCategoriesQuery({
    page: pagination.page,
    eachPage: pagination.pageSize,
    search: debounceSearch,
  });

  useEffect(() => {
    if (!isLoading) {
      pagination.setPageCount(data?.totalPages ?? 1);
    }
  }, [data, isLoading, pagination]);

  return {
    data: Array.isArray(data?.data) ? data.data : [],
    placeholder: "Filter Categories",
    pagination,
    isLoading,
    search,
    setSearch,
  };
}
