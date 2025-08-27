export interface ChartData {
  label: string;
  value: number;
}

export interface LevelData {
  title: string;
  data: ChartData[];
  color: string;
}

export interface StationInfo {
  id: number;
  name: string;
  details: string;
  lat: number;
  lng: number;
}
