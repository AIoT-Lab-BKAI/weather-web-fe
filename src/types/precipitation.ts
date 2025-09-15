// Station Types
export interface StationCreate {
  station_name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  province: string;
}

export interface StationRead {
  station_id: number;
  station_name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  province: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface StationUpdate {
  station_name?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  province?: string;
}

export interface StationPagination {
  data: StationRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Rainfall Record Types
export interface RainfallRecordCreate {
  station_id: number;
  start_time: string;
  end_time: string;
  accumulated_rainfall: number;
  data_source: "observation" | "forecast" | "analysis";
}

export interface RainfallRecordRead {
  station_id: number;
  start_time: string;
  end_time: string;
  accumulated_rainfall: number;
  data_source: "observation" | "forecast" | "analysis";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RainfallRecordUpdate {
  station_id?: number;
  start_time?: string;
  end_time?: string;
  accumulated_rainfall?: number;
  data_source?: "observation" | "forecast" | "analysis";
}

export interface RainfallRecordPagination {
  data: RainfallRecordRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// S2S File Types
export interface S2SFileCreate {
  file_path: string;
}

export interface S2SFileRead {
  s2s_id: number;
  file_path: string;
  added_time: string;
  updated_time: string;
  deleted_time: string | null;
}

export interface S2SFileUpdate {
  file_path?: string;
}

export interface S2SFilePagination {
  data: S2SFileRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
