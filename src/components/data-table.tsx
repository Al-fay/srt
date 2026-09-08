import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Search, ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import type { DateRange } from "react-day-picker";
import { TableSkeleton } from "./skeletons/table-skeleton";

export interface DataTableApiResponse<TData> {
  data: TData[];
  total: number;
}

export interface DataTableQueryParams {
  page: number;
  limit: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string>;
}

export interface DataTableFilterOption {
  label: string;
  value: string;
}

export interface DataTableFilter {
  key: string;
  label: string;
  options: DataTableFilterOption[];
  placeholder?: string;
}

export interface DataTableFeatures {
  search?: boolean;
  dateRangeFilter?: boolean;
  pagination?: boolean;
  rowsPerPage?: boolean;
  sorting?: boolean;
  syncUrl?: boolean;
  rowSelection?: boolean;
}

export interface DataTableRowColorOption<TData> {
  value: string;
  condition: (row: TData) => boolean;
  className: string;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  className?: string;
  refreshTrigger?: number;
  data?: TData[];

  apiUrl?: string;

  fetcher?: (
    params: DataTableQueryParams,
  ) => Promise<DataTableApiResponse<TData>>;

  extraParams?: Record<string, string | number | boolean | undefined>;

  features?: DataTableFeatures;

  filters?: DataTableFilter[];

  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;

  stickyColumns?: string[];
  onSelectionChange?: (rows: TData[]) => void;
  getRowId?: (row: TData, index: number) => string;

  rowColorOptions?: DataTableRowColorOption<TData>[];

