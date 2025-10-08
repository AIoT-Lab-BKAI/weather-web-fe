import { Outlet } from "@tanstack/react-router";
import { MapContainer } from "react-leaflet";
import { MapCanvas } from "./components/map-canvas";
import { SearchInput } from "./components/search-input";
import { StormSelector } from "./components/storm-selector";
import { TimelineControl } from "./components/timeline-control";
import { WeatherSidebar } from "./components/weather-sidebar";
import { useWeatherMapStore } from "./store";

function WeatherMapLayoutContent() {
  const {
    selectedStation,
    mapCenter,
    mapZoom,
  } = useWeatherMapStore();

  return (
    <div className="h-screen w-screen relative">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
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

      <StormSelector />

      <div
        className={`
          absolute bottom-4 left-0 z-20 transition-all duration-500 ease-in-out
          ${selectedStation ? "right-[476px]" : "right-0"}
        `}
      >
        <TimelineControl />
      </div>
    </div>
  );
}

export function WeatherMapLayout() {
  return <WeatherMapLayoutContent />;
}
