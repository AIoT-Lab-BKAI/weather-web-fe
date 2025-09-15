// Storm Types
export interface StormCreate {
  storm_name: string;
  storm_id: number;
}

export interface StormRead {
  storm_name: string;
  storm_id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface StormUpdate {
  storm_name?: string;
  storm_id?: number;
}

export interface StormPagination {
  data: StormRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// BestTrack File Types
export interface BestTrackFileCreate {
  storm_id: number;
  issued_time: string;
  file_name: string;
}

export interface BestTrackFileRead {
  id?: string;
  storm_id: number;
  storm?: StormRead;
  issued_time: string;
  file_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BestTrackFileUpdate {
  storm_id?: number;
  issued_time?: string;
  file_name?: string;
}

export interface BestTrackFilePagination {
  data: BestTrackFileRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// NWP Data Types
export interface NWPDataCreate {
  storm_id: number;
  nwp_path: string;
  issued_time: string;
}

export interface NWPDataRead {
  id?: string;
  storm_id: number;
  storm?: StormRead;
  nwp_path: string;
  issued_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface NWPDataUpdate {
  storm_id?: number;
  nwp_path?: string;
  issued_time?: string;
}

export interface NWPDataPagination {
  data: NWPDataRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// HRES Data Types
export interface HRESDataCreate {
  storm_id: number;
  hres_path: string;
  issued_time: string;
}

export interface HRESDataRead {
  id?: string;
  storm_id: number;
  storm?: StormRead;
  hres_path: string;
  issued_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface HRESDataUpdate {
  storm_id?: number;
  hres_path?: string;
  issued_time?: string;
}

export interface HRESDataPagination {
  data: HRESDataRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
