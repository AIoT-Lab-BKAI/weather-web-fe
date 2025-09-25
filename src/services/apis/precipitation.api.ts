import { apiService } from "@/services/api.service";
import {
  StationCreate,
  StationRead,
  StationUpdate,
  StationPagination,
  RainfallRecordCreate,
  RainfallRecordRead,
  RainfallRecordUpdate,
  RainfallRecordPagination,
  S2SFileRead,
  S2SFileUpdate,
  S2SFilePagination,
  S2SFileUpload,
} from "@/types/precipitation";
import { storageApi } from "./storage.api";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Station API Functions
export const precipitationApi = {
  // Stations
  stations: {
    list: (params?: PaginationParams) =>
      apiService.get<StationPagination>("/precipitation/stations/", { params }),

    create: (data: StationCreate) =>
      apiService.post<StationRead>("/precipitation/stations/", data),

    get: (stationId: number) =>
      apiService.get<StationRead>(`/precipitation/stations/${stationId}`),

    update: (stationId: number, data: StationUpdate) =>
      apiService.put<StationRead>(`/precipitation/stations/${stationId}`, data),

    delete: (stationId: number) =>
      apiService.delete(`/precipitation/stations/${stationId}`),
  },

  // Rainfall Records
  rainfallRecords: {
    list: (params?: PaginationParams & { station_id?: number; start_date?: string; end_date?: string }) =>
      apiService.get<RainfallRecordPagination>("/precipitation/rainfall-records/", { params }),

    create: (data: RainfallRecordCreate) =>
      apiService.post<RainfallRecordRead>("/precipitation/rainfall-records/", data),

    update: (recordId: number, data: RainfallRecordUpdate) =>
      apiService.put<RainfallRecordRead>(`/precipitation/rainfall-records/${recordId}`, data),

    delete: (recordId: number) =>
      apiService.delete(`/precipitation/rainfall-records/${recordId}`),
  },

  // S2S Files
  s2sFiles: {
    list: (params?: PaginationParams & { data_type?: string; start_date?: string; end_date?: string }) =>
      apiService.get<S2SFilePagination>("/precipitation/s2s-files/", { params }),

    create: async (data: S2SFileUpload) => {
      if (data.file) {
        const formattedAddedTime = data.added_time ? new Date(data.added_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "") : new Date().toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");
        await storageApi.upload({
          file: data.file,
          path: `precipitation/s2s/${data.s2s_id}/${formattedAddedTime}`,
          s2s_id: data.s2s_id,
          added_time: data.added_time || new Date().toISOString(),
          data_type: "s2s",
        });
      }
      else {
        return apiService.post<S2SFileRead>("/precipitation/s2s-files/", data);
      }
    },

    update: (s2sId: number, data: S2SFileUpdate) =>
      apiService.put<S2SFileRead>(`/precipitation/s2s-files/${s2sId}`, data),

    delete: (s2sId: number) =>
      apiService.delete(`/precipitation/s2s-files/${s2sId}`),
  },
};
