// Reservoir Types
export interface ReservoirCreate {
  reservoir_id: number;
  reservoir_name: string;
  river: string | null;
  province: string | null;
  capacity: number | null;
  elevation: number | null;
}

export interface ReservoirRead {
  reservoir_id: number;
  reservoir_name: string;
  river: string | null;
  province: string | null;
  capacity: number | null;
  elevation: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ReservoirUpdate {
  reservoir_id?: number;
  reservoir_name?: string;
  river?: string | null;
  province?: string | null;
  capacity?: number | null;
  elevation?: number | null;
}

export interface ReservoirPagination {
  data: ReservoirRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Reservoir Operation Types
export interface ReservoirOperationCreate {
  reservoir_id: number;
  timestamp: string;
  water_level: number | null;
  inflow: number | null;
  total_discharge: number | null;
  turbine_discharge: number | null;
  spillway_discharge: number | null;
  num_bottom_gates: number | null;
  num_surface_gates: number | null;
}

export interface ReservoirOperationRead {
  reservoir_id: number;
  timestamp: string;
  water_level: number | null;
  inflow: number | null;
  total_discharge: number | null;
  turbine_discharge: number | null;
  spillway_discharge: number | null;
  num_bottom_gates: number | null;
  num_surface_gates: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ReservoirOperationUpdate {
  reservoir_id?: number;
  timestamp?: string;
  water_level?: number | null;
  inflow?: number | null;
  total_discharge?: number | null;
  turbine_discharge?: number | null;
  spillway_discharge?: number | null;
  num_bottom_gates?: number | null;
  num_surface_gates?: number | null;
}

export interface ReservoirOperationPagination {
  data: ReservoirOperationRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Reservoir Operation File Types
export interface ReservoirOperationFileCreate {
  reservoir_id: number;
  file_path: string;
  from_time: string;
  to_time: string;
  added_time: string | null;
  updated_time: string | null;
}

export interface ReservoirOperationFileRead {
  reservoir_id: number;
  file_path: string;
  from_time: string;
  to_time: string;
  added_time: string;
  updated_time: string;
  deleted_time: string | null;
}

export interface ReservoirOperationFileUpdate {
  reservoir_id?: number;
  file_path?: string;
  from_time?: string;
  to_time?: string;
  added_time?: string | null;
  updated_time?: string | null;
}

export interface ReservoirOperationFilePagination {
  data: ReservoirOperationFileRead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
