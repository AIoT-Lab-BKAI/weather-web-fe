import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, TableColumn, TableState } from "@/components/shared/data-table";
import { FormModal } from "@/components/shared/form-modal";
import { handleApiError } from "@/lib/error-handle";
import { reservoirsApi } from "@/services/apis/reservoirs.api";
import {
  ReservoirRead,
  ReservoirCreate,
  ReservoirUpdate,
  ReservoirOperationRead,
  ReservoirOperationCreate,
  ReservoirOperationUpdate,
  ReservoirOperationFileRead,
  ReservoirOperationFileCreate,
  ReservoirOperationFileUpdate,
} from "@/types/reservoirs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form schemas
const reservoirSchema = z.object({
  reservoir_id: z.number().min(0, "Reservoir ID is required"),
  reservoir_name: z.string().min(1, "Reservoir name is required"),
  river: z.string().nullable(),
  province: z.string().nullable(),
  capacity: z.number().min(0, "Capacity must be non-negative").nullable(),
  elevation: z.number().min(0, "Elevation must be non-negative").nullable(),
});

const operationSchema = z.object({
  reservoir_id: z.number().min(0, "Reservoir ID is required"),
  timestamp: z.string().min(1, "Timestamp is required"),
  water_level: z.number().min(0, "Water level must be non-negative").nullable(),
  inflow: z.number().min(0, "Inflow must be non-negative").nullable(),
  total_discharge: z.number().min(0, "Total discharge must be non-negative").nullable(),
  turbine_discharge: z.number().min(0, "Turbine discharge must be non-negative").nullable(),
  spillway_discharge: z.number().min(0, "Spillway discharge must be non-negative").nullable(),
  num_bottom_gates: z.number().min(0, "Number of bottom gates must be non-negative").nullable(),
  num_surface_gates: z.number().min(0, "Number of surface gates must be non-negative").nullable(),
});

const operationFileSchema = z.object({
  reservoir_id: z.number().min(0, "Reservoir ID is required"),
  file_path: z.string().min(1, "File path is required"),
  from_time: z.string().min(1, "From time is required"),
  to_time: z.string().min(1, "To time is required"),
  added_time: z.string().nullable(),
  updated_time: z.string().nullable(),
});

