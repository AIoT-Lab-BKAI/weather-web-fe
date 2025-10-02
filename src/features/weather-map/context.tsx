import { createContext, ReactNode, useMemo, useState, use } from "react";
import { StationInfo } from "./types";
import { SliderMarks } from "antd/es/slider";
import { StormRead } from "@/types/storms";

export interface WeatherMapLayoutContextType {
  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: StationInfo[];
  setSearchResults: (results: StationInfo[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;

  // Station state
  selectedStation: StationInfo | null;
  setSelectedStation: (station: StationInfo | null) => void;

  // Header state (similar to admin layout)
  headerTitle?: string;
  setHeaderTitle: (title?: string) => void;

  // Map state
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;

  // Timeline
  selectedHour: number;
  setSelectedHour: (value: number) => void;

  // Date
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;

  sliderMarks: SliderMarks;
  setSliderMarks: (markers: SliderMarks) => void;

  sliderDisabled: boolean;
  setSliderDisabled: (disabled: boolean) => void;

  // Storm selector
  storms: StormRead[];
  setStorms: (storms: StormRead[]) => void;
  selectedStormId: number | null;
  setSelectedStormId: (stormId: number | null) => void;
  isStormSelectorOpen: boolean;
  setIsStormSelectorOpen: (open: boolean) => void;
}

export const WeatherMapLayoutContext = createContext<WeatherMapLayoutContextType | undefined>(undefined);

export function WeatherMapLayoutProvider({ children }: { children: ReactNode }) {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<StationInfo[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Station state
  const [selectedStation, setSelectedStation] = useState<StationInfo | null>(null);

  // Header state
  const [headerTitle, setHeaderTitle] = useState<string | undefined>(undefined);

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.5, 107.5]);
  const [mapZoom, setMapZoom] = useState<number>(5.5);

  // Timeline
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date());
  const [sliderMarks, setSliderMarks] = useState<SliderMarks>({});
  const [sliderDisabled, setSliderDisabled] = useState<boolean>(false);

  // Storm selector
  const [storms, setStorms] = useState<StormRead[]>([]);
  const [selectedStormId, setSelectedStormId] = useState<number | null>(null);
  const [isStormSelectorOpen, setIsStormSelectorOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const weatherMapLayoutContextValue = useMemo<WeatherMapLayoutContextType>(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
      searchQuery,
      setSearchQuery,
      searchResults,
      setSearchResults,
      isSearching,
      setIsSearching,
      selectedStation,
      setSelectedStation,
      headerTitle,
      setHeaderTitle,
      mapCenter,
      setMapCenter,
      mapZoom,
      setMapZoom,
      selectedHour,
      setSelectedHour,
      selectedDate,
      setSelectedDate,
      sliderMarks,
      setSliderMarks,
      sliderDisabled,
      setSliderDisabled,
      storms,
      setStorms,
      selectedStormId,
      setSelectedStormId,
      isStormSelectorOpen,
      setIsStormSelectorOpen,
    }),
    [
      sidebarCollapsed,
      searchQuery,
      searchResults,
      isSearching,
      selectedStation,
      headerTitle,
      mapCenter,
      mapZoom,
      selectedHour,
      selectedDate,
      sliderMarks,
      sliderDisabled,
      storms,
      selectedStormId,
      isStormSelectorOpen,
    ],
  );

  return (
    <WeatherMapLayoutContext value={weatherMapLayoutContextValue}>
      {children}
    </WeatherMapLayoutContext>
  );
}

export function useWeatherMapLayout() {
  const context = use(WeatherMapLayoutContext);
  if (!context) {
    throw new Error("useWeatherMapLayout must be used within a WeatherMapLayoutProvider");
  }
  return context;
}
