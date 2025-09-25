import { Marker } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import Icon from "@mdi/react";
import { mdiWaterOutline } from "@mdi/js";
import { StationInfoPanel } from "../components/station-info-panel";
import ReactDOM from "react-dom";
import { ChartData, LevelData, StationInfo } from "../types";
import { useWeatherMapLayout } from "../context";
import { reservoirsApi } from "@/services/apis/reservoirs.api";
import { useState, useEffect } from "react";
import { ReservoirRead, ReservoirOperationRead } from "@/types/reservoirs";

export function LevelPage() {
  const { selectedStation, setSelectedStation, selectedDate, selectedHour, setSliderMarks } = useWeatherMapLayout();
  const [stations, setStations] = useState<StationInfo[]>([]);
  const [levelData, setLevelData] = useState<LevelData[]>([]);
  const [reservoirOperations, setReservoirOperations] = useState<Map<number, ReservoirOperationRead[]>>(() => new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Color scale for water level (m)
  const getWaterLevelColor = (waterLevel: number): string => {
    if (waterLevel === 0)
      return "#E5E7EB"; // Gray for no data
    if (waterLevel <= 50)
      return "#DBEAFE"; // Very light blue - low water level
    if (waterLevel <= 100)
      return "#93C5FD"; // Light blue
    if (waterLevel <= 150)
      return "#3B82F6"; // Blue
    if (waterLevel <= 200)
      return "#1D4ED8"; // Dark blue
    if (waterLevel <= 250)
      return "#F59E0B"; // Orange - high water level
    return "#EF4444"; // Red - very high water level
  };

  // Extract water level for specific hour from daily operations
  const getWaterLevelForHour = (reservoirId: number, hour: number): number => {
    const operations = reservoirOperations.get(reservoirId);
    if (!operations || !selectedDate)
      return 0;

    const targetDateTime = new Date(selectedDate);
    targetDateTime.setHours(hour, 0, 0, 0);

    // Find the operation record closest to the target hour
    const matchingOperation = operations.find((operation) => {
      const operationTime = new Date(operation.timestamp);
      const timeDiff = Math.abs(operationTime.getTime() - targetDateTime.getTime());
      return timeDiff <= 60 * 60 * 1000; // Within 1 hour
    });

    return matchingOperation ? matchingOperation.water_level || 0 : 0;
  };

  // Transform API reservoir data to StationInfo format
  const transformReservoirData = (apiReservoirs: ReservoirRead[]): StationInfo[] => {
    return apiReservoirs
      .filter(reservoir => reservoir.reservoir_name) // Only include reservoirs with valid names
      .map(reservoir => ({
        id: reservoir.reservoir_id,
        name: reservoir.reservoir_name,
        details: `River: ${reservoir.river || "N/A"}, Province: ${reservoir.province || "N/A"}${reservoir.elevation ? `, Alt: ${reservoir.elevation}m` : ""}`,
        lat: 20.8 + (reservoir.reservoir_id % 100) * 0.05, // Mock coordinates based on ID
        lng: 105.3 + (reservoir.reservoir_id % 100) * 0.05, // Mock coordinates based on ID
      }));
  };

  // Transform reservoir operations to chart data
  const transformOperationsData = (operations: ReservoirOperationRead[]): LevelData[] => {
    // Group operations by time periods and create chart data
    const waterLevelData: ChartData[] = operations.slice(0, 7).map((operation, index) => ({
      label: `Ngày ${index + 1}`,
      value: operation.water_level || 0,
    }));

    const dischargeData: ChartData[] = operations.slice(0, 7).map((operation, index) => ({
      label: `Ngày ${index + 1}`,
      value: operation.total_discharge || 0,
    }));

    return [
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
  };

  // Fetch reservoirs data
  useEffect(() => {
    const fetchReservoirs = async () => {
      try {
        setLoading(true);
        const response = await reservoirsApi.reservoirs.list();
        const transformedReservoirs = transformReservoirData(response.data);
        setStations(transformedReservoirs);
        setError(null);
      }
      catch (err) {
        setError("Không thể tải dữ liệu hồ chứa. Vui lòng thử lại sau.");
        console.error("Error fetching reservoirs:", err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchReservoirs();
  }, []);

  // Fetch reservoir operations data for all reservoirs based on selected date
  useEffect(() => {
    const fetchAllReservoirOperations = async () => {
      if (!selectedDate || stations.length === 0) {
        setReservoirOperations(new Map());
        return;
      }

      try {
        const targetDate = new Date(selectedDate);
        const startTime = new Date(targetDate);
        const endTime = new Date(targetDate);
        endTime.setDate(endTime.getDate() + 1);

        // Create a Map to store operations for each reservoir
        const operationsMap = new Map<number, ReservoirOperationRead[]>();

        // Fetch operations data for each reservoir
        const operationsPromises = stations.map(async (station) => {
          try {
            const response = await reservoirsApi.operations.list({
              start_date: startTime.toISOString().split("T")[0],
              end_date: endTime.toISOString().split("T")[0],
            });

            const marks = {} as any;
            for (const record of response.data) {
              marks[new Date(record.timestamp).getHours()] = `${new Date(record.timestamp).getHours()}:00`;
            }
            setSliderMarks(marks);

            operationsMap.set(station.id, response.data);
          }
          catch (err) {
            console.error(`Error fetching operations for reservoir ${station.id}:`, err);
            operationsMap.set(station.id, []);
          }
        });

        await Promise.all(operationsPromises);
        setReservoirOperations(operationsMap);
      }
      catch (err) {
        console.error("Error fetching reservoir operations:", err);
        setReservoirOperations(new Map());
      }
    };

    fetchAllReservoirOperations();
  }, [selectedDate, stations]); // Only depend on selectedDate, not selectedHour

  // Fetch level data when a station is selected
  useEffect(() => {
    const fetchLevelData = async () => {
      if (!selectedStation) {
        setLevelData([]);
        return;
      }

      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30); // Get last 30 days of data

        const response = await reservoirsApi.operations.list({
          reservoir_id: selectedStation.id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        });

        const transformedData = transformOperationsData(response.data);
        setLevelData(transformedData);
      }
      catch (err) {
        console.error("Error fetching operations data:", err);
        // Fallback to empty data instead of showing error to user
        setLevelData([]);
      }
    };

    fetchLevelData();
  }, [selectedStation]);

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

  const createLevelIcon = (waterLevel: number = 0) => {
    const color = getWaterLevelColor(waterLevel);
    const iconHtml = ReactDOMServer.renderToString(
      <Icon path={mdiWaterOutline} size={1} color="blue" />,
    );

    // Format water level value for display
    const levelText = waterLevel > 0 ? waterLevel.toFixed(1) : "0";

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
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="transform: rotate(45deg);">${iconHtml}</div>
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
          ">${levelText}m</div>
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
        const waterLevel = getWaterLevelForHour(station.id, selectedHour);
        return (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={createLevelIcon(waterLevel)}
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
            levelData={levelData}
            onClose={handlePanelClose}
          />
        </div>,
        document.body,
      )}
    </>
  );
}
