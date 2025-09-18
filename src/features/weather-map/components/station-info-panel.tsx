import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { ForecastChart } from "./customized/forecast-chart";
import { LevelData, StationInfo } from "../types";

interface StationInfoPanelProps {
  station: StationInfo | null;
  levelData: LevelData[];
  onClose: () => void;
}

export function StationInfoPanel({
  station,
  levelData,
  onClose,
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
        {levelData.map((data, index) => (
          <ForecastChart
            key={index}
            title={data.title}
            data={data.data}
            color={data.color}
          />
        ))}
      </div>
    </div>
  );
}
