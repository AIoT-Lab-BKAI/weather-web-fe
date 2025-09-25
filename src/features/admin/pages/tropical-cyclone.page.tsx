import { DataTable, TableColumn, TableState } from "@/components/shared/data-table";
import { FormModal } from "@/components/shared/form-modal";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { handleApiError } from "@/lib/error-handle";
import { stormsApi } from "@/services/apis/storms.api";
import {
  BestTrackFileRead,
  BestTrackFileUpdate,
  HRESDataRead,
  HRESDataCreate,
  HRESDataUpdate,
  NWPDataRead,
  NWPDataCreate,
  NWPDataUpdate,
  StormCreate,
  StormRead,
  StormUpdate,
  BestTrackFileUpload,
} from "@/types/storms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mdiDatabaseArrowRightOutline } from "@mdi/js";
import Icon from "@mdi/react";

// Form schemas
const stormSchema = z.object({
  storm_name: z.string().min(1, "Name is required"),
  storm_id: z.number().min(0, "Storm ID is required"),
});

const bestTrackSchema = z.object({
  storm_id: z.number().min(0, "Storm ID is required"),
  issued_time: z.string().min(1, "Issued time is required"),
  file_name: z.string().optional(),
  file: z.instanceof(File).optional(),
});

const nwpDataSchema = z.object({
  storm_id: z.number().min(0, "Storm ID is required"),
  nwp_path: z.string().min(1, "File is required"),
  file: z.instanceof(File).optional(),
  issued_time: z.string().min(1, "Issued time is required"),
});

const hresDataSchema = z.object({
  storm_id: z.number().min(0, "Storm ID is required"),
  hres_path: z.string().min(1, "File is required"),
  file: z.instanceof(File).optional(),
  issued_time: z.string().min(1, "Issued time is required"),
});

