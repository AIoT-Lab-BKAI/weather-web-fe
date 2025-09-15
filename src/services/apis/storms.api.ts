import { apiService } from "@/services/api.service";
import {
  StormCreate,
  StormRead,
  StormUpdate,
  StormPagination,
  BestTrackFileCreate,
  BestTrackFileRead,
  BestTrackFileUpdate,
  BestTrackFilePagination,
  NWPDataCreate,
  NWPDataRead,
  NWPDataUpdate,
  NWPDataPagination,
  HRESDataCreate,
  HRESDataRead,
  HRESDataUpdate,
  HRESDataPagination,
} from "@/types/storms";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Storms API Functions
export const stormsApi = {
  // Storms
  storms: {
    list: (params?: PaginationParams) =>
      apiService.get<StormPagination>("/storms/storms/", { params }),

    create: (data: StormCreate) =>
      apiService.post<StormRead>("/storms/storms/", data),

    get: (stormId: number) =>
      apiService.get<StormRead>(`/storms/storms/${stormId}`),

    update: (stormId: number, data: StormUpdate) =>
      apiService.put<StormRead>(`/storms/storms/${stormId}`, data),

    delete: (stormId: number) =>
      apiService.delete(`/storms/storms/${stormId}`),
  },

  // BestTrack Files
  bestTrackFiles: {
    list: (params?: PaginationParams & { storm_id?: number }) =>
      apiService.get<BestTrackFilePagination>("/storms/besttrack-files/", { params }),

    create: (data: BestTrackFileCreate) =>
      apiService.post<BestTrackFileRead>("/storms/besttrack-files/", data),

    update: (fileId: string, data: BestTrackFileUpdate) =>
      apiService.put<BestTrackFileRead>(`/storms/besttrack-files/${fileId}`, data),

    delete: (fileId: string) =>
      apiService.delete(`/storms/besttrack-files/${fileId}`),
  },

  // NWP Data
  nwpData: {
    list: (params?: PaginationParams & { storm_id?: number }) =>
      apiService.get<NWPDataPagination>("/storms/nwp-data/", { params }),

    create: (data: NWPDataCreate) =>
      apiService.post<NWPDataRead>("/storms/nwp-data/", data),

    update: (dataId: string, data: NWPDataUpdate) =>
      apiService.put<NWPDataRead>(`/storms/nwp-data/${dataId}`, data),

    delete: (dataId: string) =>
      apiService.delete(`/storms/nwp-data/${dataId}`),
  },

  // HRES Data
  hresData: {
    list: (params?: PaginationParams & { storm_id?: number }) =>
      apiService.get<HRESDataPagination>("/storms/hres-data/", { params }),

    create: (data: HRESDataCreate) =>
      apiService.post<HRESDataRead>("/storms/hres-data/", data),

    update: (dataId: string, data: HRESDataUpdate) =>
      apiService.put<HRESDataRead>(`/storms/hres-data/${dataId}`, data),

    delete: (dataId: string) =>
      apiService.delete(`/storms/hres-data/${dataId}`),
  },
};
