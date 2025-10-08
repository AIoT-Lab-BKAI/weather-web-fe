import Icon from "@mdi/react";
import { mdiMagnify, mdiLoading } from "@mdi/js";
import { useWeatherMapStore } from "../store";
import { ChangeEvent, KeyboardEvent, useCallback } from "react";

export function SearchInput() {
  const {
    searchQuery,
    setSearchQuery,
    setSearchResults,
    isSearching,
    setIsSearching,
    setSelectedStation,
    setMapCenter,
    setMapZoom,
  } = useWeatherMapStore();

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim())
      return;

    setIsSearching(true);
    try {
      // TODO: Implement actual search API call
      // For now, this is a placeholder

      // Mock search results - replace with actual API call
      const mockResults = [
        {
          id: 1,
          name: searchQuery,
          details: "Search result location",
          lat: 16.5 + Math.random(),
          lng: 107.5 + Math.random(),
        },
      ];

      setSearchResults(mockResults);

      // Auto-select first result and update map
      if (mockResults.length > 0) {
        const firstResult = mockResults[0];
        setSelectedStation(firstResult);
        setMapCenter([firstResult.lat, firstResult.lng]);
        setMapZoom(10);
      }
    }
    catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
    finally {
      setIsSearching(false);
    }
  }, [searchQuery, setIsSearching, setSearchResults, setSelectedStation, setMapCenter, setMapZoom]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // TODO: Implement debounced search logic here
    // For now, just clear results when query is empty
    if (!value.trim()) {
      setSearchResults([]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-[448px] h-12 px-4 bg-white rounded-full shadow-md">
      <Icon
        path={isSearching ? mdiLoading : mdiMagnify}
        size={1}
        className={isSearching ? "animate-spin" : ""}
      />
      <input
        type="text"
        placeholder="Search location"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="w-full pl-2 bg-transparent border-none outline-none text-base placeholder:text-gray-500"
      />
    </div>
  );
}
