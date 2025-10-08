import { useQuery } from "@tanstack/react-query";
import { reservoirsApi } from "@/services/apis/reservoirs.api";
import { ReservoirOperationRead, ReservoirRead } from "@/types/reservoirs";

export function useReservoirs() {
  return useQuery({
    queryKey: ["reservoirs"],
    queryFn: async () => {
      const response = await reservoirsApi.reservoirs.list({ limit: 1000 });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useReservoirOperations(
  reservoirId: number | null,
  startDate?: Date | null,
  endDate?: Date | null,
) {
  return useQuery({
    queryKey: ["reservoir-operations", reservoirId, startDate, endDate],
    queryFn: async () => {
      if (!reservoirId || !startDate || !endDate)
        return [];

      const response = await reservoirsApi.operations.list({
        reservoir_id: reservoirId,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
      });

      return response.data;
    },
    enabled: !!reservoirId && !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAllReservoirOperations(
  selectedDate: Date | null,
  reservoirs: ReservoirRead[],
) {
  return useQuery({
    queryKey: ["reservoir-operations", "all", selectedDate],
    queryFn: async () => {
      if (!selectedDate || reservoirs.length === 0) {
        return {
          operationsMap: new Map<number, ReservoirOperationRead[]>(),
          sliderMarks: {},
        };
      }

      const targetDate = new Date(selectedDate);
      const startTime = new Date(targetDate);
      const endTime = new Date(targetDate);
      endTime.setDate(endTime.getDate() + 1);

      const operationsMap = new Map<number, ReservoirOperationRead[]>();
      const marks = {} as Record<number, string>;

      // Fetch operations data for all reservoirs
      const response = await reservoirsApi.operations.list({
        start_date: startTime.toISOString().split("T")[0],
        end_date: endTime.toISOString().split("T")[0],
        limit: 10000,
      });

      // Group operations by reservoir
      for (const operation of response.data) {
        if (!operationsMap.has(operation.reservoir_id)) {
          operationsMap.set(operation.reservoir_id, []);
        }
        operationsMap.get(operation.reservoir_id)!.push(operation);

        // Build slider marks from timestamps
        const hour = new Date(operation.timestamp).getHours();
        marks[hour] = `${hour}:00`;
      }

      return { operationsMap, sliderMarks: marks };
    },
    enabled: !!selectedDate && reservoirs.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
