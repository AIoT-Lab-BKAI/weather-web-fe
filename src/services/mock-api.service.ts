import axios from "axios";

import { DEFAULT_API_ERROR, DEFAULT_API_ERROR_STATUS } from "@/constants/error.constant";
import { LS_KEY_ACCESS_TOKEN } from "@/constants/ls-key.constant";
import { ApiService } from "./api.service";

const axiosInstance = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface IApiError {
  message: string;
  status?: number;
  data?: any;
}

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LS_KEY_ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    const apiError: IApiError = {
      ...DEFAULT_API_ERROR,
      message: error.message,
    };

    if (error.response) {
      const { status, data } = error.response;
      apiError.status = status;
      apiError.message
        = data?.message
          ?? DEFAULT_API_ERROR_STATUS[status]?.message
          ?? error.message;
      apiError.data = data;
    }
    else if (error.code === "ERR_NETWORK") {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  },
);

export const mockApiService = new ApiService(axiosInstance);
