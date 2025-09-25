export interface StorageUploadRequest {
  file: File;
  path?: string | null;
  storm_id?: number;
  reservoir_id?: number;
  s2s_id?: number;
  issued_date?: string;
  from_time?: string;
  to_time?: string;
  added_time?: string;
  data_type: string;
}

export interface StorageUploadResponse {
  key: string;
  url: string;
  meta: {
    type: "nwp" | "hres" | "besttrack" | "reservoir-operation" | "s2s";
    id: number;
  };
}
