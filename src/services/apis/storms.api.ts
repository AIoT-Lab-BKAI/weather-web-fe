import { apiService } from "@/services/api.service";
import { PaginatedResult } from "@/types/interfaces/pagination";
import {
  BestTrackFileRead,
  BestTrackFileUpdate,
  BestTrackFileUpload,
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
import { storageApi } from "./storage.api";

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

    create: async (data: BestTrackFileUpload) => {
      const formattedDate = new Date(data.issued_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");
      await storageApi.upload({
        file: data.file!,
        path: `storms/${data.storm_id}/besttrack/${formattedDate}`,
        storm_id: data.storm_id,
        issued_date: formattedDate,
        data_type: "besttrack",
      });
    },
    update: (fileId: string, data: BestTrackFileUpdate) =>
      apiService.put<BestTrackFileRead>(`/storms/besttrack-files/${fileId}`, data),

    delete: (fileId: string) =>
      apiService.delete(`/storms/besttrack-files/${fileId}`),
  },

  // NWP Data
  nwpData: {
    list: (params?: PaginationParams & { storm_id?: number }) =>
      apiService.get<PaginatedResult<NWPDataRead>>("/storms/nwp-data/", { params }),

    create: async (data: NWPDataCreate & { file?: File }) => {
      if (data.file) {
        const formattedDate = new Date(data.issued_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");
        await storageApi.upload({
          file: data.file,
          path: `storms/${data.storm_id}/nwp/${formattedDate}`,
          storm_id: data.storm_id,
          issued_date: formattedDate,
          data_type: "nwp",
        });
      }
      else {
        return apiService.post<NWPDataRead>("/storms/nwp-data/", data);
      }
    },

    update: (dataId: string, data: NWPDataUpdate) =>
      apiService.put<NWPDataRead>(`/storms/nwp-data/${dataId}`, data),

    delete: (dataId: string) =>
      apiService.delete(`/storms/nwp-data/${dataId}`),
  },

  // HRES Data
  hresData: {
    list: (params?: PaginationParams & { storm_id?: number }) =>
      apiService.get<PaginatedResult<HRESDataRead>>("/storms/hres-data/", { params }),

    create: async (data: HRESDataCreate & { file?: File }) => {
      if (data.file) {
        const formattedDate = new Date(data.issued_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");
        await storageApi.upload({
          file: data.file,
          path: `storms/${data.storm_id}/hres/${formattedDate}`,
          storm_id: data.storm_id,
          issued_date: formattedDate,
          data_type: "hres",
        });
      }
      else {
        return apiService.post<HRESDataRead>("/storms/hres-data/", data);
      }
    },

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

  runStorm: {
    run: (stormId: number) =>
      apiService.post(`/storms/storms/${stormId}/run`),

    runHightest: () =>
      apiService.post(`/storms/storms/run-highest`),
  },
};
