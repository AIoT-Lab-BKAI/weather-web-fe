import { Outlet } from "@tanstack/react-router";
import { MapCanvas } from "./components/map-canvas";
import { SearchInput } from "./components/search-input";
import { TimelineControl } from "./components/timeline-control";
import { WeatherSidebar } from "./components/weather-sidebar";
import { MapContainer } from "react-leaflet";

const initialPosition: [number, number] = [16.5, 107.5];
const initialZoom = 5.5;

export function WeatherMapLayout() {
  return (
    <div className="h-screen w-screen relative">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={initialPosition}
          zoom={initialZoom}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <MapCanvas />

          <Outlet />
        </MapContainer>
      </div>

      <div className="absolute top-6 left-6 pointer-events-auto">
        <SearchInput />
      </div>

      <div className="absolute top-[95px] left-6 pointer-events-auto">
        <WeatherSidebar />
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-20">
        <TimelineControl />
      </div>
    </div>
  );
}
