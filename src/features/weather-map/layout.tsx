import { Outlet } from "@tanstack/react-router";
import { MapCanvas } from "./components/map-canvas";
import { SearchInput } from "./components/search-input";
import { TimelineControl } from "./components/timeline-control";
import { WeatherSidebar } from "./components/weather-sidebar";
import { MapContainer } from "react-leaflet";
import { StationInfo } from "./types";
import { createContext, useContext, useState } from "react";

const initialPosition: [number, number] = [16.5, 107.5];
const initialZoom = 5.5;
interface LayoutContextType {
  selectedStation: StationInfo | null;
  setSelectedStation: (station: StationInfo | null) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within LayoutProvider");
  }
  return context;
};

export function WeatherMapLayout() {
  const [selectedStation, setSelectedStation] = useState<StationInfo | null>(
    null
  );

  return (
    <LayoutContext.Provider value={{ selectedStation, setSelectedStation }}>
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

        <div
          className={`
            absolute bottom-4 left-0 z-20 transition-all duration-500 ease-in-out
            ${selectedStation ? "right-[476px]" : "right-0"}
          `}
        >
          <TimelineControl />
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
