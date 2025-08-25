import { IApiError } from "@/services/api.service";

export const DEFAULT_API_ERROR: IApiError = {
  message: "Something went wrong",
};

export const DEFAULT_API_ERROR_STATUS: { [key: number]: IApiError } = {
  502: {
    message: "Bad gateway",
  },
  500: {
    message: "Internal server error",
  },
  404: {
    message: "Not found",
  },
  403: {
    message: "Forbidden",
  },
  401: {
    message: "Unauthorized",
  },
  400: {
    message: "Bad request",
  },
};
