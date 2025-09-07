import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { handleApiError } from "@/lib/error-handle";
import { mockApiService } from "@/services/mock-api.service";
import { PaginatedResult } from "@/types/interfaces/pagination";
import { mdiDeleteOutline, mdiDownload } from "@mdi/js";
import Icon from "@mdi/react";
import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface RiverLevelFile {
  id: string;
  name: string;
  modifiedAt: string;
  modifiedBy: string;
  fileSize: string;
  createdAt: string;
}

export function RiveLevelPage() {
  const [tableState, setTableState] = useState({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });

  const [tableInput, setTableInput] = useState({
    search: "",
  });

  const listRiverLevelFilesQuery = useQuery({
    queryKey: ["/river-level-files", tableState],
    queryFn: () => {
      return mockApiService.get<PaginatedResult<RiverLevelFile>>(`/river-level-files`, {
        params: {
          limit: tableState.itemsPerPage,
          page: tableState.page,
          search: tableState.search,
        },
      });
    },
  });

  const tableData = useMemo(() => {
    const blankTableData = {
      rows: [],
      currentPage: 1,
      totalItems: 0,
      totalPages: 1,
    };
    if (listRiverLevelFilesQuery.isSuccess) {
      const { data: rows, meta: { page: currentPage, total: totalItems, totalPages } } = listRiverLevelFilesQuery.data;
      return { rows, currentPage, totalItems, totalPages };
    }

    return blankTableData;
  }, [listRiverLevelFilesQuery.isSuccess, listRiverLevelFilesQuery.data]);

  useEffect(() => {
    if (listRiverLevelFilesQuery.isError) {
      handleApiError(listRiverLevelFilesQuery.error, {
        customMessage: "Failed to load river level files",
      });
    }
  }, [listRiverLevelFilesQuery.isError, listRiverLevelFilesQuery.error]);

  const deleteRiverLevelFile = async (fileId: string) => {
    try {
      await mockApiService.delete(`/river-level-files/delete`, {
        params: { id: fileId },
      });
      notification.success({
        message: "File deleted successfully",
      });
      // Refetch the files after deletion
      listRiverLevelFilesQuery.refetch();
    }
    catch (error) {
      handleApiError(error, {
        customMessage: "Failed to delete file",
      });
    }
  };

  const handleCreateOrUpload = () => {
    // TODO: Implement create or upload functionality
    notification.info({
      message: "Create or upload functionality will be implemented",
    });
  };

  return (
    <div className="p-8 max-w-7xl">

      {/* Header with Create/Upload Button */}
      <div className="flex flex-row-reverse items-center mb-4">
        <div className="relative w-64 hidden">
          <Input
            className="pl-10 pr-4 bg-[#f7f9fa] border rounded-full"
            placeholder="Search"
            value={tableInput.search}
            onChange={(e) => { setTableInput(p => ({ ...p, search: e.target.value })); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTableState(p => ({ ...p, page: 1, search: tableInput.search }));
              }
            }}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6z" /></svg>
          </span>
        </div>
        <Button onClick={handleCreateOrUpload} className="text-white rounded-full">
          <PlusIcon className="mr-2" />
          Create or Upload
        </Button>

      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead>Modified by</TableHead>
              <TableHead>File size</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData?.rows.map(row => (
              <TableRow key={row.id} className="bg-white">
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.modifiedAt}</TableCell>
                <TableCell>{row.modifiedBy}</TableCell>
                <TableCell>{row.fileSize}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <Button size="icon" variant="ghost" title="Download"><Icon path={mdiDownload} size={1} /></Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Delete"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this file?")) {
                        deleteRiverLevelFile(row.id);
                      }
                    }}
                  >
                    <Icon path={mdiDeleteOutline} size={1} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {tableData?.rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  No river level files found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (tableState.page > 1) {
                    setTableState(p => ({ ...p, page: p.page - 1 }));
                  }
                }}
                className={tableState.page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: tableData?.totalPages || 1 }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setTableState(p => ({ ...p, page: i + 1 }));
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
                  if (tableState.page < (tableData?.totalPages || 1)) {
                    setTableState(p => ({ ...p, page: p.page + 1 }));
                  }
                }}
                className={tableState.page === (tableData?.totalPages || 1) ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
