import { apiService } from "@/services/api.service";
import { PaginatedResult } from "@/types/interfaces/pagination";
import {
  BestTrackFileCreate,
  BestTrackFileRead,
  BestTrackFileUpdate,
  HRESDataCreate,
  HRESDataRead,
  HRESDataUpdate,
  NWPDataCreate,
  NWPDataRead,
  NWPDataUpdate,
  StormCreate,
  StormLifecycleCreate,
  StormLifecycleRead,
  StormLifecycleUpdate,
  StormRead,
  StormUpdate,
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
      apiService.get<PaginatedResult<StormRead>>("/storms/storms/", { params }),

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
      apiService.get<PaginatedResult<BestTrackFileRead>>("/storms/besttrack-files/", { params }),

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
      apiService.get<PaginatedResult<NWPDataRead>>("/storms/nwp-data/", { params }),

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
      apiService.get<PaginatedResult<HRESDataRead>>("/storms/hres-data/", { params }),

    create: (data: HRESDataCreate) =>
      apiService.post<HRESDataRead>("/storms/hres-data/", data),

    update: (dataId: string, data: HRESDataUpdate) =>
      apiService.put<HRESDataRead>(`/storms/hres-data/${dataId}`, data),

    delete: (dataId: string) =>
      apiService.delete(`/storms/hres-data/${dataId}`),
  },

  stormLifecycle: {
    list: (params?: PaginationParams & { storm_id?: number; start_date?: string; end_date?: string }) =>
      apiService.get<PaginatedResult<StormLifecycleRead>>("/storms/storm-lifecycle/", { params }),

    create: (data: StormLifecycleCreate) =>
      apiService.post<StormLifecycleRead>("/storms/storm-lifecycle/", data),

    get: (stormId: number) =>
      apiService.get<StormLifecycleRead>(`/storms/storm-lifecycle/${stormId}`),

    update: (stormId: number, data: StormLifecycleUpdate) =>
      apiService.put<StormLifecycleRead>(`/storms/storm-lifecycle/${stormId}`, data),

    delete: (stormId: number) =>
      apiService.delete(`/storms/storm-lifecycle/${stormId}`),
  },
};
