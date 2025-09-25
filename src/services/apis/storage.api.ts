import { apiService } from "@/services/api.service";
import { StorageUploadRequest, StorageUploadResponse } from "@/types/storage";

export const storageApi = {
  upload: async (data: StorageUploadRequest): Promise<StorageUploadResponse> => {
    // Create FormData for file upload
    const formData = new FormData();

    // Add the file
    formData.append("file", data.file);

    // Add data type
    formData.append("data_type", data.data_type);

    // Add optional path field if provided
    if (data.path !== undefined && data.path !== null) {
      formData.append("path", data.path);
    }

    // Add storm-specific fields
    if (data.storm_id !== undefined) {
      formData.append("storm_id", data.storm_id.toString());
    }
    if (data.issued_date !== undefined) {
      formData.append("issued_date", data.issued_date);
    }

    // Add reservoir-specific fields
    if (data.reservoir_id !== undefined) {
      formData.append("reservoir_id", data.reservoir_id.toString());
    }
    if (data.from_time !== undefined) {
      formData.append("from_time", data.from_time);
    }
    if (data.to_time !== undefined) {
      formData.append("to_time", data.to_time);
    }

    // Add precipitation-specific fields
    if (data.s2s_id !== undefined) {
      formData.append("s2s_id", data.s2s_id.toString());
    }
    if (data.added_time !== undefined) {
      formData.append("added_time", data.added_time);
    }

    return apiService.post<StorageUploadResponse>("/storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
