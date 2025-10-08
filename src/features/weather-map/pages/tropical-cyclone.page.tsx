import { formatTimestamp } from "@/lib/date-time";
import { stormsApi } from "@/services/apis/storms.api";
import { StormLifecycleRead } from "@/types/storms";
import { mdiWeatherHurricaneOutline } from "@mdi/js";
import Icon from "@mdi/react";
import dayjs from "dayjs";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Circle, Marker, Polyline, Tooltip } from "react-leaflet";
import { useWeatherMapLayout } from "../context";

interface CyclonePoint extends StormLifecycleRead {
  status: "past" | "forecast";
  radius: number;
}

function createCycloneIcon(status: "past" | "forecast") {
  const iconHtml = ReactDOMServer.renderToString(
    <Icon path={mdiWeatherHurricaneOutline} size={1} color="white" />,
  );
  const backgroundColor = status === "forecast" ? "#FF2D55D0" : "#757474D0";

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
  const { selectedDate, setSelectedDate, selectedHour, setSliderMarks, selectedStormId, setSelectedStormId, setIsStormSelectorOpen } = useWeatherMapLayout();
  const [data, setData] = useState<StormLifecycleRead[]>([]);

  useEffect(() => {
    setLoading(false);
    setIsStormSelectorOpen(true);
    return () => {
      setIsStormSelectorOpen(false);
      setSelectedStormId(null);
    };
  }, [setIsStormSelectorOpen, setSelectedStormId]);

  useEffect(() => {
    if (!selectedStormId) {
      setData([]);
      return;
    }
    const fetchCycloneData = async () => {
      const stormLifecycles = await stormsApi.stormLifecycle.list({
        storm_ids: [selectedStormId || 0],
      });

      const data = stormLifecycles.data.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });

      const endDate = new Date(data[data.length - 1].timestamp);
      endDate.setDate(endDate.getDate() - 1);

      setSelectedDate(endDate || new Date());

      setData(data);
    };
    fetchCycloneData();
  }, [selectedStormId, setSelectedDate]);

  useEffect(() => {
    if (data.length === 0)
      return;

    // const maxDate = dayjs(data[data.length - 1].timestamp);
    // const minDate = dayjs(data[0].timestamp);
    // if (selectedDate && (dayjs(selectedDate).isBefore(minDate, "day") || dayjs(selectedDate).isAfter(maxDate, "day"))) {
    //   setCycloneData([]);
    //   return;
    // }

    const sliderMarks = data.filter((item: StormLifecycleRead) => {
      return dayjs(item.timestamp).isSame(selectedDate, "day");
    }).reduce((marks: Record<number, string>, item: StormLifecycleRead) => {
      const hours = dayjs(item.timestamp).hour();
      marks[hours] = `${hours}:00`;
      return marks;
    }, {});

    setSliderMarks(sliderMarks);

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
    const transformedData: CyclonePoint[] = data.map((item: StormLifecycleRead, index: number) => {
      const timestamp = new Date(item.timestamp);
      const isForecast = timestamp > referenceTime;

      // Calculate radius for forecast points with increment
      let radius = 0;
      if (isForecast) {
        // Base radius of 50km, increasing by 20km for each subsequent forecast point
        const forecastIndex = data.slice(0, index + 1).filter((d: StormLifecycleRead) =>
          new Date(d.timestamp) > referenceTime,
        ).length;
        radius = Math.min(8000 + 15000 * Math.log(forecastIndex + 1));
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
  }, [data, selectedDate, selectedHour, setSliderMarks]);

  if (loading) {
    return null; // Or loading spinner
  }

  const allPositions = cycloneData.map(
    p => [p.latitude, p.longitude] as [number, number],
  );
  const forecastStartIndex = cycloneData.findIndex(
    p => p.status === "forecast",
  );

  // Xử lý trường hợp selectedDate nằm ngoài khoảng dữ liệu
  let pastPath: [number, number][] = [];
  let forecastPath: [number, number][] = [];

  if (forecastStartIndex === -1) {
    // Tất cả là past (selectedDate sau tất cả các điểm)
    pastPath = allPositions;
  }
  else if (forecastStartIndex === 0) {
    // Tất cả là forecast (selectedDate trước tất cả các điểm)
    forecastPath = allPositions;
  }
  else {
    // Trường hợp bình thường: có cả past và forecast
    pastPath = allPositions.slice(0, forecastStartIndex + 1);
    forecastPath = allPositions.slice(forecastStartIndex);
  }

  return (
    <>
      {pastPath.length > 1 && (
        <Polyline
          positions={pastPath}
          pathOptions={{ color: "#75747480", weight: 2 }}
        />
      )}
      {forecastPath.length > 1 && (
        <Polyline
          positions={forecastPath}
          pathOptions={{ color: "#FF2D5580", weight: 2 }}
        />
      )}

      {cycloneData.map((point, index) => (
        <React.Fragment key={`${point.storm_id}-${point.timestamp}-${index}`}>
          {point.radius > 0 && (
            <Circle
              center={[point.latitude, point.longitude]}
              radius={point.radius}
              pathOptions={{
                color: "#FF2D5560",
                fillColor: "#FF2D5580",
                fillOpacity: 0.4,
                fillRule: "evenodd",
              }}

            />
          )}

          <Marker
            position={[point.latitude, point.longitude]}
            icon={createCycloneIcon(point.status)}
            riseOffset={1000}
          >
            <Tooltip
              direction="bottom"
              offset={[0, 28]}
              opacity={1}
              permanent={false}
              className="cyclone-tooltip"
            >
              <div className="cyclone-tooltip-content relative flex flex-col items-start p-2 gap-2 bg-white/70 backdrop-blur-sm rounded-lg text-black text-xs font-normal">
                <div className="w-full">
                  <span>
                    <b>Lat:</b>
                    &nbsp;
                    {point.latitude.toFixed(3)}
                    &nbsp;
                    <i>°N</i>
                  </span>
                  <hr className="border-t-[0.5px] border-gray-300 mt-2" />
                </div>
                <div className="w-full">
                  <span>
                    <b>Lon:</b>
                    &nbsp;
                    {point.longitude.toFixed(3)}
                    &nbsp;
                    <i>°E</i>
                  </span>
                  <hr className="border-t-[0.5px] border-gray-300 mt-2" />
                </div>
                <div className="w-full">
                  <span>
                    <b>Time:</b>
                    &nbsp;
                    {formatTimestamp(point.timestamp)}
                  </span>
                  <hr className="border-t-[0.5px] border-gray-300 mt-2" />
                </div>
                <div className="w-full">
                  <span>
                    <b>Intensity:</b>
                    &nbsp;
                    {point.intensity.toFixed(0)}
                    &nbsp;
                    <i>km/h</i>
                  </span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        </React.Fragment>
      ))}
    </>
  );
}
