import { useQuery } from "@tanstack/react-query";
import { precipitationApi } from "@/services/apis/precipitation.api";
import { RainfallRecordRead, StationRead } from "@/types/precipitation";

export function useStations() {
  return useQuery({
    queryKey: ["precipitation", "stations"],
    queryFn: async () => {
      const response = await precipitationApi.stations.list({ limit: 1000 });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStationRainfallRecords(
  stationId: number | null,
  startDate?: Date | null,
  endDate?: Date | null,
) {
  return useQuery({
    queryKey: ["precipitation", "rainfall-records", "station", stationId, startDate, endDate],
    queryFn: async () => {
      if (!stationId || !startDate || !endDate)
        return [];

      const response = await precipitationApi.rainfallRecords.list({
        station_id: stationId,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
      });

      return response.data;
    },
    enabled: !!stationId && !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAllStationsRainfallRecords(
  selectedDate: Date | null,
  stations: StationRead[],
) {
  return useQuery({
    queryKey: ["precipitation", "rainfall-records", "all-stations", selectedDate],
    queryFn: async () => {
      if (!selectedDate || stations.length === 0) {
        return new Map<number, RainfallRecordRead[]>();
      }

      const targetDate = new Date(selectedDate);
      const startTime = new Date(targetDate);
      startTime.setDate(startTime.getDate() - 15);
      const endTime = new Date(targetDate);
      endTime.setDate(endTime.getDate() + 15);

      const response = await precipitationApi.rainfallRecords.list({
        start_date: startTime.toISOString().split("T")[0],
        end_date: endTime.toISOString().split("T")[0],
        limit: 10000,
      });

      // Create a Map to store rainfall records for each station
      const recordsMap = new Map<number, RainfallRecordRead[]>();
      for (const record of response.data) {
        if (!recordsMap.has(record.station_id)) {
          recordsMap.set(record.station_id, []);
        }
        recordsMap.get(record.station_id)!.push(record);
      }

      return recordsMap;
    },
    enabled: !!selectedDate && stations.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
