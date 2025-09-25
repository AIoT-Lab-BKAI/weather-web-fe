import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mdiDeleteOutline, mdiPencilOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { PlusIcon } from "lucide-react";
import React, { ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => ReactNode;
  width?: string;
}

export interface TableState {
  itemsPerPage: number;
  page: number;
  search: string;
}

export interface TableData<T> {
  rows: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface DataTableProps<T> {
  data: TableData<T>;
  columns: TableColumn<T>[];
  tableState: TableState;
  tableInput: { search: string };
  onTableStateChange: (state: Partial<TableState>) => void;
  onTableInputChange: (input: { search: string }) => void;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  addLabel?: string;
  emptyMessage?: string;
  showSearch?: boolean;
  isLoading?: boolean;
  getItemId: (item: T) => string;
  actions?: { label: string; icon: ReactNode; onClick: (item: T) => void }[];
}

export function DataTable<T>({
  data,
  columns,
  tableState,
  tableInput,
  onTableStateChange,
  onTableInputChange,
  onAdd,
  onEdit,
  onDelete,
  addLabel = "Add",
  emptyMessage = "No data found",
  showSearch = false,
  isLoading = false,
  actions,
  getItemId,
}: DataTableProps<T>) {
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onTableStateChange({ page: 1, search: tableInput.search });
    }
  };

  const renderCellValue = (column: TableColumn<T>, item: T) => {
    if (column.render) {
      return column.render((item as any)[column.key], item);
    }
    return (item as any)[column.key];
  };

  return (
    <div className="">
      {/* Header with Add Button and Search */}
      <div className="flex flex-row-reverse items-center mb-4 gap-4">
        {showSearch && (
          <div className="relative w-64">
            <Input
              className="pl-10 pr-4 bg-[#f7f9fa] rounded-full"
              placeholder="Search"
              value={tableInput.search}
              onChange={e => onTableInputChange({ search: e.target.value })}
              onKeyDown={handleSearchKeyDown}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6z" />
              </svg>
            </span>
          </div>
        )}
        {onAdd && (
          <Button onClick={onAdd} className="text-white rounded-full">
            <PlusIcon />
            {addLabel}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} style={{ width: column.width }}>
                  {column.header}
                </TableHead>
              ))}
              {(onEdit || onDelete || actions) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center text-gray-500 py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                )
              : data.rows.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center text-gray-500 py-4">
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  )
                : (
                    data.rows.map(row => (
                      <TableRow key={getItemId(row)} className="bg-white">
                        {columns.map((column, index) => (
                          <TableCell key={index}>
                            {renderCellValue(column, row)}
                          </TableCell>
                        ))}
                        {(onEdit || onDelete) && (
                          <TableCell className="flex justify-center items-center">
                            {onEdit && (
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Edit"
                                onClick={() => onEdit(row)}
                              >
                                <Icon path={mdiPencilOutline} size={1} />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Delete"
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this item?")) {
                                    onDelete(row);
                                  }
                                }}
                              >
                                <Icon path={mdiDeleteOutline} size={1} className="text-red-400" />
                              </Button>
                            )}
                            {actions && actions.map((action, idx) => (
                              <Button
                                size="icon"
                                variant="ghost"
                                title={action.label}
                                onClick={() => action.onClick(row)}
                                key={idx}
                              >
                                {action.icon}
                              </Button>
                            ))}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (tableState.page > 1) {
                      onTableStateChange({ page: tableState.page - 1 });
                    }
                  }}
                  className={tableState.page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: data.totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onTableStateChange({ page: i + 1 });
                    }}
                    isActive={tableState.page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (tableState.page < data.totalPages) {
                      onTableStateChange({ page: tableState.page + 1 });
                    }
                  }}
                  className={tableState.page === data.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
