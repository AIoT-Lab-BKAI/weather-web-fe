// Reservoir Types
export interface ReservoirCreate {
  reservoir_name: string;
  river: string;
  province: string;
  capacity: number;
  elevation: number;
}

export interface ReservoirRead {
  reservoir_id: number;
  reservoir_name: string;
  river: string;
  province: string;
  capacity: number;
  elevation: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ReservoirUpdate {
  reservoir_name?: string;
  river?: string;
  province?: string;
  capacity?: number;
  elevation?: number;
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
  water_level: number;
  inflow: number;
  total_discharge: number;
  turbine_discharge: number;
  spillway_discharge: number;
  num_bottom_gates: number;
  num_surface_gates: number;
}

export interface ReservoirOperationRead {
  reservoir_id: number;
  timestamp: string;
  water_level: number;
  inflow: number;
  total_discharge: number;
  turbine_discharge: number;
  spillway_discharge: number;
  num_bottom_gates: number;
  num_surface_gates: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ReservoirOperationUpdate {
  reservoir_id?: number;
  timestamp?: string;
  water_level?: number;
  inflow?: number;
  total_discharge?: number;
  turbine_discharge?: number;
  spillway_discharge?: number;
  num_bottom_gates?: number;
  num_surface_gates?: number;
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