  paramKeys?: {
    page?: string;
    limit?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

const defaultParamKeys = {
  page: "page",
  limit: "limit",
  search: "search",
  dateFrom: "dateFrom",
  dateTo: "dateTo",
  sortBy: "sortBy",
  sortOrder: "sortOrder",
};

function getApiErrorMessage(json: unknown, status: number): string {
  if (
    typeof json === "object" &&
    json !== null &&
    "error" in json &&
    typeof json.error === "object" &&
    json.error !== null &&
    "message" in json.error &&
    typeof json.error.message === "string"
  ) {
    return json.error.message;
  }

  if (
    typeof json === "object" &&
    json !== null &&
    "message" in json &&
    typeof json.message === "string"
  ) {
    return json.message;
  }

  return `Gagal mengambil data (status ${status})`;
}

function readUrlParam(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(key) ?? fallback;
}

export function DataTable<TData>({
  columns,
  className,
  data: staticData,
  apiUrl,
  fetcher,
  extraParams,
  features = {},
  filters = [],
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  searchPlaceholder = "Cari...",
  paramKeys,
  stickyColumns,
  onSelectionChange,
  getRowId,
  refreshTrigger,
  rowColorOptions = [],
}: DataTableProps<TData>) {
  const {
    search: searchFeature = true,
    dateRangeFilter: dateRangeFeature = false,
    pagination: paginationFeature = true,
    rowsPerPage: rowsPerPageFeature = true,
    sorting: sortingFeature = true,
    rowSelection: rowSelectionFeature = false,
  } = features;

  const keys = { ...defaultParamKeys, ...paramKeys };
  const isDynamic = Boolean(apiUrl || fetcher);
  const syncUrlFeature = features.syncUrl ?? isDynamic;
  const [data, setData] = useState<TData[]>(staticData ?? []);
  const [total, setTotal] = useState<number>(staticData?.length ?? 0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const didMount = useRef(false);
  const [page, setPage] = useState(
    () => Number(readUrlParam(keys.page, "1")) || 1,
  );
  const [limit, setLimit] = useState(
    () =>
      Number(readUrlParam(keys.limit, String(defaultPageSize))) ||
      defaultPageSize,
  );
  const [searchInput, setSearchInput] = useState(() =>
    readUrlParam(keys.search, ""),
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = readUrlParam(keys.dateFrom, "");
    const to = readUrlParam(keys.dateTo, "");
    if (!from && !to) return undefined;
    return {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };
  });
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortBy = readUrlParam(keys.sortBy, "");
    const sortOrder = readUrlParam(keys.sortOrder, "");
    return sortBy ? [{ id: sortBy, desc: sortOrder === "desc" }] : [];
  });
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      filters.forEach((f) => {
        const v = readUrlParam(f.key, "");
        if (v) initial[f.key] = v;
      });
      return initial;
    },
  );
  const [rowSelection, setRowSelection] = useState({});
  const [initialized, setInitialized] = useState(false);

  const thRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const [stickyLeft, setStickyLeft] = useState<Record<string, number>>({});

  const showSkeleton = loading && !initialized;

  const [search, setSearch] = useState(() => readUrlParam(keys.search, ""));

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch((prev) => {
        if (prev === searchInput) return prev;

        setPage(1);
        return searchInput.trim();
      });
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  useEffect(() => {
    if (!didMount.current) return;

    setPage(1);
  }, [dateRange?.from, dateRange?.to]);

  useEffect(() => {
    if (!didMount.current) return;

    if (isDynamic) {
      setPage(1);
    }
  }, [sorting]);

  useEffect(() => {
    if (!didMount.current) return;

    setPage(1);
  }, [filterValues]);

  useEffect(() => {
    didMount.current = true;
  }, []);

  useEffect(() => {
    setInitialized(false);
  }, [apiUrl, fetcher]);

  useEffect(() => {
    setRowSelection({});
  }, [page, limit, search, dateRange, sorting, filterValues]);

  const setFilterValue = useCallback((key: string, value: string) => {
    setFilterValues((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!syncUrlFeature || typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const setOrDelete = (key: string, value?: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    setOrDelete(keys.page, page > 1 ? String(page) : undefined);
    setOrDelete(
      keys.limit,
      limit !== defaultPageSize ? String(limit) : undefined,
    );
    setOrDelete(keys.search, search || undefined);
    setOrDelete(keys.dateFrom, dateRange?.from?.toISOString());
    setOrDelete(keys.dateTo, dateRange?.to?.toISOString());
    const activeSort = sortingFeature ? sorting[0] : undefined;
    setOrDelete(keys.sortBy, activeSort?.id);
    setOrDelete(
      keys.sortOrder,
      activeSort ? (activeSort.desc ? "desc" : "asc") : undefined,
    );

    filters.forEach((f) => setOrDelete(f.key, filterValues[f.key]));

    const newUrl = `${window.location.pathname}?${params.toString()}`.replace(
      /\?$/,
      "",
    );
    window.history.replaceState({}, "", newUrl);
  }, [
    syncUrlFeature,
    page,
    limit,
    search,
    dateRange,
    sorting,
    filterValues,
    filters,
  ]);

  useEffect(() => {
    if (!isDynamic) return;

    let isCancelled = false;
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);

      const activeSort = sortingFeature ? sorting[0] : undefined;
      const formatDateParam = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      };
      const params: DataTableQueryParams = {
        page,
        limit,
        search: searchFeature ? search || undefined : undefined,
        dateFrom:
          dateRangeFeature && dateRange?.from
            ? formatDateParam(dateRange.from)
            : undefined,

        dateTo:
          dateRangeFeature && dateRange?.to
            ? formatDateParam(dateRange.to)
            : undefined,

        sortBy: activeSort?.id,
        sortOrder: activeSort ? (activeSort.desc ? "desc" : "asc") : undefined,
        filters: Object.keys(filterValues).length ? filterValues : undefined,
      };

      try {
        let result: DataTableApiResponse<TData>;

        if (fetcher) {
          result = await fetcher(params);
        } else {
          const url = new URL(apiUrl as string, window.location.origin);

          url.searchParams.set(keys.page, String(params.page));
          url.searchParams.set(keys.limit, String(params.limit));

          if (params.search) {
            url.searchParams.set(keys.search, params.search);
          }

          if (params.dateFrom) {
            url.searchParams.set(keys.dateFrom, params.dateFrom);
          }

          if (params.dateTo) {
            url.searchParams.set(keys.dateTo, params.dateTo);
          }

          if (params.sortBy) {
            url.searchParams.set(keys.sortBy, params.sortBy);
          }

          if (params.sortOrder) {
            url.searchParams.set(keys.sortOrder, params.sortOrder);
          }

          Object.entries(params.filters ?? {}).forEach(([k, v]) => {
            url.searchParams.set(k, v);
          });

          Object.entries(extraParams ?? {}).forEach(([k, v]) => {
            if (v !== undefined) {
              url.searchParams.set(k, String(v));
            }
          });

          const res = await fetch(url.toString(), {
            signal: controller.signal,
          });

          const contentType = res.headers.get("content-type") ?? "";

          if (!contentType.includes("application/json")) {
            throw new Error(
              `Endpoint "${url.pathname}" tidak mengembalikan JSON.`,
            );
          }

          const json = await res.json();

          if (!res.ok) {
            throw new Error(getApiErrorMessage(json, res.status));
          }

          result = {
            data: json.data ?? json.results ?? [],
            total: json.total ?? json.meta?.total ?? (json.data ?? []).length,
          };
        }

        if (!isCancelled) {
          setData(result.data);
          setTotal(result.total);

          // HANYA hapus error kalau request berhasil
          setErrorMsg(null);
        }
      } catch (err) {
        if (!isCancelled && (err as Error).name !== "AbortError") {
          console.error("DataTable error:", err);

          setErrorMsg(
            (err as Error).message || "Terjadi kesalahan saat mengambil data.",
          );

          setData([]);
          setTotal(0);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [
    isDynamic,
    page,
    limit,
    search,
    dateRange,
    sorting,
    sortingFeature,
    filterValues,
    apiUrl,
    fetcher,
    refreshTrigger,
  ]);

  useEffect(() => {
    if (!isDynamic && staticData) {
      setData(staticData);
      setTotal(staticData.length);
    }
  }, [isDynamic, staticData]);

  const numberedColumns = useMemo<ColumnDef<TData, any>[]>(() => {
    const selectColumn: ColumnDef<TData, any>[] = rowSelectionFeature
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected()
                    ? true
                    : table.getIsSomePageRowsSelected()
                      ? "indeterminate"
                      : false
                }
                onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                aria-label="Pilih semua baris"
              />
            ),
            enableSorting: false,
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(v) => row.toggleSelected(!!v)}
                aria-label="Pilih baris"
              />
            ),
          },
        ]
      : [];

    return [
      ...selectColumn,
      {
        id: "number",
        header: "No",
        enableSorting: false,
        cell: ({ row }) => (page - 1) * limit + row.index + 1,
      },
      ...columns,
    ];
  }, [columns, page, limit, rowSelectionFeature]);

  const table = useReactTable({
    data,
    columns: numberedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: isDynamic,
    manualFiltering: isDynamic,
    manualSorting: isDynamic,
    enableSorting: sortingFeature,
    enableRowSelection: rowSelectionFeature,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getRowId: getRowId,
    state: {
      sorting,
      rowSelection,
    },
  });

  useEffect(() => {
    if (!onSelectionChange) return;
    onSelectionChange(table.getSelectedRowModel().rows.map((r) => r.original));
  }, [rowSelection, data]);

  useLayoutEffect(() => {
    if (!stickyColumns || stickyColumns.length === 0) return;

    const measure = () => {
      let acc = 0;
      const next: Record<string, number> = {};
      stickyColumns.forEach((colId) => {
        next[colId] = acc;
        acc += thRefs.current[colId]?.offsetWidth ?? 0;
      });
      setStickyLeft(next);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stickyColumns, data, numberedColumns]);

  const pageCount = Math.max(1, Math.ceil(total / limit));

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(pageCount, page + 1);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [page, pageCount]);

  const getRowColorClass = useCallback(
    (row: TData) => {
      const option = rowColorOptions.find((option) => option.condition(row));

      return option?.className ?? "";
    },
    [rowColorOptions],
  );

  return (
    <div className={`isolate ${className ?? ""}`}>
      {(searchFeature || dateRangeFeature || filters.length > 0) && (
        <div className="mb-3 flex flex-col-reverse gap-3 md:flex-row md:flex-wrap md:items-center">
          {dateRangeFeature && (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Popover open={fromOpen} onOpenChange={setFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal shadow-xl sm:w-auto"
                  >
                    {dateRange?.from
                      ? dateRange.from.toLocaleDateString()
                      : "Tanggal awal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dateRange?.from}
                    defaultMonth={dateRange?.from}
                    captionLayout="dropdown"
                    disabled={
                      dateRange?.to ? { after: dateRange.to } : undefined
                    }
                    onSelect={(d) => {
                      setDateRange((prev) => ({ from: d, to: prev?.to }));
                      setFromOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>

              <span className="text-center text-sm text-muted-foreground sm:mx-1">
                s/d
              </span>

              <Popover open={toOpen} onOpenChange={setToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal shadow-xl sm:w-auto"
                  >
                    {dateRange?.to
                      ? dateRange.to.toLocaleDateString()
                      : "Tanggal akhir"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dateRange?.to}
                    defaultMonth={dateRange?.to}
                    captionLayout="dropdown"
                    disabled={
                      dateRange?.from ? { before: dateRange.from } : undefined
                    }
                    onSelect={(d) => {
                      setDateRange((prev) => ({ from: prev?.from, to: d }));
                      setToOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {filters.map((f) => (
            <Field key={f.key} orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor={`filter-${f.key}`}>{f.label}</FieldLabel>
              <Select
                value={filterValues[f.key] ?? "__all__"}
                onValueChange={(v) =>
                  setFilterValue(f.key, v === "__all__" ? "" : v)
                }
              >
                <SelectTrigger className="w-40" id={`filter-${f.key}`}>
                  <SelectValue placeholder={f.placeholder ?? "Semua"} />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="__all__">
                      {f.placeholder ?? "Semua"}
                    </SelectItem>
                    {f.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          ))}

          {searchFeature && (
            <div className="relative w-full md:ml-auto md:w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="pl-10 shadow-xl"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      <div className="relative min-w-0 overflow-x-auto rounded-lg border">
        {showSkeleton ? (
          <TableSkeleton columns={numberedColumns.length} rows={limit} />
        ) : (
          <>
            {loading && (
              <div className="pointer-events-none absolute inset-0 z-10 bg-background/30" />
            )}

            <table className="w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-background">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort =
                        sortingFeature && header.column.getCanSort();
                      const sortDir = header.column.getIsSorted();
                      const isSticky = stickyColumns?.includes(
                        header.column.id,
                      );

                      return (
                        <th
                          key={header.id}
                          ref={(el) => {
                            if (isSticky) thRefs.current[header.column.id] = el;
                          }}
                          style={
                            isSticky
                              ? {
                                  position: "sticky",
                                  left: stickyLeft[header.column.id] ?? 0,
                                  zIndex: 2,
                                }
                              : undefined
                          }
                          className={`border-b px-4 py-1 text-left font-semibold ${
                            isSticky ? "bg-gray-100 dark:bg-background" : ""
                          }`}
                        >
                          {header.isPlaceholder ? null : canSort ? (
                            <button
                              type="button"
                              className="flex items-center gap-1.5 select-none"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {sortDir === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : sortDir === "desc" ? (
                                <ArrowDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
                              )}
                            </button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody>
                {errorMsg ? (
                  <tr>
                    <td
                      colSpan={numberedColumns.length}
                      className="py-6 text-center text-red-500 whitespace-pre-line"
                    >
                      {errorMsg}
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td
                      colSpan={numberedColumns.length}
                      className="py-6 text-center text-muted-foreground"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        getRowColorClass(row.original) ||
                        "hover:bg-gray-200 dark:hover:bg-background"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isSticky = stickyColumns?.includes(
                          cell.column.id,
                        );

                        return (
                          <td
                            key={cell.id}
                            style={
                              isSticky
                                ? {
                                    position: "sticky",
                                    left: stickyLeft[cell.column.id] ?? 0,
                                    zIndex: 1,
                                  }
                                : undefined
                            }
                            className={`border-b px-4 py-1 ${
                              isSticky ? "bg-white dark:bg-background" : ""
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={numberedColumns.length}
                      className="py-6 text-center text-gray-500"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div className="my-3 flex flex-col md:flex-row md:items-center gap-4 lg:justify-between">
        {rowsPerPageFeature && (
          <div className="w-fit">
            <Field orientation="horizontal">
              <FieldLabel htmlFor="select-rows-per-page">
                Jumlah baris per halaman
              </FieldLabel>

              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-15" id="select-rows-per-page">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent align="start">
                  <SelectGroup>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}

        {paginationFeature && (
          <div>
            <Pagination className="md:ml-auto md:w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {pageNumbers.map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      className={p === page ? "border-purple-500" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(pageCount, p + 1));
                    }}
                    className={
                      page >= pageCount ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
