import { Marker } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import Icon from "@mdi/react";
import { mdiWaterOutline } from "@mdi/js";
import { StationInfoPanel } from "../components/station-info-panel";
import ReactDOM from "react-dom";
import { ChartData, LevelData, StationInfo } from "../types";
import { useLayoutContext } from "../layout";

const mockStations: StationInfo[] = [
  {
    id: 1,
    name: "Hồ Hòa Bình",
    details: "Lat: 20.8, Lon: 105.3, Alt: 120m",
    lat: 20.81,
    lng: 105.33,
  },
  {
    id: 2,
    name: "Hồ Thác Bà",
    details: "Lat: 21.8, Lon: 105.0, Alt: 58m",
    lat: 21.8,
    lng: 105.02,
  },
  {
    id: 3,
    name: "Hồ Tuyên Quang",
    details: "Lat: 22.3, Lon: 105.3, Alt: 120m",
    lat: 22.35,
    lng: 105.39,
  },
  {
    id: 4,
    name: "Trạm Thanh Hóa",
    details: "Lat: 19.8, Lon: 105.7, Alt: 10m",
    lat: 19.8,
    lng: 105.78,
  },
];

const waterLevelData: ChartData[] = [
  { label: "Ngày 1", value: 56 },
  { label: "Ngày 2", value: 64 },
  { label: "Ngày 3", value: 76 },
  { label: "Ngày 4", value: 78 },
  { label: "Ngày 5", value: 70 },
  { label: "Ngày 6", value: 37 },
  { label: "Ngày 7", value: 37 },
];

const dischargeData: ChartData[] = [
  { label: "Ngày 1", value: 56 },
  { label: "Ngày 2", value: 64 },
  { label: "Ngày 3", value: 76 },
  { label: "Ngày 4", value: 78 },
  { label: "Ngày 5", value: 70 },
  { label: "Ngày 6", value: 37 },
  { label: "Ngày 7", value: 37 },
];

const levelData: LevelData[] = [
  {
    title: "Dự báo mực nước trong 7 ngày tới",
    data: waterLevelData,
    color: "#0088FF",
  },
  {
    title: "Dự báo lượng nước xả trong 7 ngày tới",
    data: dischargeData,
    color: "#00C0E8",
  },
];

const createLevelIcon = () => {
  const iconHtml = ReactDOMServer.renderToString(
    <Icon path={mdiWaterOutline} size={0.8} color="white" />
  );
  return L.divIcon({
    html: `
      <div style="
        background-color: #0088FF;
        width: 28px;
        height: 28px;
        border-radius: 100% 100% 100% 0;
        transform: rotate(-45deg);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <div style="transform: rotate(45deg);">${iconHtml}</div>
      </div>
    `,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export function LevelPage() {
  const { selectedStation, setSelectedStation } = useLayoutContext();

  const handleMarkerClick = (station: StationInfo) => {
    setSelectedStation(station);
  };

  const handlePanelClose = () => {
    setSelectedStation(null);
  };

  return (
    <>
      {mockStations.map((station) => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={createLevelIcon()}
          eventHandlers={{
            click: () => handleMarkerClick(station),
          }}
        />
      ))}

      {ReactDOM.createPortal(
        <div
          className={`
            absolute bottom-4 right-4
            ${selectedStation ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <StationInfoPanel
            station={selectedStation}
            levelData={levelData}
            onClose={handlePanelClose}
          />
        </div>,
        document.body
      )}
    </>
  );
}
