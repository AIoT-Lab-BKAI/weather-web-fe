import { notification } from "antd";
import { AxiosError } from "axios";

interface HandleErrorOptions {
  customMessage?: string; // Custom title to override default
  fallbackMessage?: string; // Used if no server message is available
  notify?: boolean; // Default true: show notification
  silent?: boolean; // Skip all handling if true
  onHandled?: () => void; // Callback after handling
  skipGlobal?: boolean; // Skip built-in handling for 401/403/500
}

export function handleApiError(
  error: unknown,
  options: HandleErrorOptions = {},
): void {
  const {
    customMessage,
    fallbackMessage = "An unexpected error occurred. Please try again.",
    notify = true,
    silent = false,
    onHandled,
    skipGlobal = false,
  } = options;

  if (silent)
    return;

  let message = "";
  let description = "";

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message || error.message;

    // Default global handling unless skipped
    if (!skipGlobal && status) {
      if (status === 401) {
        message = "Unauthorized";
        description = "Your session has expired. Please log in again.";
      }
      else if (status === 403) {
        message = "Access Denied";
        description = "You do not have permission to perform this action.";
      }
      else if (status >= 500) {
        message = "Server Error";
        description = "Something went wrong on our end. Please try again later.";
      }
    }

    if (!message) {
      message = customMessage || "Error";
      description = serverMessage || fallbackMessage;
    }
  }
  else {
    message = customMessage || "Unexpected Error";
    description = fallbackMessage;
  }

  if (notify) {
    notification.error({
      message,
      description,
      key: message + description,
    });
  }

  onHandled?.();
}
