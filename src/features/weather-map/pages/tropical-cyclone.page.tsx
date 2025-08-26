import Icon from "@mdi/react";
import { mdiWeatherHurricaneOutline } from "@mdi/js";
import L from "leaflet";
import { Circle, Marker, Polyline, Tooltip } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import React from "react";

interface CyclonePoint {
  id: number;
  lat: number;
  lng: number;
  status: "past" | "forecast";
  radius: number;
  vmax: number;
}

const mockCycloneData: CyclonePoint[] = [
  { id: 1, lat: 15.5, lng: 115.5, status: "past", radius: 0, vmax: 60 },
  { id: 2, lat: 16.2, lng: 114.0, status: "past", radius: 0, vmax: 65 },
  { id: 3, lat: 17.0, lng: 112.5, status: "past", radius: 0, vmax: 70 },
  { id: 4, lat: 17.5, lng: 111.0, status: "past", radius: 0, vmax: 75 },
  { id: 5, lat: 18.2, lng: 109.8, status: "forecast", radius: 60000, vmax: 80 },
  { id: 6, lat: 19.0, lng: 108.5, status: "forecast", radius: 80000, vmax: 85 },
  {
    id: 7,
    lat: 20.2,
    lng: 107.0,
    status: "forecast",
    radius: 100000,
    vmax: 90,
  },
  {
    id: 8,
    lat: 21.0,
    lng: 105.8,
    status: "forecast",
    radius: 120000,
    vmax: 83,
  },
];

const CycloneTooltipContent: React.FC<{ point: CyclonePoint }> = ({
  point,
}) => {
  return (
    <div className="cyclone-tooltip-content relative flex flex-col items-start p-2 gap-2 w-[102px] bg-white/70 backdrop-blur-sm rounded-lg text-black text-xs font-normal">
      <div className="w-full">
        <span>Lat: {point.lat.toFixed(1)}°N</span>
        <hr className="border-t-[0.5px] border-gray-300 mt-2" />
      </div>
      <div className="w-full">
        <span>Lon: {point.lng.toFixed(1)}°E</span>
        <hr className="border-t-[0.5px] border-gray-300 mt-2" />
      </div>
      <div className="w-full">
        <span>Vmax: {point.vmax} km/h</span>
      </div>
    </div>
  );
};

const createCycloneIcon = (status: "past" | "forecast") => {
  const iconHtml = ReactDOMServer.renderToString(
    <Icon path={mdiWeatherHurricaneOutline} size={1} color="white" />
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
};

export function TropicalCyclonePage() {
  const allPositions = mockCycloneData.map(
    (p) => [p.lat, p.lng] as [number, number]
  );
  const forecastStartIndex = mockCycloneData.findIndex(
    (p) => p.status === "forecast"
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

      {mockCycloneData.map((point) => (
        <React.Fragment key={point.id}>
          {point.radius > 0 && (
            <Circle
              center={[point.lat, point.lng]}
              radius={point.radius}
              pathOptions={{
                color: "#FF2D55",
                fillColor: "#FF2D55",
                fillOpacity: 0.4,
              }}
            />
          )}

          <Marker
            position={[point.lat, point.lng]}
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
