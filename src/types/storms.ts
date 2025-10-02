// Storm Types
export interface StormCreate {
  storm_name: string;
  storm_id: number;
}

export interface StormRead {
  storm_name: string;
  start_date: string;
  end_date: string;
  storm_id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface StormUpdate {
  storm_name?: string;
  storm_id?: number;
}

// BestTrack File Types
export interface BestTrackFileCreate {
  storm_id: number;
  issued_time: string;
  file_name: string;
}

export interface BestTrackFileUpload extends Omit<BestTrackFileCreate, "file_name"> {
  file_name?: string;
  file?: File;
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

export interface StormLifecycleCreate {
  storm_id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  intensity: number;
  source?: string | null;
}

export interface StormLifecycleRead {
  storm_id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  intensity: number;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface StormLifecycleUpdate {
  storm_id?: number;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
  intensity?: number;
  source?: string | null;
}
