import Icon from "@mdi/react";
import { mdiPlay, mdiPause, mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import { FC, ReactNode, useState, useEffect, useRef } from "react";
import { ConfigProvider, Slider, DatePicker } from "antd";
import { useWeatherMapLayout } from "../context";
import dayjs from "dayjs";

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
  const { sliderValue, setSliderValue, selectedDate, setSelectedDate } = useWeatherMapLayout();
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePreviousDay = () => {
    if (selectedDate) {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(previousDay.getDate() - 1);
      setSelectedDate(previousDay);
      setSliderValue(0); // Set hour to 0
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
      setSliderValue(23); // Set hour to 23
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (sliderValue >= 23) {
          // When reaching the end of the day, move to next day and reset to 0
          if (selectedDate) {
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setSelectedDate(nextDay);
          }
          setSliderValue(0);
        }
        else {
          setSliderValue(sliderValue + 1);
        }
      }, 1000); // Change hour every second
    }
    else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, sliderValue, selectedDate, setSelectedDate, setSliderValue]);
  return (
    <div className="flex items-center justify-center gap-4 px-4 py-2 w-full">
      <CircleButton onClick={handlePlayPause}>
        <Icon path={isPlaying ? mdiPause : mdiPlay} size={1.2} className="text-black" />
      </CircleButton>
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
          className="w-[159px] h-12 rounded-full"
          style={{
            borderRadius: "24px",
          }}
        />
      </ConfigProvider>

      <div className="w-160 h-12">
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
            min={0}
            max={23}
            onChange={setSliderValue}
            included
            styles={{
              track: { backgroundColor: "#FFFFFF" },
              rail: { backgroundColor: "#FF8D28" },
              root: { color: "#FFF" },
            }}
            tooltip={{ color: "#FF8D28", formatter: value => `${value}:00`, styles: { body: { color: "#FFF" } } }}
            marks={{
              1: {
                style: { color: "#FFF" },
                label: "1:00",
              },
              10: {
                style: { color: "#FFF" },
                label: "10:00",
              },
              20: {
                style: { color: "#FFF" },
                label: "20:00",
              },
            }}
          />
        </ConfigProvider>
      </div>

      <CircleButton onClick={handleNextDay}>
        <Icon path={mdiSkipNext} size={1} className="text-black" />
      </CircleButton>
    </div>
  );
}
