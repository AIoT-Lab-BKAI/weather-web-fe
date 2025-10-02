import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { env } from "@/config/env.client";
import { LS_KEY_ACCESS_TOKEN } from "@/constants/ls-key.constant";
import { PaginatedResult } from "@/types/interfaces/pagination";

const axiosInstance = axios.create({
  baseURL: env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: null, // This will serialize arrays as: storm_ids=1&storm_ids=2
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

export class ApiService {
  constructor(protected axiosInstance: AxiosInstance) { }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const data = await this.extractDataFromResponse(this.axiosInstance.get<T>(url, config));
    if (this.isPaginatedResponse(data)) {
      return this.extractPaginationMetaFromResponse(data) as T;
    }
    return data;
  }

  async post<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.post<T>(url, data, config));
  }

  async patch<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.patch<T>(url, data, config));
  }

  async put<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.put<T>(url, data, config));
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.delete<T>(url, config));
  }

  private async extractDataFromResponse<T>(responsePromise: Promise<AxiosResponse<T>>): Promise<T> {
    const { data } = await responsePromise;
    return data;
  }

  private isPaginatedResponse(data: any): data is PaginatedResult {
    return data !== null
      && typeof data === "object"
      && !Array.isArray(data)
      && "page" in data
      && "itemsPerPage" in data
      && "total" in data
      && "items" in data;
  }

  private extractPaginationMetaFromResponse(data: any): PaginatedResult {
    const { page, itemsPerPage, total, items } = data;
    const totalPages = Math.ceil(total / itemsPerPage);
    return {
      meta: {
        page,
        total,
        totalPages,
      },
      data: items,
    };
  }
}

export const apiService = new ApiService(axiosInstance);
