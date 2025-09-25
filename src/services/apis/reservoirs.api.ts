import { apiService } from "@/services/api.service";
import {
  ReservoirCreate,
  ReservoirRead,
  ReservoirUpdate,
  ReservoirPagination,
  ReservoirOperationCreate,
  ReservoirOperationRead,
  ReservoirOperationUpdate,
  ReservoirOperationPagination,
  ReservoirOperationFileRead,
  ReservoirOperationFileUpdate,
  ReservoirOperationFilePagination,
  ReservoirOperationFileUpload,
} from "@/types/reservoirs";
import { storageApi } from "./storage.api";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Reservoirs API Functions
export const reservoirsApi = {
  // Reservoirs
  reservoirs: {
    list: (params?: PaginationParams & { status?: string; location?: string }) =>
      apiService.get<ReservoirPagination>("/reservoirs/reservoirs/", { params }),

    create: (data: ReservoirCreate) =>
      apiService.post<ReservoirRead>("/reservoirs/reservoirs/", data),

    get: (reservoirId: number) =>
      apiService.get<ReservoirRead>(`/reservoirs/reservoirs/${reservoirId}`),

    update: (reservoirId: number, data: ReservoirUpdate) =>
      apiService.put<ReservoirRead>(`/reservoirs/reservoirs/${reservoirId}`, data),

    delete: (reservoirId: number) =>
      apiService.delete(`/reservoirs/reservoirs/${reservoirId}`),
  },

  // Reservoir Operations
  operations: {
    list: (params?: PaginationParams & { reservoir_id?: number; start_date?: string; end_date?: string }) =>
      apiService.get<ReservoirOperationPagination>("/reservoirs/reservoir-operations/", { params }),

    create: (data: ReservoirOperationCreate) =>
      apiService.post<ReservoirOperationRead>("/reservoirs/reservoir-operations/", data),

    update: (operationId: number, data: ReservoirOperationUpdate) =>
      apiService.put<ReservoirOperationRead>(`/reservoirs/reservoir-operations/${operationId}`, data),

    delete: (operationId: number) =>
      apiService.delete(`/reservoirs/reservoir-operations/${operationId}`),
  },

  // Reservoir Operation Files
  operationFiles: {
    list: (params?: PaginationParams & { reservoir_id?: number; data_type?: string; start_date?: string; end_date?: string }) =>
      apiService.get<ReservoirOperationFilePagination>("/reservoirs/reservoir-operation-files/", { params }),

    create: async (data: ReservoirOperationFileUpload) => {
      if (data.file) {
        const formattedFromTime = new Date(data.from_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");
        const formattedToTime = new Date(data.to_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");
        await storageApi.upload({
          file: data.file,
          path: `reservoirs/${data.reservoir_id}/operations/${formattedFromTime}_${formattedToTime}`,
          reservoir_id: data.reservoir_id,
          from_time: data.from_time,
          to_time: data.to_time,
          data_type: "reservoir-operation",
        });
      }
      else {
        return apiService.post<ReservoirOperationFileRead>("/reservoirs/reservoir-operation-files/", data);
      }
    },

    update: (fileId: number, data: ReservoirOperationFileUpdate) =>
      apiService.put<ReservoirOperationFileRead>(`/reservoirs/reservoir-operation-files/${fileId}`, data),

    delete: (fileId: number) =>
      apiService.delete(`/reservoirs/reservoir-operation-files/${fileId}`),
  },
};