export function RiveLevelPage() {
  const [activeTab, setActiveTab] = useState("reservoirs");
  const queryClient = useQueryClient();

  // States for each tab
  const [reservoirsState, setReservoirsState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [reservoirsInput, setReservoirsInput] = useState({ search: "" });

  const [operationsState, setOperationsState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [operationsInput, setOperationsInput] = useState({ search: "" });

  const [filesState, setFilesState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [filesInput, setFilesInput] = useState({ search: "" });

  // Modal states
  const [reservoirModalOpen, setReservoirModalOpen] = useState(false);
  const [operationModalOpen, setOperationModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  // Edit states
  const [editingReservoir, setEditingReservoir] = useState<ReservoirRead | null>(null);
  const [editingOperation, setEditingOperation] = useState<ReservoirOperationRead | null>(null);
  const [editingFile, setEditingFile] = useState<ReservoirOperationFileRead | null>(null);

  // Forms
  const reservoirForm = useForm<ReservoirCreate>({
    resolver: zodResolver(reservoirSchema),
    defaultValues: {
      reservoir_id: 0,
      reservoir_name: "",
      river: null,
      province: null,
      capacity: null,
      elevation: null,
    },
  });

  const operationForm = useForm<ReservoirOperationCreate>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      reservoir_id: 0,
      timestamp: "",
      water_level: null,
      inflow: null,
      total_discharge: null,
      turbine_discharge: null,
      spillway_discharge: null,
      num_bottom_gates: null,
      num_surface_gates: null,
    },
  });

  const fileForm = useForm<ReservoirOperationFileCreate>({
    resolver: zodResolver(operationFileSchema),
    defaultValues: {
      reservoir_id: 0,
      file_path: "",
      from_time: "",
      to_time: "",
      added_time: null,
      updated_time: null,
    },
  });

  // Queries
  const reservoirsQuery = useQuery({
    queryKey: ["reservoirs", reservoirsState],
    queryFn: () => reservoirsApi.reservoirs.list({
      page: reservoirsState.page,
      limit: reservoirsState.itemsPerPage,
      search: reservoirsState.search,
    }),
  });

  const operationsQuery = useQuery({
    queryKey: ["reservoir-operations", operationsState],
    queryFn: () => reservoirsApi.operations.list({
      page: operationsState.page,
      limit: operationsState.itemsPerPage,
      search: operationsState.search,
    }),
  });

  const filesQuery = useQuery({
    queryKey: ["reservoir-operation-files", filesState],
    queryFn: () => reservoirsApi.operationFiles.list({
      page: filesState.page,
      limit: filesState.itemsPerPage,
      search: filesState.search,
    }),
  });

  // Mutations
  const createReservoirMutation = useMutation({
    mutationFn: reservoirsApi.reservoirs.create,
    onSuccess: () => {
      notification.success({ message: "Reservoir created successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoirs"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create reservoir" }),
  });

  const updateReservoirMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReservoirUpdate }) =>
      reservoirsApi.reservoirs.update(id, data),
    onSuccess: () => {
      notification.success({ message: "Reservoir updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoirs"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update reservoir" }),
  });

  const deleteReservoirMutation = useMutation({
    mutationFn: reservoirsApi.reservoirs.delete,
    onSuccess: () => {
      notification.success({ message: "Reservoir deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoirs"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete reservoir" }),
  });

  // Operations mutations
  const createOperationMutation = useMutation({
    mutationFn: reservoirsApi.operations.create,
    onSuccess: () => {
      notification.success({ message: "Operation created successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoir-operations"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create operation" }),
  });

  const updateOperationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReservoirOperationUpdate }) =>
      reservoirsApi.operations.update(id, data),
    onSuccess: () => {
      notification.success({ message: "Operation updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoir-operations"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update operation" }),
  });

  const deleteOperationMutation = useMutation({
    mutationFn: reservoirsApi.operations.delete,
    onSuccess: () => {
      notification.success({ message: "Operation deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoir-operations"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete operation" }),
  });

  // Files mutations
  const createFileMutation = useMutation({
    mutationFn: reservoirsApi.operationFiles.create,
    onSuccess: () => {
      notification.success({ message: "File created successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoir-operation-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create file" }),
  });

  const updateFileMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReservoirOperationFileUpdate }) =>
      reservoirsApi.operationFiles.update(id, data),
    onSuccess: () => {
      notification.success({ message: "File updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoir-operation-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update file" }),
  });

  const deleteFileMutation = useMutation({
    mutationFn: reservoirsApi.operationFiles.delete,
    onSuccess: () => {
      notification.success({ message: "File deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["reservoir-operation-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete file" }),
  });

  // Handle errors
  useEffect(() => {
    if (reservoirsQuery.isError) {
      handleApiError(reservoirsQuery.error, { customMessage: "Failed to load reservoirs" });
    }
    if (operationsQuery.isError) {
      handleApiError(operationsQuery.error, { customMessage: "Failed to load operations" });
    }
    if (filesQuery.isError) {
      handleApiError(filesQuery.error, { customMessage: "Failed to load operation files" });
    }
  }, [reservoirsQuery.isError, reservoirsQuery.error, operationsQuery.isError, operationsQuery.error, filesQuery.isError, filesQuery.error]);

  // Reservoir columns
  const reservoirColumns: TableColumn<ReservoirRead>[] = [
    { key: "reservoir_name", header: "Reservoir Name" },
    { key: "river", header: "River" },
    { key: "province", header: "Province" },
    { key: "capacity", header: "Capacity" },
    { key: "elevation", header: "Elevation (m)" },
    {
      key: "created_at",
      header: "Created",
      render: value => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  // Operation columns
  const operationColumns: TableColumn<ReservoirOperationRead>[] = [
    { key: "reservoir_id", header: "Reservoir ID" },
    {
      key: "timestamp",
      header: "Timestamp",
      render: value => value ? new Date(value).toLocaleString() : "N/A",
    },
    { key: "water_level", header: "Water Level (m)" },
    { key: "inflow", header: "Inflow (m³/s)" },
    { key: "total_discharge", header: "Total Discharge (m³/s)" },
    { key: "turbine_discharge", header: "Turbine Discharge (m³/s)" },
    { key: "spillway_discharge", header: "Spillway Discharge (m³/s)" },
    { key: "num_bottom_gates", header: "Bottom Gates" },
    { key: "num_surface_gates", header: "Surface Gates" },
  ];

  // File columns
  const fileColumns: TableColumn<ReservoirOperationFileRead>[] = [
    { key: "reservoir_id", header: "Reservoir ID" },
    { key: "file_path", header: "File Path" },
    {
      key: "from_time",
      header: "From Time",
      render: value => value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      key: "to_time",
      header: "To Time",
      render: value => value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      key: "added_time",
      header: "Added Time",
      render: value => value ? new Date(value).toLocaleString() : "N/A",
    },
  ];

  // Handle reservoir operations
  const handleAddReservoir = () => {
    setEditingReservoir(null);
    reservoirForm.reset();
    setReservoirModalOpen(true);
  };

  const handleEditReservoir = (reservoir: ReservoirRead) => {
    setEditingReservoir(reservoir);
    reservoirForm.reset(reservoir);
    setReservoirModalOpen(true);
  };

  const handleReservoirSubmit = async (data: ReservoirCreate) => {
    if (editingReservoir) {
      await updateReservoirMutation.mutateAsync({ id: editingReservoir.reservoir_id, data });
    }
    else {
      await createReservoirMutation.mutateAsync(data);
    }
    setReservoirModalOpen(false);
  };

  const handleDeleteReservoir = (reservoir: ReservoirRead) => {
    deleteReservoirMutation.mutate(reservoir.reservoir_id);
  };

  // Handle operation operations
  const handleAddOperation = () => {
    setEditingOperation(null);
    operationForm.reset();
    setOperationModalOpen(true);
  };

  const handleEditOperation = (operation: ReservoirOperationRead) => {
    setEditingOperation(operation);
    operationForm.reset({
      reservoir_id: operation.reservoir_id,
      timestamp: operation.timestamp,
      water_level: operation.water_level,
      inflow: operation.inflow,
      total_discharge: operation.total_discharge,
      turbine_discharge: operation.turbine_discharge,
      spillway_discharge: operation.spillway_discharge,
      num_bottom_gates: operation.num_bottom_gates,
      num_surface_gates: operation.num_surface_gates,
    });
    setOperationModalOpen(true);
  };

  const handleOperationSubmit = async (data: ReservoirOperationCreate) => {
    if (editingOperation) {
      await updateOperationMutation.mutateAsync({ id: editingOperation.reservoir_id, data });
    }
    else {
      await createOperationMutation.mutateAsync(data);
    }
    setOperationModalOpen(false);
  };

  const handleDeleteOperation = (operation: ReservoirOperationRead) => {
    deleteOperationMutation.mutate(operation.reservoir_id);
  };

  // Handle file operations
  const handleAddFile = () => {
    setEditingFile(null);
    fileForm.reset();
    setFileModalOpen(true);
  };

  const handleEditFile = (file: ReservoirOperationFileRead) => {
    setEditingFile(file);
    fileForm.reset({
      reservoir_id: file.reservoir_id,
      file_path: file.file_path,
      from_time: file.from_time,
      to_time: file.to_time,
    });
    setFileModalOpen(true);
  };

  const handleFileSubmit = async (data: ReservoirOperationFileCreate) => {
    if (editingFile) {
      await updateFileMutation.mutateAsync({ id: editingFile.reservoir_id, data });
    }
    else {
      await createFileMutation.mutateAsync(data);
    }
    setFileModalOpen(false);
  };

  const handleDeleteFile = (file: ReservoirOperationFileRead) => {
    deleteFileMutation.mutate(file.reservoir_id);
  };

  // Transform data for tables
  const reservoirsData = {
    rows: reservoirsQuery.data?.data || [],
    currentPage: reservoirsQuery.data?.meta.page || 1,
    totalItems: reservoirsQuery.data?.meta.total || 0,
    totalPages: reservoirsQuery.data?.meta.totalPages || 1,
  };

  const operationsData = {
    rows: operationsQuery.data?.data || [],
    currentPage: operationsQuery.data?.meta.page || 1,
    totalItems: operationsQuery.data?.meta.total || 0,
    totalPages: operationsQuery.data?.meta.totalPages || 1,
  };

  const filesData = {
    rows: filesQuery.data?.data || [],
    currentPage: filesQuery.data?.meta.page || 1,
    totalItems: filesQuery.data?.meta.total || 0,
    totalPages: filesQuery.data?.meta.totalPages || 1,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reservoirs">Reservoirs</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="files">Operation Files</TabsTrigger>
        </TabsList>

        <TabsContent value="reservoirs" className="mt-6">
          <DataTable
            data={reservoirsData}
            columns={reservoirColumns}
            tableState={reservoirsState}
            tableInput={reservoirsInput}
            onTableStateChange={changes => setReservoirsState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setReservoirsInput}
            onAdd={handleAddReservoir}
            onEdit={handleEditReservoir}
            onDelete={handleDeleteReservoir}
            addLabel="Add Reservoir"
            emptyMessage="No reservoirs found"
            showSearch={true}
            isLoading={reservoirsQuery.isLoading}
            getItemId={reservoir => reservoir.reservoir_id.toString()}
          />
        </TabsContent>

        <TabsContent value="operations" className="mt-6">
          <DataTable
            data={operationsData}
            columns={operationColumns}
            tableState={operationsState}
            tableInput={operationsInput}
            onTableStateChange={changes => setOperationsState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setOperationsInput}
            onAdd={handleAddOperation}
            onEdit={handleEditOperation}
            onDelete={handleDeleteOperation}
            addLabel="Add Operation"
            emptyMessage="No operations found"
            showSearch={true}
            isLoading={operationsQuery.isLoading}
            getItemId={operation => operation.reservoir_id.toString()}
          />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <DataTable
            data={filesData}
            columns={fileColumns}
            tableState={filesState}
            tableInput={filesInput}
            onTableStateChange={changes => setFilesState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setFilesInput}
            onAdd={handleAddFile}
            onEdit={handleEditFile}
            onDelete={handleDeleteFile}
            addLabel="Add File"
            emptyMessage="No operation files found"
            showSearch={true}
            isLoading={filesQuery.isLoading}
            getItemId={file => file.reservoir_id.toString()}
          />
        </TabsContent>
      </Tabs>

      {/* Reservoir Form Modal */}
      <FormModal
        open={reservoirModalOpen}
        onOpenChange={setReservoirModalOpen}
        title={editingReservoir ? "Edit Reservoir" : "Add Reservoir"}
        form={reservoirForm}
        onSubmit={handleReservoirSubmit}
        isLoading={createReservoirMutation.isPending || updateReservoirMutation.isPending}
      >
        <FormField
          control={reservoirForm.control}
          name="reservoir_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reservoir ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Reservoir ID"
                  onChange={e => field.onChange(Number.parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={reservoirForm.control}
          name="reservoir_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reservoir Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Reservoir name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={reservoirForm.control}
          name="river"
          render={({ field }) => (
            <FormItem>
              <FormLabel>River</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="River name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={reservoirForm.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="Province name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={reservoirForm.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity (m³)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  placeholder="Total capacity"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={reservoirForm.control}
          name="elevation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Elevation (m)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  placeholder="Elevation above sea level"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>

      {/* Operation Modal */}
      <FormModal
        title={editingOperation ? "Edit Operation" : "Add Operation"}
        open={operationModalOpen}
        onOpenChange={setOperationModalOpen}
        onSubmit={handleOperationSubmit}
        form={operationForm}
      >
        <FormField
          control={operationForm.control}
          name="reservoir_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reservoir ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Reservoir ID"
                  onChange={e => field.onChange(Number.parseInt(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={operationForm.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timestamp *</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={operationForm.control}
          name="water_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Water Level (m)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  step="0.01"
                  placeholder="Water level"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={operationForm.control}
          name="inflow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inflow (m³/s)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  step="0.01"
                  placeholder="Inflow rate"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={operationForm.control}
          name="total_discharge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Discharge (m³/s)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  step="0.01"
                  placeholder="Total discharge"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={operationForm.control}
          name="turbine_discharge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turbine Discharge (m³/s)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  step="0.01"
                  placeholder="Turbine discharge"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={operationForm.control}
          name="spillway_discharge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spillway Discharge (m³/s)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  step="0.01"
                  placeholder="Spillway discharge"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={operationForm.control}
          name="num_bottom_gates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Bottom Gates</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  placeholder="Number of bottom gates"
                  onChange={e => field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={operationForm.control}
          name="num_surface_gates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Surface Gates</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  type="number"
                  placeholder="Number of surface gates"
                  onChange={e => field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>

      {/* File Modal */}
      <FormModal
        title={editingFile ? "Edit File" : "Add File"}
        open={fileModalOpen}
        onOpenChange={setFileModalOpen}
        onSubmit={handleFileSubmit}
        form={fileForm}
      >
        <FormField
          control={fileForm.control}
          name="reservoir_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reservoir ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Reservoir ID"
                  onChange={e => field.onChange(Number.parseInt(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={fileForm.control}
          name="file_path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Path *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Path to operation file" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={fileForm.control}
          name="from_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Time *</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={fileForm.control}
          name="to_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To Time *</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={fileForm.control}
          name="added_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Added Time</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={fileForm.control}
          name="updated_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Updated Time</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>
    </div>
  );
}