export function TropicalCyclonePage() {
  const [activeTab, setActiveTab] = useState("storms");
  const queryClient = useQueryClient();

  // States for each tab
  const [stormsState, setStormsState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [stormsInput, setStormsInput] = useState({ search: "" });

  const [bestTrackState, setBestTrackState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [bestTrackInput, setBestTrackInput] = useState({ search: "" });

  const [nwpState, setNwpState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [nwpInput, setNwpInput] = useState({ search: "" });

  const [hresState, setHresState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [hresInput, setHresInput] = useState({ search: "" });

  // Modal states
  const [stormModalOpen, setStormModalOpen] = useState(false);
  const [bestTrackModalOpen, setBestTrackModalOpen] = useState(false);
  const [nwpModalOpen, setNwpModalOpen] = useState(false);
  const [hresModalOpen, setHresModalOpen] = useState(false);

  // Edit states
  const [editingStorm, setEditingStorm] = useState<StormRead | null>(null);
  const [editingBestTrack, setEditingBestTrack] = useState<BestTrackFileRead | null>(null);
  const [editingNwp, setEditingNwp] = useState<NWPDataRead | null>(null);
  const [editingHres, setEditingHres] = useState<HRESDataRead | null>(null);
  const [_selectedBestTrackFile, setSelectedBestTrackFile] = useState<File | null>(null);
  const [_selectedNwpFile, setSelectedNwpFile] = useState<File | null>(null);
  const [_selectedHresFile, setSelectedHresFile] = useState<File | null>(null);

  // Forms
  const stormForm = useForm<StormCreate>({
    resolver: zodResolver(stormSchema),
    defaultValues: {
      storm_name: "",
      storm_id: 0,
    },
  });

  const bestTrackForm = useForm<BestTrackFileUpload>({
    resolver: zodResolver(bestTrackSchema),
    defaultValues: {
      storm_id: 0,
      issued_time: "",
      file_name: "",
      file: undefined,
    },
  });

  const nwpForm = useForm<NWPDataCreate & { file?: File }>({
    resolver: zodResolver(nwpDataSchema),
    defaultValues: {
      storm_id: 0,
      nwp_path: "",
      file: undefined,
      issued_time: "",
    },
  });

  const hresForm = useForm<HRESDataCreate & { file?: File }>({
    resolver: zodResolver(hresDataSchema),
    defaultValues: {
      storm_id: 0,
      hres_path: "",
      file: undefined,
      issued_time: "",
    },
  });

  // Queries
  const stormsQuery = useQuery({
    queryKey: ["storms", stormsState],
    queryFn: () => stormsApi.storms.list({
      page: stormsState.page,
      limit: stormsState.itemsPerPage,
      search: stormsState.search,
    }),
  });

  const bestTrackQuery = useQuery({
    queryKey: ["besttrack-files", bestTrackState],
    queryFn: () => stormsApi.bestTrackFiles.list({
      page: bestTrackState.page,
      limit: bestTrackState.itemsPerPage,
      search: bestTrackState.search,
    }),
  });

  const nwpQuery = useQuery({
    queryKey: ["nwp-data", nwpState],
    queryFn: () => stormsApi.nwpData.list({
      page: nwpState.page,
      limit: nwpState.itemsPerPage,
      search: nwpState.search,
    }),
  });

  const hresQuery = useQuery({
    queryKey: ["hres-data", hresState],
    queryFn: () => stormsApi.hresData.list({
      page: hresState.page,
      limit: hresState.itemsPerPage,
      search: hresState.search,
    }),
  });

  // Mutations
  const createStormMutation = useMutation({
    mutationFn: stormsApi.storms.create,
    onSuccess: () => {
      notification.success({ message: "Storm created successfully" });
      queryClient.invalidateQueries({ queryKey: ["storms"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create storm" }),
  });

  const updateStormMutation = useMutation({
    mutationFn: ({ storm_id, data }: { storm_id: number; data: StormUpdate }) =>
      stormsApi.storms.update(storm_id, data),
    onSuccess: () => {
      notification.success({ message: "Storm updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["storms"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update storm" }),
  });

  const deleteStormMutation = useMutation({
    mutationFn: stormsApi.storms.delete,
    onSuccess: () => {
      notification.success({ message: "Storm deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["storms"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete storm" }),
  });

  // BestTrack mutations
  const createBestTrackMutation = useMutation({
    mutationFn: stormsApi.bestTrackFiles.create,
    onSuccess: () => {
      notification.success({ message: "BestTrack file created successfully" });
      queryClient.invalidateQueries({ queryKey: ["besttrack-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create BestTrack file" }),
  });

  const updateBestTrackMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BestTrackFileUpdate }) =>
      stormsApi.bestTrackFiles.update(id, data),
    onSuccess: () => {
      notification.success({ message: "BestTrack file updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["besttrack-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update BestTrack file" }),
  });

  const deleteBestTrackMutation = useMutation({
    mutationFn: stormsApi.bestTrackFiles.delete,
    onSuccess: () => {
      notification.success({ message: "BestTrack file deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["besttrack-files"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete BestTrack file" }),
  });

  // NWP mutations
  const createNwpMutation = useMutation({
    mutationFn: stormsApi.nwpData.create,
    onSuccess: () => {
      notification.success({ message: "NWP data created successfully" });
      queryClient.invalidateQueries({ queryKey: ["nwp-data"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create NWP data" }),
  });

  const updateNwpMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NWPDataUpdate }) =>
      stormsApi.nwpData.update(id, data),
    onSuccess: () => {
      notification.success({ message: "NWP data updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["nwp-data"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update NWP data" }),
  });

  const deleteNwpMutation = useMutation({
    mutationFn: stormsApi.nwpData.delete,
    onSuccess: () => {
      notification.success({ message: "NWP data deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["nwp-data"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete NWP data" }),
  });

  // HRES mutations
  const createHresMutation = useMutation({
    mutationFn: stormsApi.hresData.create,
    onSuccess: () => {
      notification.success({ message: "HRES data created successfully" });
      queryClient.invalidateQueries({ queryKey: ["hres-data"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to create HRES data" }),
  });

  const updateHresMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: HRESDataUpdate }) =>
      stormsApi.hresData.update(id, data),
    onSuccess: () => {
      notification.success({ message: "HRES data updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["hres-data"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to update HRES data" }),
  });

  const deleteHresMutation = useMutation({
    mutationFn: stormsApi.hresData.delete,
    onSuccess: () => {
      notification.success({ message: "HRES data deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["hres-data"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to delete HRES data" }),
  });

  const runStormMutation = useMutation({
    mutationFn: stormsApi.runStorm.run,
    onSuccess: () => {
      notification.success({ message: "Storm pipeline run successfully" });
      queryClient.invalidateQueries({ queryKey: ["storms"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to run storm" }),
  });

  // Handle errors
  useEffect(() => {
    if (stormsQuery.isError) {
      handleApiError(stormsQuery.error, { customMessage: "Failed to load storms" });
    }
    if (bestTrackQuery.isError) {
      handleApiError(bestTrackQuery.error, { customMessage: "Failed to load best track files" });
    }
    if (nwpQuery.isError) {
      handleApiError(nwpQuery.error, { customMessage: "Failed to load NWP data" });
    }
    if (hresQuery.isError) {
      handleApiError(hresQuery.error, { customMessage: "Failed to load HRES data" });
    }
  }, [stormsQuery.isError, stormsQuery.error, bestTrackQuery.isError, bestTrackQuery.error, nwpQuery.isError, nwpQuery.error, hresQuery.isError, hresQuery.error]);

  // Storm columns
  const stormColumns: TableColumn<StormRead>[] = [
    { key: "storm_name", header: "Name" },
    { key: "storm_id", header: "Storm ID" },
    {
      key: "created_at",
      header: "Created",
      render: value => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  // BestTrack file columns
  const bestTrackColumns: TableColumn<BestTrackFileRead>[] = [
    { key: "file_name", header: "File Name" },
    { key: "storm_id", header: "Storm ID" },
    { key: "issued_time", header: "Issued Time" },
    {
      key: "created_at",
      header: "Created",
      render: value => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  // NWP data columns
  const nwpColumns: TableColumn<NWPDataRead>[] = [
    { key: "nwp_path", header: "NWP Path" },
    { key: "storm_id", header: "Storm ID" },
    { key: "issued_time", header: "Issued Time" },
    {
      key: "created_at",
      header: "Created",
      render: value => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  // HRES data columns
  const hresColumns: TableColumn<HRESDataRead>[] = [
    { key: "hres_path", header: "HRES Path" },
    { key: "storm_id", header: "Storm ID" },
    { key: "issued_time", header: "Issued Time" },
    {
      key: "created_at",
      header: "Created",
      render: value => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  // Handle storm operations
  const handleAddStorm = () => {
    setEditingStorm(null);
    stormForm.reset();
    setStormModalOpen(true);
  };

  const handleEditStorm = (storm: StormRead) => {
    setEditingStorm(storm);
    stormForm.reset(storm);
    setStormModalOpen(true);
  };

  const handleStormSubmit = async (data: StormCreate) => {
    if (editingStorm) {
      await updateStormMutation.mutateAsync({ storm_id: editingStorm.storm_id, data });
    }
    else {
      await createStormMutation.mutateAsync(data);
    }
  };

  const handleDeleteStorm = (storm: StormRead) => {
    deleteStormMutation.mutate(storm.storm_id);
  };

  // Handle BestTrack operations
  const handleAddBestTrack = () => {
    setEditingBestTrack(null);
    setSelectedBestTrackFile(null);
    bestTrackForm.reset({
      storm_id: 0,
      issued_time: "",
      file_name: "",
      file: undefined,
    });
    setBestTrackModalOpen(true);
  };

  const handleEditBestTrack = (file: BestTrackFileRead) => {
    setEditingBestTrack(file);
    setSelectedBestTrackFile(null);
    bestTrackForm.reset({
      storm_id: file.storm_id,
      issued_time: file.issued_time,
      file_name: file.file_name,
      file: undefined,
    });
    setBestTrackModalOpen(true);
  };

  const handleBestTrackSubmit = async (data: BestTrackFileUpload) => {
    // Remove the file from data before sending to API
    const { file, ...apiData } = data;

    if (editingBestTrack && editingBestTrack.id) {
      await updateBestTrackMutation.mutateAsync({ id: editingBestTrack.id, data: apiData });
    }
    else {
      await createBestTrackMutation.mutateAsync(data);
    }
    setBestTrackModalOpen(false);
    setSelectedBestTrackFile(null);
  };

  const handleDeleteBestTrack = (file: BestTrackFileRead) => {
    if (file.id) {
      deleteBestTrackMutation.mutate(file.id);
    }
  };

  // Handle NWP operations
  const handleAddNwp = () => {
    setEditingNwp(null);
    setSelectedNwpFile(null);
    nwpForm.reset({
      storm_id: 0,
      nwp_path: "",
      file: undefined,
      issued_time: "",
    });
    setNwpModalOpen(true);
  };

  const handleEditNwp = (data: NWPDataRead) => {
    setEditingNwp(data);
    setSelectedNwpFile(null);
    nwpForm.reset({
      storm_id: data.storm_id,
      nwp_path: data.nwp_path,
      file: undefined,
      issued_time: data.issued_time,
    });
    setNwpModalOpen(true);
  };

  const handleNwpSubmit = async (data: NWPDataCreate & { file?: File }) => {
    // If a file is selected, use the file name as the nwp_path
    if (data.file) {
      data.nwp_path = data.file.name;
    }

    // Remove the file from data before sending to API
    const { file, ...apiData } = data;

    if (editingNwp && editingNwp.id) {
      await updateNwpMutation.mutateAsync({ id: editingNwp.id, data: apiData });
    }
    else {
      await createNwpMutation.mutateAsync(apiData);
    }
    setNwpModalOpen(false);
    setSelectedNwpFile(null);
  };

  const handleDeleteNwp = (data: NWPDataRead) => {
    if (data.id) {
      deleteNwpMutation.mutate(data.id);
    }
  };

  // Handle HRES operations
  const handleAddHres = () => {
    setEditingHres(null);
    setSelectedHresFile(null);
    hresForm.reset({
      storm_id: 0,
      hres_path: "",
      file: undefined,
      issued_time: "",
    });
    setHresModalOpen(true);
  };

  const handleEditHres = (data: HRESDataRead) => {
    setEditingHres(data);
    setSelectedHresFile(null);
    hresForm.reset({
      storm_id: data.storm_id,
      hres_path: data.hres_path,
      file: undefined,
      issued_time: data.issued_time,
    });
    setHresModalOpen(true);
  };

  const handleHresSubmit = async (data: HRESDataCreate & { file?: File }) => {
    // If a file is selected, use the file name as the hres_path
    if (data.file) {
      data.hres_path = data.file.name;
    }

    // Remove the file from data before sending to API
    const { file, ...apiData } = data;

    if (editingHres && editingHres.id) {
      await updateHresMutation.mutateAsync({ id: editingHres.id, data: apiData });
    }
    else {
      await createHresMutation.mutateAsync(data);
    }
    setHresModalOpen(false);
    setSelectedHresFile(null);
  };

  const handleDeleteHres = (data: HRESDataRead) => {
    if (data.id) {
      deleteHresMutation.mutate(data.id);
    }
  };

  // Transform data for tables
  const stormsData = {
    rows: stormsQuery.data?.data || [],
    currentPage: stormsQuery.data?.meta.page || 1,
    totalItems: stormsQuery.data?.meta.total || 0,
    totalPages: stormsQuery.data?.meta.totalPages || 1,
  };

  const bestTrackData = {
    rows: bestTrackQuery.data?.data || [],
    currentPage: bestTrackQuery.data?.meta.page || 1,
    totalItems: bestTrackQuery.data?.meta.total || 0,
    totalPages: bestTrackQuery.data?.meta.totalPages || 1,
  };

  const nwpData = {
    rows: nwpQuery.data?.data || [],
    currentPage: nwpQuery.data?.meta.page || 1,
    totalItems: nwpQuery.data?.meta.total || 0,
    totalPages: nwpQuery.data?.meta.totalPages || 1,
  };

  const hresData = {
    rows: hresQuery.data?.data || [],
    currentPage: hresQuery.data?.meta.page || 1,
    totalItems: hresQuery.data?.meta.total || 0,
    totalPages: hresQuery.data?.meta.totalPages || 1,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="storms">Storms</TabsTrigger>
          <TabsTrigger value="besttrack">BestTrack Files</TabsTrigger>
          <TabsTrigger value="nwp">NWP Data</TabsTrigger>
          <TabsTrigger value="hres">HRES Data</TabsTrigger>
        </TabsList>

        <TabsContent value="storms" className="mt-6">
          <DataTable
            data={stormsData}
            columns={stormColumns}
            tableState={stormsState}
            tableInput={stormsInput}
            onTableStateChange={changes => setStormsState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setStormsInput}
            onAdd={handleAddStorm}
            onEdit={handleEditStorm}
            onDelete={handleDeleteStorm}
            addLabel="Add Storm"
            emptyMessage="No storms found"
            showSearch={true}
            isLoading={stormsQuery.isLoading}
            getItemId={storm => storm.storm_id.toString()}
            actions={[{
              label: "Run",
              icon: <Icon path={mdiDatabaseArrowRightOutline} size={1} className="text-main" />,
              onClick: (storm) => {
                notification.info({ message: `Running storm pipeline: ${storm.storm_name}` });
                runStormMutation.mutate(storm.storm_id);
              },
            }]}
          />
        </TabsContent>

        <TabsContent value="besttrack" className="mt-6">
          <DataTable
            data={bestTrackData}
            columns={bestTrackColumns}
            tableState={bestTrackState}
            tableInput={bestTrackInput}
            onTableStateChange={changes => setBestTrackState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setBestTrackInput}
            onAdd={handleAddBestTrack}
            onEdit={handleEditBestTrack}
            onDelete={handleDeleteBestTrack}
            addLabel="Add BestTrack File"
            emptyMessage="No best track files found"
            showSearch={true}
            isLoading={bestTrackQuery.isLoading}
            getItemId={file => file.id || ""}
          />
        </TabsContent>

        <TabsContent value="nwp" className="mt-6">
          <DataTable
            data={nwpData}
            columns={nwpColumns}
            tableState={nwpState}
            tableInput={nwpInput}
            onTableStateChange={changes => setNwpState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setNwpInput}
            onAdd={handleAddNwp}
            onEdit={handleEditNwp}
            onDelete={handleDeleteNwp}
            addLabel="Add NWP Data"
            emptyMessage="No NWP data found"
            showSearch={true}
            isLoading={nwpQuery.isLoading}
            getItemId={data => data.id || ""}
          />
        </TabsContent>

        <TabsContent value="hres" className="mt-6">
          <DataTable
            data={hresData}
            columns={hresColumns}
            tableState={hresState}
            tableInput={hresInput}
            onTableStateChange={changes => setHresState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={setHresInput}
            onAdd={handleAddHres}
            onEdit={handleEditHres}
            onDelete={handleDeleteHres}
            addLabel="Add HRES Data"
            emptyMessage="No HRES data found"
            showSearch={true}
            isLoading={hresQuery.isLoading}
            getItemId={data => data.id || ""}
          />
        </TabsContent>
      </Tabs>

      {/* Storm Form Modal */}
      <FormModal
        open={stormModalOpen}
        onOpenChange={setStormModalOpen}
        title={editingStorm ? "Edit Storm" : "Add Storm"}
        form={stormForm}
        onSubmit={handleStormSubmit}
        isLoading={createStormMutation.isPending || updateStormMutation.isPending}
      >
        <FormField
          control={stormForm.control}
          name="storm_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Storm name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stormForm.control}
          name="storm_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storm ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Storm ID"
                  type="number"
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>

      {/* BestTrack Form Modal */}
      <FormModal
        open={bestTrackModalOpen}
        onOpenChange={setBestTrackModalOpen}
        title={editingBestTrack ? "Edit BestTrack File" : "Add BestTrack File"}
        form={bestTrackForm}
        onSubmit={handleBestTrackSubmit}
        isLoading={createBestTrackMutation.isPending || updateBestTrackMutation.isPending}
      >
        <FormField
          control={bestTrackForm.control}
          name="storm_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storm ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Storm ID"
                  type="number"
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={bestTrackForm.control}
          name="issued_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issued Time *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Issued time" type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={bestTrackForm.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload File *</FormLabel>
              <FormControl>
                <FileUpload
                  onChange={(file) => {
                    field.onChange(file);
                    setSelectedBestTrackFile(file);
                    // Update file_name when file is selected
                    if (file) {
                      bestTrackForm.setValue("file_name", file.name);
                    }
                  }}
                  currentFileName={editingBestTrack?.file_name}
                  acceptedFileTypes="*/*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>

      {/* NWP Form Modal */}
      <FormModal
        open={nwpModalOpen}
        onOpenChange={setNwpModalOpen}
        title={editingNwp ? "Edit NWP Data" : "Add NWP Data"}
        form={nwpForm}
        onSubmit={handleNwpSubmit}
        isLoading={createNwpMutation.isPending || updateNwpMutation.isPending}
      >
        <FormField
          control={nwpForm.control}
          name="storm_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storm ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Storm ID"
                  type="number"
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={nwpForm.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload NWP File *</FormLabel>
              <FormControl>
                <FileUpload
                  onChange={(file) => {
                    field.onChange(file);
                    setSelectedNwpFile(file);
                    // Update nwp_path when file is selected
                    if (file) {
                      nwpForm.setValue("nwp_path", file.name);
                    }
                  }}
                  currentFileName={editingNwp?.nwp_path}
                  acceptedFileTypes="*/*"
                  maxFileSize={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={nwpForm.control}
          name="issued_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issued Time *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Issued time" type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>

      {/* HRES Form Modal */}
      <FormModal
        open={hresModalOpen}
        onOpenChange={setHresModalOpen}
        title={editingHres ? "Edit HRES Data" : "Add HRES Data"}
        form={hresForm}
        onSubmit={handleHresSubmit}
        isLoading={createHresMutation.isPending || updateHresMutation.isPending}
      >
        <FormField
          control={hresForm.control}
          name="storm_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storm ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Storm ID"
                  type="number"
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={hresForm.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload HRES File *</FormLabel>
              <FormControl>
                <FileUpload
                  onChange={(file) => {
                    field.onChange(file);
                    setSelectedHresFile(file);
                    // Update hres_path when file is selected
                    if (file) {
                      hresForm.setValue("hres_path", file.name);
                    }
                  }}
                  currentFileName={editingHres?.hres_path}
                  acceptedFileTypes="*/*"
                  maxFileSize={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={hresForm.control}
          name="issued_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issued Time *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Issued time" type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormModal>
    </div>
  );
}
