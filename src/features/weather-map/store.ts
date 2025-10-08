import { StormRead } from "@/types/storms";
import { SliderMarks } from "antd/es/slider";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { StationInfo } from "@/features/weather-map/types";

interface WeatherMapLayoutState {
  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

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

  // Header state
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

export const useWeatherMapStore = create<WeatherMapLayoutState>()(
  devtools(
    set => ({
      // Sidebar state
      sidebarCollapsed: false,
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),

      // Search state
      searchQuery: "",
      setSearchQuery: query => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: results => set({ searchResults: results }),
      isSearching: false,
      setIsSearching: searching => set({ isSearching: searching }),

      // Station state
      selectedStation: null,
      setSelectedStation: station => set({ selectedStation: station }),

      // Header state
      headerTitle: undefined,
      setHeaderTitle: title => set({ headerTitle: title }),

      // Map state
      mapCenter: [16.5, 107.5],
      setMapCenter: center => set({ mapCenter: center }),
      mapZoom: 5.5,
      setMapZoom: zoom => set({ mapZoom: zoom }),

      // Timeline
      selectedHour: 0,
      setSelectedHour: value => set({ selectedHour: value }),

      // Date
      selectedDate: new Date(),
      setSelectedDate: date => set({ selectedDate: date }),

      sliderMarks: {},
      setSliderMarks: markers => set({ sliderMarks: markers }),

      sliderDisabled: false,
      setSliderDisabled: disabled => set({ sliderDisabled: disabled }),

      // Storm selector
      storms: [],
      setStorms: storms => set({ storms }),
      selectedStormId: null,
      setSelectedStormId: stormId => set({ selectedStormId: stormId }),
      isStormSelectorOpen: false,
      setIsStormSelectorOpen: open => set({ isStormSelectorOpen: open }),
    }),
    { name: "WeatherMapStore" },
  ),
);
