import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { Spin } from "antd";
import { ForecastChart } from "./customized/forecast-chart";
import { LevelData, StationInfo } from "../types";

interface StationInfoPanelProps {
  station: StationInfo | null;
  levelData: LevelData[];
  onClose: () => void;
  isLoading?: boolean;
}

export function StationInfoPanel({
  station,
  levelData,
  onClose,
  isLoading = false,
}: StationInfoPanelProps) {
  if (!station) {
    return null;
  }

  return (
    <div
      className="p-4 flex flex-col gap-2 bg-white/70 backdrop-blur-sm shadow-2xl rounded-2xl"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-medium text-black">{station.name}</h2>
          <p className="text-base text-black/80 mt-4">{station.details}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-colors"
        >
          <Icon path={mdiClose} size={1} className="text-black" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {isLoading
          ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <Spin size="large" />
                <p className="text-gray-600">Đang tải dữ liệu dự báo...</p>
              </div>
            )
          : levelData.length > 0
            ? (
                levelData.map((data, index) => (
                  <ForecastChart
                    key={index}
                    title={data.title}
                    data={data.data}
                    color={data.color}
                  />
                ))
              )
            : (
                <div className="text-center py-8 text-gray-500">
                  Không có dữ liệu dự báo
                </div>
              )}
      </div>
    </div>
  );
}
