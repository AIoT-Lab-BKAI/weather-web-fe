import Icon from "@mdi/react";
import { mdiWeatherHurricaneOutline } from "@mdi/js";
import L from "leaflet";
import { Circle, Marker, Polyline, Tooltip } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import React, { useEffect, useState } from "react";
import { stormsApi } from "@/services/apis/storms.api";
import { StormLifecycleRead } from "@/types/storms";
import { useWeatherMapLayout } from "../context";

interface CyclonePoint extends StormLifecycleRead {
  status: "past" | "forecast";
  radius: number;
}

const CycloneTooltipContent: React.FC<{ point: CyclonePoint }> = ({
  point,
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "");
  };

  return (
    <div className="cyclone-tooltip-content relative flex flex-col items-start p-2 gap-2 w-[102px] bg-white/70 backdrop-blur-sm rounded-lg text-black text-xs font-normal">
      <div className="w-full">
        <span>
          Lat:
          {point.latitude.toFixed(1)}
          °N
        </span>
        <hr className="border-t-[0.5px] border-gray-300 mt-2" />
      </div>
      <div className="w-full">
        <span>
          Lon:
          {point.longitude.toFixed(1)}
          °E
        </span>
        <hr className="border-t-[0.5px] border-gray-300 mt-2" />
      </div>
      <div className="w-full">
        <span>
          Time:
          {formatTimestamp(point.timestamp)}
        </span>
        <hr className="border-t-[0.5px] border-gray-300 mt-2" />
      </div>
      <div className="w-full">
        <span>
          Intensity:
          {point.intensity}
          {" "}
          km/h
        </span>
      </div>
    </div>
  );
};

function createCycloneIcon(status: "past" | "forecast") {
  const iconHtml = ReactDOMServer.renderToString(
    <Icon path={mdiWeatherHurricaneOutline} size={1} color="white" />,
  );
  const backgroundColor = status === "forecast" ? "#FF2D55" : "#757474";

  return L.divIcon({
    html: `
      <div style="
        background-color: ${backgroundColor};
        width: 32px;
        height: 32px;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        ${iconHtml}
      </div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export function TropicalCyclonePage() {
  const [cycloneData, setCycloneData] = useState<CyclonePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedDate, sliderValue: selectedHour } = useWeatherMapLayout();

  useEffect(() => {
    const fetchCycloneData = async () => {
      try {
        setLoading(true);
        const response = await stormsApi.stormLifecycle.list();

        // Sort by timestamp to determine timeline
        const sortedData = response.data.sort((a: StormLifecycleRead, b: StormLifecycleRead) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

        // Determine the reference time based on selectedDate and selectedHour
        let referenceTime: Date;
        if (selectedDate) {
          referenceTime = new Date(selectedDate);
          referenceTime.setHours(selectedHour, 0, 0, 0);
        }
        else {
          referenceTime = new Date();
        }

        // Transform data and determine status
        const transformedData: CyclonePoint[] = sortedData.map((item: StormLifecycleRead, index: number) => {
          const timestamp = new Date(item.timestamp);
          const isForecast = timestamp > referenceTime;

          // Calculate radius for forecast points with increment
          let radius = 0;
          if (isForecast) {
            // Base radius of 50km, increasing by 20km for each subsequent forecast point
            const forecastIndex = sortedData.slice(0, index + 1).filter((d: StormLifecycleRead) =>
              new Date(d.timestamp) > referenceTime,
            ).length;
            radius = 10000 + (forecastIndex - 1) * 5000;
          }

          return {
            ...item,
            status: isForecast ? "forecast" : "past",
            radius,
          };
        });

        // Filter data based on selected time frame
        // Show past points up to the reference time and forecast points after
        const filteredData = transformedData.filter((item: CyclonePoint) => {
          const itemTime = new Date(item.timestamp);

          if (!selectedDate) {
            // If no date is selected, show current position and forecasts
            return itemTime <= referenceTime || item.status === "forecast";
          }

          if (item.status === "past") {
            // Show past points that are close to the reference time (within a reasonable range)
            // This helps show the cyclone's path leading up to the selected time
            return itemTime <= referenceTime;
          }
          else {
            // Show forecast points after the reference time
            return itemTime > referenceTime;
          }
        });

        setCycloneData(filteredData);
      }
      catch (error) {
        console.error("Error fetching cyclone data:", error);
        setCycloneData([]);
      }
      finally {
        setLoading(false);
      }
    };

    fetchCycloneData();
  }, [selectedDate, selectedHour]);

  if (loading) {
    return null; // Or loading spinner
  }

  const allPositions = cycloneData.map(
    p => [p.latitude, p.longitude] as [number, number],
  );
  const forecastStartIndex = cycloneData.findIndex(
    p => p.status === "forecast",
  );
  const pastPath = allPositions.slice(0, forecastStartIndex + 1);
  const forecastPath = allPositions.slice(forecastStartIndex);

  return (
    <>
      {pastPath.length > 1 && (
        <Polyline
          positions={pastPath}
          pathOptions={{ color: "#757474", weight: 2 }}
        />
      )}
      {forecastPath.length > 1 && (
        <Polyline
          positions={forecastPath}
          pathOptions={{ color: "#FF2D55", weight: 2 }}
        />
      )}

      {cycloneData.map((point, index) => (
        <React.Fragment key={`${point.storm_id}-${point.timestamp}-${index}`}>
          {point.radius > 0 && (
            <Circle
              center={[point.latitude, point.longitude]}
              radius={point.radius}
              pathOptions={{
                color: "#FF2D55",
                fillColor: "#FF2D55",
                fillOpacity: 0.4,
                opacity: 1,
                fillRule: "evenodd",
              }}

            />
          )}

          <Marker
            position={[point.latitude, point.longitude]}
            icon={createCycloneIcon(point.status)}
          >
            <Tooltip
              direction="bottom"
              offset={[0, 28]}
              opacity={1}
              permanent={false}
              className="cyclone-tooltip"
            >
              <CycloneTooltipContent point={point} />
            </Tooltip>
          </Marker>
        </React.Fragment>
      ))}
    </>
  );
}
