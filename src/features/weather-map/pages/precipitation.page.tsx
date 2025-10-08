import { mdiWeatherPouring } from "@mdi/js";
import Icon from "@mdi/react";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";
import { MapLoadingOverlay } from "@/components/shared/loading-overlay";
import { showNotification } from "@/lib/notification";
import { RainfallRecordRead, StationRead } from "@/types/precipitation";
import { StationInfoPanel } from "../components/station-info-panel";
import { useWeatherMapStore } from "../store";
import {
  useStations,
  useAllStationsRainfallRecords,
  useStationRainfallRecords,
} from "../hooks/use-precipitation-data";
import { ChartData, LevelData, StationInfo } from "../types";

// Transform API station data to StationInfo format
function transformStationData(apiStations: StationRead[]): StationInfo[] {
  return apiStations
    .filter(station => station.latitude && station.longitude) // Only include stations with coordinates
    .map(station => ({
      id: station.station_id,
      name: station.station_name,
      details: `Lat: ${station.latitude}, Lon: ${station.longitude}${station.elevation ? `, Alt: ${station.elevation}m` : ""}`,
      lat: station.latitude!,
      lng: station.longitude!,
    }));
}

// Transform rainfall records to chart data
function transformRainfallData(records: RainfallRecordRead[]): LevelData[] {
  // Group records by time periods and create chart data
  const dailyData: ChartData[] = records
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .map((record) => {
      const date = new Date(record.start_time);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
      return {
        label: formattedDate,
        value: record.accumulated_rainfall,
      };
    });

  return [
    {
      title: "Dự báo lượng mưa trong 7 ngày tới",
      data: dailyData,
      color: "#6155F5",
    },
  ];
}

export function PrecipitationPage() {
  const { selectedStation, setSelectedStation, selectedDate, setSliderDisabled } = useWeatherMapStore();

  // Fetch stations data
  const {
    data: stationsData = [],
    isLoading: isLoadingStations,
    isError: isStationsError,
    error: stationsError,
  } = useStations();

  // Transform station data
  const stations = useMemo(() => transformStationData(stationsData), [stationsData]);

  // Fetch all stations rainfall records
  const {
    data: stationDailyRecords = new Map(),
    isLoading: isLoadingRainfallRecords,
  } = useAllStationsRainfallRecords(selectedDate, stationsData);

  // Fetch specific station rainfall data for chart
  const forecastStartDate = useMemo(() => {
    if (!selectedDate)
      return null;
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    return date;
  }, [selectedDate]);

  const forecastEndDate = useMemo(() => {
    if (!selectedDate)
      return null;
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 9);
    return date;
  }, [selectedDate]);

  const {
    data: stationForecastData = [],
    isLoading: isLoadingForecast,
  } = useStationRainfallRecords(
    selectedStation?.id ?? null,
    forecastStartDate,
    forecastEndDate,
  );

  // Transform forecast data for chart
  const rainfallData = useMemo(() => {
    if (!stationForecastData.length)
      return [];
    return transformRainfallData(stationForecastData);
  }, [stationForecastData]);

  useEffect(() => {
    setSliderDisabled(true);
    return () => setSliderDisabled(false);
  }, [setSliderDisabled]);

  // Show error notification
  useEffect(() => {
    if (isStationsError) {
      showNotification.error({
        message: "Lỗi tải dữ liệu",
        description: "Không thể tải dữ liệu trạm đo. Vui lòng thử lại sau.",
      });
      console.error("Error fetching stations:", stationsError);
    }
  }, [isStationsError, stationsError]);

  // Color scale for rainfall intensity (mm/hour)
  const getRainfallColor = (rainfall: number): string => {
    if (rainfall === 0)
      return "#E5E7EB"; // Gray for no rain
    if (rainfall <= 0.5)
      return "#DBEAFE"; // Very light blue
    if (rainfall <= 2.5)
      return "#93C5FD"; // Light blue
    if (rainfall <= 10)
      return "#3B82F6"; // Blue
    if (rainfall <= 20)
      return "#1D4ED8"; // Dark blue
    if (rainfall <= 50)
      return "#F59E0B"; // Orange
    if (rainfall <= 100)
      return "#EF4444"; // Red
    return "#7C2D12"; // Dark red for extreme rainfall
  };

  // Extract rainfall value for specific hour from daily records
  const getRainfall = (stationId: number): number => {
    const records = stationDailyRecords.get(stationId);
    if (!records || !selectedDate)
      return 0;

    // Find the record that contains the target hour
    const matchingRecord = records.find((record: RainfallRecordRead) => {
      const recordDate = new Date(record.start_time).toDateString();
      const targetDate = new Date(selectedDate).toDateString();
      return recordDate.slice(0, 10) === targetDate.slice(0, 10);
    });

    return matchingRecord ? matchingRecord.accumulated_rainfall : 0;
  };

  const handleMarkerClick = (station: StationInfo) => {
    setSelectedStation(station);
  };

  const handlePanelClose = () => {
    setSelectedStation(null);
  };

  const createLevelIcon = (rainfall: number = 0) => {
    const color = getRainfallColor(rainfall);
    const iconHtml = ReactDOMServer.renderToString(
      <Icon path={mdiWeatherPouring} size={1} color="blue" />,
    );

    // Format rainfall value for display
    const rainfallText = rainfall > 0 ? rainfall.toFixed(0) : "0";

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 40px;
          height: 40px;
          border-radius: 100% 100% 100% 0;
          transform: rotate(-45deg);
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid blue;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="transform: rotate(45deg);">${iconHtml}</div>
          <!-- Rainfall text-->
          <div style="
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            white-space: nowrap;
          ">${rainfallText}</div>

        </div>
      `,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Show loading overlay
  const isLoading = isLoadingStations || isLoadingRainfallRecords;

  return (
    <>
      {isLoading && <MapLoadingOverlay message="Đang tải dữ liệu trạm đo..." />}

      {stations.map((station: StationInfo) => {
        const rainfall = getRainfall(station.id);
        return (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={createLevelIcon(rainfall)}
            eventHandlers={{
              click: () => handleMarkerClick(station),
            }}
          />
        );
      })}

      {ReactDOM.createPortal(
        <div
          className={`
            absolute bottom-4 right-4 z-10
            ${selectedStation ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <StationInfoPanel
            station={selectedStation}
            levelData={rainfallData}
            onClose={handlePanelClose}
            isLoading={isLoadingForecast}
          />
        </div>,
        document.body,
      )}
    </>
  );
}
