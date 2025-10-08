import { notification } from "antd";
import type { NotificationArgsProps } from "antd";

type NotificationPlacement = NotificationArgsProps["placement"];

interface NotificationOptions {
  message: string;
  description?: string;
  duration?: number;
  placement?: NotificationPlacement;
}

export const showNotification = {
  success: ({ message, description, duration = 4.5, placement = "topRight" }: NotificationOptions) => {
    notification.success({
      message,
      description,
      duration,
      placement,
    });
  },

  error: ({ message, description, duration = 4.5, placement = "topRight" }: NotificationOptions) => {
    notification.error({
      message,
      description,
      duration,
      placement,
    });
  },

  info: ({ message, description, duration = 4.5, placement = "topRight" }: NotificationOptions) => {
    notification.info({
      message,
      description,
      duration,
      placement,
    });
  },

  warning: ({ message, description, duration = 4.5, placement = "topRight" }: NotificationOptions) => {
    notification.warning({
      message,
      description,
      duration,
      placement,
    });
  },
};
