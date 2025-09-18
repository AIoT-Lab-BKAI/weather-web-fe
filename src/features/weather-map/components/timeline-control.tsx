import { mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import Icon from "@mdi/react";
import { ConfigProvider, DatePicker, Slider } from "antd";
import dayjs from "dayjs";
import { FC, ReactNode } from "react";
import { useWeatherMapLayout } from "../context";

const CircleButton: FC<{ children: ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = "",
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors ${className}`}
  >
    {children}
  </button>
);

export function TimelineControl() {
  const { selectedHour, setSelectedHour, selectedDate, setSelectedDate, sliderMarks } = useWeatherMapLayout();

  const handlePreviousDay = () => {
    if (selectedDate) {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(previousDay.getDate() - 1);
      setSelectedDate(previousDay);
      setSelectedHour(23);
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
      setSelectedHour(0);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 px-4 h-20 w-full">
      <CircleButton onClick={handlePreviousDay}>
        <Icon path={mdiSkipPrevious} size={1} className="text-black" />
      </CircleButton>

      <ConfigProvider
        theme={{
          components: {
            DatePicker: {
              colorPrimary: "#FF8D28",
              borderRadius: 24,
            },
          },
        }}
      >
        <DatePicker
          value={selectedDate ? dayjs(selectedDate) : null}
          onChange={date => setSelectedDate(date ? date.toDate() : null)}
          format="DD/MM/YYYY"
          placeholder="Select date"
          className="w-40 h-12 rounded-full"
          style={{
            borderRadius: "24px",
          }}
        />
      </ConfigProvider>

      <ConfigProvider
        theme={{
          components: {
            Slider: {
              controlSize: 20,
              railSize: 8,
              handleColor: "#FF8D28",
              handleActiveColor: "#FF8D28",
              handleActiveOutlineColor: "#FF8D2888",
              handleSize: 14,
              handleSizeHover: 18,
            },
          },
        }}
      >
        <Slider
          className="w-112"
          min={0}
          max={23}
          value={selectedHour}
          onChange={setSelectedHour}
          included={true}
          step={null}
          styles={{
            track: { backgroundColor: "#FFFFFF" },
            rail: { backgroundColor: "#FF8D28" },
            root: { color: "#FFF" },
          }}
          tooltip={{ color: "#FF8D28", formatter: value => `${value}:00`, styles: { body: { color: "#FFF" } } }}
          marks={sliderMarks}
        />
      </ConfigProvider>
      <CircleButton onClick={handleNextDay}>
        <Icon path={mdiSkipNext} size={1} className="text-black" />
      </CircleButton>
    </div>
  );
}
