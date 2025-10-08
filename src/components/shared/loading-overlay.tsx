import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingOverlayProps {
  message?: string;
  size?: "small" | "default" | "large";
}

export function LoadingOverlay({ message = "Loading...", size = "large" }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: size === "large" ? 48 : size === "default" ? 32 : 24 }} spin />}
        size={size}
      />
      {message && <p className="mt-4 text-gray-600 font-medium">{message}</p>}
    </div>
  );
}

interface MapLoadingOverlayProps {
  message?: string;
}

export function MapLoadingOverlay({ message = "Loading map data..." }: MapLoadingOverlayProps) {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
      <Spin size="small" />
      <span className="text-gray-700 font-medium">{message}</span>
    </div>
  );
}
