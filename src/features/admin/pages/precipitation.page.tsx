import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, TableColumn, TableState } from "@/components/shared/data-table";
import { FormModal } from "@/components/shared/form-modal";
import { handleApiError } from "@/lib/error-handle";
import { precipitationApi } from "@/services/apis/precipitation.api";
import {
  StationRead,
  StationCreate,
  StationUpdate,
  RainfallRecordRead,
  RainfallRecordCreate,
  RainfallRecordUpdate,
  S2SFileRead,
  S2SFileCreate,
  S2SFileUpdate,
} from "@/types/precipitation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form schemas
const stationSchema = z.object({
  station_id: z.number().min(0, "Station ID is required"),
  station_name: z.string().min(1, "Station name is required"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90").nullable(),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180").nullable(),
  elevation: z.number().min(0, "Elevation must be non-negative").nullable(),
  province: z.string().nullable(),
});

const rainfallRecordSchema = z.object({
  station_id: z.number().min(0, "Station ID is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  accumulated_rainfall: z.number().min(0, "Accumulated rainfall must be non-negative"),
  data_source: z.string().min(1, "Data source is required"),
});

const s2sFileSchema = z.object({
  s2s_id: z.number().min(0, "S2S ID is required"),
  file_path: z.string().min(1, "File path is required"),
  added_time: z.string().nullable(),
  updated_time: z.string().nullable(),
});

export function PrecipitationPage() {
  const [activeTab, setActiveTab] = useState("stations");
  const queryClient = useQueryClient();

  // States for each tab
  const [stationsState, setStationsState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [stationsInput, setStationsInput] = useState({ search: "" });

  const [recordsState, setRecordsState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [recordsInput, setRecordsInput] = useState({ search: "" });

  const [filesState, setFilesState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [filesInput, setFilesInput] = useState({ search: "" });

  // Modal states
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  // Edit states
  const [editingStation, setEditingStation] = useState<StationRead | null>(null);
  const [editingRecord, setEditingRecord] = useState<RainfallRecordRead | null>(null);
  const [editingFile, setEditingFile] = useState<S2SFileRead | null>(null);

  // Forms
  const stationForm = useForm<StationCreate>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      station_id: 0,
      station_name: "",
      latitude: null,
      longitude: null,
      elevation: null,
      province: null,
    },
  });

  const recordForm = useForm<RainfallRecordCreate>({
    resolver: zodResolver(rainfallRecordSchema),
    defaultValues: {
      station_id: 0,
      start_time: "",
      end_time: "",
      accumulated_rainfall: 0,
      data_source: "",
    },
  });

  const fileForm = useForm<S2SFileCreate>({
    resolver: zodResolver(s2sFileSchema),
    defaultValues: {
      s2s_id: 0,
      file_path: "",
      added_time: null,
      updated_time: null,
    },
  });

  // Queries
  const stationsQuery = useQuery({
    queryKey: ["stations", stationsState],
    queryFn: () => precipitationApi.stations.list({
      page: stationsState.page,
      limit: stationsState.itemsPerPage,
      search: stationsState.search,
    }),
  });

  const recordsQuery = useQuery({
    queryKey: ["rainfall-records", recordsState],
    queryFn: () => precipitationApi.rainfallRecords.list({
      page: recordsState.page,
      limit: recordsState.itemsPerPage,
      search: recordsState.search,
    }),
  });

  const filesQuery = useQuery({
    queryKey: ["s2s-files", filesState],
    queryFn: () => precipitationApi.s2sFiles.list({
      page: filesState.page,
      limit: filesState.itemsPerPage,
      search: filesState.search,
    }),
  });

  // Mutations
  const createStationMutation = useMutation({
    mutationFn: precipitationApi.stations.create,
    onSuccess: () => {
      notification.success({ message: "Station created successfully" });
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create station" }),
  });

  const updateStationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: StationUpdate }) =>
      precipitationApi.stations.update(id, data),
    onSuccess: () => {
      notification.success({ message: "Station updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update station" }),
  });

  const deleteStationMutation = useMutation({
    mutationFn: precipitationApi.stations.delete,
    onSuccess: () => {
      notification.success({ message: "Station deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete station" }),
  });

  // Rainfall Record mutations
  const createRecordMutation = useMutation({
    mutationFn: precipitationApi.rainfallRecords.create,
    onSuccess: () => {
      notification.success({ message: "Rainfall record created successfully" });
      queryClient.invalidateQueries({ queryKey: ["rainfall-records"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create rainfall record" }),
  });

  const updateRecordMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RainfallRecordUpdate }) =>
      precipitationApi.rainfallRecords.update(id, data),
    onSuccess: () => {
      notification.success({ message: "Rainfall record updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["rainfall-records"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update rainfall record" }),
  });

  const deleteRecordMutation = useMutation({
    mutationFn: precipitationApi.rainfallRecords.delete,
    onSuccess: () => {
      notification.success({ message: "Rainfall record deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["rainfall-records"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete rainfall record" }),
  });

  // S2S File mutations
  const createFileMutation = useMutation({
    mutationFn: precipitationApi.s2sFiles.create,
    onSuccess: () => {
      notification.success({ message: "S2S file created successfully" });
      queryClient.invalidateQueries({ queryKey: ["s2s-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create S2S file" }),
  });

  const updateFileMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: S2SFileUpdate }) =>
      precipitationApi.s2sFiles.update(id, data),
    onSuccess: () => {
      notification.success({ message: "S2S file updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["s2s-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update S2S file" }),
  });

  const deleteFileMutation = useMutation({
    mutationFn: precipitationApi.s2sFiles.delete,
    onSuccess: () => {
      notification.success({ message: "S2S file deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["s2s-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete S2S file" }),
  });

  // Handle errors
  useEffect(() => {
    if (stationsQuery.isError) {
      handleApiError(stationsQuery.error, { customMessage: "Failed to load stations" });
    }
    if (recordsQuery.isError) {
      handleApiError(recordsQuery.error, { customMessage: "Failed to load rainfall records" });
    }
    if (filesQuery.isError) {
      handleApiError(filesQuery.error, { customMessage: "Failed to load S2S files" });
    }
  }, [stationsQuery.isError, stationsQuery.error, recordsQuery.isError, recordsQuery.error, filesQuery.isError, filesQuery.error]);

  // Station columns
  const stationColumns: TableColumn<StationRead>[] = [
    { key: "station_name", header: "Station Name" },
    { key: "province", header: "Province" },
    { key: "latitude", header: "Latitude" },
    { key: "longitude", header: "Longitude" },
    { key: "elevation", header: "Elevation (m)" },
    {
      key: "created_at",
      header: "Created",
      render: value => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  // Rainfall record columns
  const recordColumns: TableColumn<RainfallRecordRead>[] = [
    { key: "station_id", header: "Station ID" },
    {
      key: "start_time",
      header: "Start Time",
      render: value => value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      key: "end_time",
      header: "End Time",
      render: value => value ? new Date(value).toLocaleString() : "N/A",
    },
    { key: "accumulated_rainfall", header: "Accumulated Rainfall (mm)" },
    { key: "data_source", header: "Data Source" },
  ];

  // S2S file columns
  const fileColumns: TableColumn<S2SFileRead>[] = [
    { key: "s2s_id", header: "S2S ID" },
    { key: "file_path", header: "File Path" },
    {
      key: "added_time",
      header: "Added Time",
      render: value => value ? new Date(value).toLocaleString() : "N/A",
    },
    {
      key: "updated_time",
      header: "Updated Time",
      render: value => value ? new Date(value).toLocaleString() : "N/A",
    },
  ];

  // Handle station operations
  const handleAddStation = () => {
    setEditingStation(null);
    stationForm.reset();
    setStationModalOpen(true);
  };

  const handleEditStation = (station: StationRead) => {
    setEditingStation(station);
    stationForm.reset(station);
    setStationModalOpen(true);
  };

  const handleStationSubmit = async (data: StationCreate) => {
    if (editingStation) {
      await updateStationMutation.mutateAsync({ id: editingStation.station_id, data });
    }
    else {
      await createStationMutation.mutateAsync(data);
    }
    setStationModalOpen(false);
  };

  const handleDeleteStation = (station: StationRead) => {
    deleteStationMutation.mutate(station.station_id);
  };

  // Handle RainfallRecord operations
  const handleAddRecord = () => {
    setEditingRecord(null);
    recordForm.reset();
    setRecordModalOpen(true);
  };

  const handleEditRecord = (record: RainfallRecordRead) => {
    setEditingRecord(record);
    recordForm.reset({
      station_id: record.station_id,
      start_time: record.start_time,
      end_time: record.end_time,
      accumulated_rainfall: record.accumulated_rainfall,
      data_source: record.data_source,
    });
    setRecordModalOpen(true);
  };

  const handleRecordSubmit = async (data: RainfallRecordCreate) => {
    if (editingRecord) {
      await updateRecordMutation.mutateAsync({ id: editingRecord.station_id, data });
    }
    else {
      await createRecordMutation.mutateAsync(data);
    }
    setRecordModalOpen(false);
  };

  const handleDeleteRecord = (record: RainfallRecordRead) => {
    deleteRecordMutation.mutate(record.station_id);
  };

  // Handle S2SFile operations
  const handleAddFile = () => {
    setEditingFile(null);
    fileForm.reset();
    setFileModalOpen(true);
  };

  const handleEditFile = (file: S2SFileRead) => {
    setEditingFile(file);
    fileForm.reset({
      file_path: file.file_path,
    });
    setFileModalOpen(true);
  };

  const handleFileSubmit = async (data: S2SFileCreate) => {
    if (editingFile) {
      await updateFileMutation.mutateAsync({ id: editingFile.s2s_id, data });
    }
    else {
      await createFileMutation.mutateAsync(data);
    }
    setFileModalOpen(false);
  };

  const handleDeleteFile = (file: S2SFileRead) => {
    deleteFileMutation.mutate(file.s2s_id);
  };

  // Transform data for tables
  const stationsData = {
    rows: stationsQuery.data?.data || [],
    currentPage: stationsQuery.data?.meta.page || 1,
    totalItems: stationsQuery.data?.meta.total || 0,
    totalPages: stationsQuery.data?.meta.totalPages || 1,
  };

  const recordsData = {
    rows: recordsQuery.data?.data || [],
    currentPage: recordsQuery.data?.meta.page || 1,
    totalItems: recordsQuery.data?.meta.total || 0,
    totalPages: recordsQuery.data?.meta.totalPages || 1,
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
          <TabsTrigger value="stations">Stations</TabsTrigger>
          <TabsTrigger value="records">Rainfall Records</TabsTrigger>
          <TabsTrigger value="files">S2S Files</TabsTrigger>
        </TabsList>

        <TabsContent value="stations" className="mt-6">
          <DataTable
            data={stationsData}
            columns={stationColumns}
            tableState={stationsState}
            tableInput={stationsInput}
            onTableStateChange={changes => setStationsState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setStationsInput}
            onAdd={handleAddStation}
            onEdit={handleEditStation}
            onDelete={handleDeleteStation}
            addLabel="Add Station"
            emptyMessage="No stations found"
            showSearch={true}
            isLoading={stationsQuery.isLoading}
            getItemId={station => station.station_id.toString()}
          />
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <DataTable
            data={recordsData}
            columns={recordColumns}
            tableState={recordsState}
            tableInput={recordsInput}
            onTableStateChange={changes => setRecordsState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setRecordsInput}
            onAdd={handleAddRecord}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            addLabel="Add Record"
            emptyMessage="No rainfall records found"
            showSearch={true}
            isLoading={recordsQuery.isLoading}
            getItemId={record => record.station_id.toString()}
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
            emptyMessage="No S2S files found"
            showSearch={true}
            isLoading={filesQuery.isLoading}
            getItemId={file => file.s2s_id.toString()}
          />
        </TabsContent>
      </Tabs>

      {/* Station Form Modal */}
      <FormModal
        open={stationModalOpen}
        onOpenChange={setStationModalOpen}
        title={editingStation ? "Edit Station" : "Add Station"}
        form={stationForm}
        onSubmit={handleStationSubmit}
        isLoading={createStationMutation.isPending || updateStationMutation.isPending}
      >
        <FormField
          control={stationForm.control}
          name="station_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Station ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Station ID"
                  onChange={e => field.onChange(Number.parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stationForm.control}
          name="station_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Station Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Station name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stationForm.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="Province" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stationForm.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  placeholder="Latitude"
                  type="number"
                  step="any"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stationForm.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  placeholder="Longitude"
                  type="number"
                  step="any"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stationForm.control}
          name="elevation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Elevation (m)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  placeholder="Elevation in meters"
                  type="number"
                  step="any"
                  onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>

      {/* Rainfall Record Form Modal */}
      <FormModal
        open={recordModalOpen}
        onOpenChange={setRecordModalOpen}
        title={editingRecord ? "Edit Rainfall Record" : "Add Rainfall Record"}
        form={recordForm}
        onSubmit={handleRecordSubmit}
        isLoading={createRecordMutation.isPending || updateRecordMutation.isPending}
      >
        <FormField
          control={recordForm.control}
          name="station_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Station ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Station ID"
                  type="number"
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={recordForm.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Start time" type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={recordForm.control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="End time" type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={recordForm.control}
          name="accumulated_rainfall"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accumulated Rainfall (mm) *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Accumulated rainfall in mm"
                  type="number"
                  step="any"
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={recordForm.control}
          name="data_source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Source *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Data source (e.g. observation, forecast, analysis)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>

      {/* S2S File Form Modal */}
      <FormModal
        open={fileModalOpen}
        onOpenChange={setFileModalOpen}
        title={editingFile ? "Edit S2S File" : "Add S2S File"}
        form={fileForm}
        onSubmit={handleFileSubmit}
        isLoading={createFileMutation.isPending || updateFileMutation.isPending}
      >
        <FormField
          control={fileForm.control}
          name="s2s_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>S2S ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="S2S ID"
                  onChange={e => field.onChange(Number.parseInt(e.target.value) || 0)}
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
                <Input {...field} placeholder="File path" />
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
