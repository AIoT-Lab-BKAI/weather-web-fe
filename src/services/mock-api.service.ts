/* eslint-disable prefer-promise-reject-errors */
import axios from "axios";

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

  // Mock tropical cyclone files endpoint
  if (config.url?.includes("/tropical-cyclone-files") && config.method === "get") {
    // Generate mock data
    const mockData = [
      {
        id: "1",
        name: "Cyclone_2024_01.nc",
        modifiedAt: "2024-03-15 14:30:00",
        modifiedBy: "John Doe",
        fileSize: "2.5 MB",
        createdAt: "2024-03-15 14:30:00",
      },
      {
        id: "2",
        name: "Typhoon_Maria_Track.kml",
        modifiedAt: "2024-03-14 10:15:00",
        modifiedBy: "Jane Smith",
        fileSize: "1.8 MB",
        createdAt: "2024-03-14 10:15:00",
      },
      {
        id: "3",
        name: "Hurricane_Forecast_2024.csv",
        modifiedAt: "2024-03-13 16:45:00",
        modifiedBy: "Mike Johnson",
        fileSize: "3.2 MB",
        createdAt: "2024-03-13 16:45:00",
      },
      {
        id: "4",
        name: "Storm_Analysis_Report.pdf",
        modifiedAt: "2024-03-12 09:20:00",
        modifiedBy: "Sarah Wilson",
        fileSize: "5.1 MB",
        createdAt: "2024-03-12 09:20:00",
      },
      {
        id: "5",
        name: "Cyclone_Intensity_Data.xlsx",
        modifiedAt: "2024-03-11 13:55:00",
        modifiedBy: "David Brown",
        fileSize: "4.7 MB",
        createdAt: "2024-03-11 13:55:00",
      },
    ];

    // Apply search filter if provided
    const searchParam = config.params?.search;
    let filteredData = mockData;
    if (searchParam) {
      filteredData = mockData.filter(item =>
        item.name.toLowerCase().includes(searchParam.toLowerCase())
        || item.modifiedBy.toLowerCase().includes(searchParam.toLowerCase()),
      );
    }

    // Apply pagination
    const page = config.params?.page || 1;
    const limit = config.params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const mockResponse = {
      data: paginatedData,
      meta: {
        page,
        perPage: limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    };

    // Return a resolved promise with mock data
    return Promise.reject({
      isMock: true,
      config,
      response: {
        data: mockResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      },
    });
  }

  // Mock delete endpoint for tropical cyclone files
  if (config.url?.includes("/tropical-cyclone-files/delete") && config.method === "delete") {
    // Simulate successful deletion
    return Promise.reject({
      isMock: true,
      config,
      response: {
        data: { message: "File deleted successfully" },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      },
    });
  }

  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  (err) => {
    if (err.isMock && err.response) {
      return Promise.resolve(err.response);
    }
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    const apiError: IApiError = {
      message: error.message,
    };

    if (error.response) {
      const { status, data } = error.response;
      apiError.status = status;
      apiError.message = data?.message ?? error.message;
      apiError.data = data;
    }
    else if (error.code === "ERR_NETWORK") {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  },
);

export const mockApiService = new ApiService(axiosInstance);
