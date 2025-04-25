import { DataFacedFilter, FilterTable } from "@/components/core/table/filter-table";
import { useDebounceValue } from "@/hooks/use-debounce-value";
import { usePagination } from "@/hooks/use-pagination";
import { useOrdersQuery } from "@/services/query/order-query";
import { Order, OrderStatus, PaymentMethod } from "@/services/type/order-type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface OrderFilterProps {
  initSearch: string;
}

export interface OrderFilter extends FilterTable<Order> {
  status?: OrderStatus[] | undefined;
  setStatus?: Dispatch<SetStateAction<OrderStatus[] | undefined>>;
  paymentMethod?: PaymentMethod[] | undefined;
  setPaymentMethod?: Dispatch<SetStateAction<PaymentMethod[] | undefined>>;
}

export function useOrderFilter({
  initSearch,
}: OrderFilterProps) {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const [search, setSearch] = useState(initSearch);
  const debounceSearch = useDebounceValue(search, 300);
  const [status, setStatus] = useState<OrderStatus[] | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[] | undefined>(undefined);

  const { data, isLoading } = useOrdersQuery({
    page: pagination.page,
    eachPage: pagination.pageSize,
    search: debounceSearch,
    orderStatuss: status,
    paymentMethods: paymentMethod
  });

  useEffect(() => {
    if (!isLoading) {
      pagination.setPageCount(data?.totalPages ?? 1);
    }
  }, [data, isLoading, pagination]);

  const facedFilter: DataFacedFilter[] = [
    {
      name: "status",
      list: Object.values(OrderStatus).map((status) => {
        return { label: status, value: status };
      }),
      setSelect: (value: string[]) => setStatus?.(value as OrderStatus[]),
    },
    {
      name: "method",
      list: Object.values(PaymentMethod).map((method) => {
        return { label: method, value: method };
      }),
      setSelect: (value: string[]) => setPaymentMethod?.(value as PaymentMethod[]),
    },
  ];

  return {
    data: Array.isArray(data?.data) ? data.data : [],
    placeholder: "Filter Orders",
    pagination,
    isLoading,
    search,
    setSearch,
    status,
    setStatus,
    paymentMethod,
    setPaymentMethod,
    facedFilter,
  };
}
