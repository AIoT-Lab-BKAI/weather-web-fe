import Icon from "@mdi/react";
import { mdiDownload } from "@mdi/js";
import { BarChart } from "@mui/x-charts/BarChart";

interface ForecastChartProps {
  title: string;
  data: { label: string; value: number }[];
  color: string;
}

export function ForecastChart({ title, data, color }: ForecastChartProps) {
  return (
    <div
      className="flex flex-col w-full p-4 gap-3 bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center w-full">
        <div className="relative pb-2">
          <h3 className="text-base font-semibold text-black">{title}</h3>
          <div
            className="absolute bottom-0 left-0 w-8 h-[3px] rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Icon path={mdiDownload} size={1} className="text-black" />
        </button>
      </div>

      <div className="w-full h-[160px]">
        <BarChart
          dataset={data}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "label",
              barGapRatio: 0.4,
              categoryGapRatio: 0.5,
              tickLabelStyle: {
                fontSize: 12,
                fontFamily: "Roboto",
                fill: "#000000",
              },
              disableLine: true,
              disableTicks: true,
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: {
                fontSize: 12,
                fontFamily: "Roboto",
                fill: "#000000",
              },
              disableLine: true,
              disableTicks: true,
            },
          ]}
          series={[
            {
              dataKey: "value",
              color,
            },
          ]}
          grid={{ horizontal: true, vertical: true }}
          margin={{
            left: -20,
            bottom: -5,
          }}
          sx={{
            ".MuiChartsGrid-line": {
              strokeDasharray: "2 5",
              stroke: "#D9D9D9",
            },
            ".MuiBarElement-root": {
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
            },
            ".MuiCharts-bar-label": {
              fontSize: "0.5rem",
              fontWeight: "600",
              fill: "black",
            },
          }}
        />
      </div>
    </div>
  );
}
