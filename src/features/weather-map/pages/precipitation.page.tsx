import { Marker } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import Icon from "@mdi/react";
import { mdiWeatherPouring } from "@mdi/js";
import { StationInfoPanel } from "../components/station-info-panel";
import ReactDOM from "react-dom";
import { ChartData, LevelData, StationInfo } from "../types";
import { useWeatherMapLayout } from "../context";
import { precipitationApi } from "@/services/apis/precipitation.api";
import { useState, useEffect } from "react";
import { StationRead, RainfallRecordRead } from "@/types/precipitation";

export function PrecipitationPage() {
  const { selectedStation, setSelectedStation, selectedDate, selectedHour, setSliderMarks } = useWeatherMapLayout();
  const [stations, setStations] = useState<StationInfo[]>([]);
  const [rainfallData, setRainfallData] = useState<LevelData[]>([]);
  const [stationDailyRecords, setStationDailyRecords] = useState<Map<number, RainfallRecordRead[]>>(() => new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  const getRainfallForHour = (stationId: number, hour: number): number => {
    const records = stationDailyRecords.get(stationId);
    if (!records || !selectedDate)
      return 0;

    const targetDateTime = new Date(selectedDate);
    targetDateTime.setHours(hour + 1, 0, 0, 0);

    // Find the record that contains the target hour
    const matchingRecord = records.find((record) => {
      const recordStart = new Date(record.start_time);
      const recordEnd = new Date(record.end_time);
      return targetDateTime >= recordStart && targetDateTime <= recordEnd;
    });

    return matchingRecord ? matchingRecord.accumulated_rainfall : 0;
  };

  // Transform API station data to StationInfo format
  const transformStationData = (apiStations: StationRead[]): StationInfo[] => {
    return apiStations
      .filter(station => station.latitude && station.longitude) // Only include stations with coordinates
      .map(station => ({
        id: station.station_id,
        name: station.station_name,
        details: `Lat: ${station.latitude}, Lon: ${station.longitude}${station.elevation ? `, Alt: ${station.elevation}m` : ""}`,
        lat: station.latitude!,
        lng: station.longitude!,
      }));
  };

  // Transform rainfall records to chart data
  const transformRainfallData = (records: RainfallRecordRead[]): LevelData[] => {
    // Group records by time periods and create chart data
    const dailyData: ChartData[] = records.map((record, index) => ({
      label: `Ngày ${index + 1}`,
      value: record.accumulated_rainfall,
    }));

    return [
      {
        title: "Dự báo lượng mưa trong 7 ngày tới",
        data: dailyData,
        color: "#6155F5",
      },
    ];
  };

  // Fetch stations data
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await precipitationApi.stations.list();
        const transformedStations = transformStationData(response.data);
        setStations(transformedStations);
        setError(null);
      }
      catch (err) {
        setError("Không thể tải dữ liệu trạm đo. Vui lòng thử lại sau.");
        console.error("Error fetching stations:", err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Fetch rainfall data for all stations based on selected date
  useEffect(() => {
    const fetchAllStationsRainfall = async () => {
      if (!selectedDate || stations.length === 0) {
        setStationDailyRecords(new Map());
        return;
      }

      try {
        const targetDate = new Date(selectedDate);
        const startTime = new Date(targetDate);
        startTime.setDate(startTime.getDate() - 15);
        const endTime = new Date(targetDate);
        endTime.setDate(endTime.getDate() + 15);

        // Create a Map to store rainfall records for each station
        const recordsMap = new Map<number, RainfallRecordRead[]>();

        const response = await precipitationApi.rainfallRecords.list({
          start_date: startTime.toISOString().split("T")[0],
          end_date: endTime.toISOString().split("T")[0],
        });

        for (const record of response.data) {
          if (!recordsMap.has(record.station_id)) {
            recordsMap.set(record.station_id, []);
          }
          recordsMap.get(record.station_id)!.push(record);
        }

        setStationDailyRecords(recordsMap);
      }
      catch (err) {
        console.error("Error fetching stations rainfall:", err);
        setStationDailyRecords(new Map());
      }
    };

    fetchAllStationsRainfall();
  }, [selectedDate, stations, setSliderMarks]); // Only depend on selectedDate, not selectedHour

  // Fetch rainfall data when a station is selected
  useEffect(() => {
    const fetchRainfallData = async () => {
      if (!selectedStation) {
        setRainfallData([]);
        return;
      }

      try {
        const endDate = new Date(selectedDate || new Date());
        endDate.setDate(endDate.getDate() + 7);
        const startDate = new Date(selectedDate || new Date());
        startDate.setDate(startDate.getDate() - 1);

        const response = await precipitationApi.rainfallRecords.list({
          station_id: selectedStation.id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        });

        const transformedData = transformRainfallData(response.data);
        setRainfallData(transformedData);
      }
      catch (err) {
        console.error("Error fetching rainfall data:", err);
        // Fallback to empty data instead of showing error to user
        setRainfallData([]);
      }
    };

    fetchRainfallData();
  }, [selectedStation, selectedDate]);

  const handleMarkerClick = (station: StationInfo) => {
    setSelectedStation(station);
  };

  const handlePanelClose = () => {
    setSelectedStation(null);
  };

  // Show loading state
  if (loading) {
    return null; // Or you could return a loading spinner
  }

  // Show error state
  if (error) {
    return (
      <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const createLevelIcon = (rainfall: number = 0) => {
    const color = getRainfallColor(rainfall);
    const iconHtml = ReactDOMServer.renderToString(
      <Icon path={mdiWeatherPouring} size={1} color="blue" />,
    );

    // Format rainfall value for display
    const rainfallText = rainfall > 0 ? rainfall.toFixed(1) : "0";

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
          <!-- Rainfall text
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
          ">${rainfallText}mm</div>
          -->
        </div>
      `,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <>
      {stations.map((station) => {
        const rainfall = getRainfallForHour(station.id, selectedHour);
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
          />
        </div>,
        document.body,
      )}
    </>
  );
}
