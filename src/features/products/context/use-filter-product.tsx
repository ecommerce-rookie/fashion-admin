import { useDebounceValue } from "@/hooks/use-debounce-value";
import { usePagination } from "@/hooks/use-pagination";
import { useProductsQuery } from "@/services/query/product-query";
import { useEffect, useState } from "react";

interface ProductFilterProps {
  initSearch: string;
}

export function useProductFilter({
  initSearch
}: ProductFilterProps) {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const [search, setSearch] = useState(initSearch);
  const debounceSearch = useDebounceValue(search, 300);

  const { data, isLoading } = useProductsQuery({
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
    placeholder: "Filter Product",
    pagination,
    isLoading,
    search,
    setSearch,
  };
}
