import { Link } from "@tanstack/react-router";
import { useWeatherMapLayout } from "../context";

import Icon from "@mdi/react";
import {
  mdiChevronUp,
  mdiCompassOutline,
  mdiWeatherHurricaneOutline,
  mdiThermometerLines,
  mdiWavesArrowUp,
  mdiWaterPercent,
  mdiWeatherPouring,
  mdiWeatherWindy,
} from "@mdi/js";

const menuItems = [
  {
    to: "/weather-map/tropical-cyclone",
    label: "Tropical Cyclone",
    iconPath: mdiWeatherHurricaneOutline,
  },
  {
    to: "/weather-map/precipitation",
    label: "Precipitation",
    iconPath: mdiWeatherPouring,
  },
  { to: "/weather-map/level", label: "Level", iconPath: mdiWavesArrowUp },
  { to: "/weather-map/wind", label: "Wind", iconPath: mdiWeatherWindy },
  {
    to: "/weather-map/temperature",
    label: "Temperature",
    iconPath: mdiThermometerLines,
  },
  { to: "/weather-map/humidity", label: "Humidity", iconPath: mdiWaterPercent },
  {
    to: "/weather-map/pressure",
    label: "Pressure",
    iconPath: mdiCompassOutline,
  },
];

export function WeatherSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useWeatherMapLayout();

  return (
    <aside className="flex flex-col w-[219px] p-4 gap-2 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-300">
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex justify-between items-center w-full"
      >
        <span className="font-medium text-base text-black">Weather map</span>
        <Icon
          path={mdiChevronUp}
          size={1}
          className={`text-black transition-transform duration-300 ${
            sidebarCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {!sidebarCollapsed && (
        <nav>
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="group no-underline"
                  activeProps={{
                    className: "bg-[#FF9500]/30 backdrop-blur-sm",
                  }}
                  style={{
                    borderRadius: "100px",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 16px 4px 4px",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isActive ? "bg-[#FF8D28]" : "bg-transparent"
                        }`}
                      >
                        <Icon
                          path={item.iconPath}
                          size={1}
                          className={isActive ? "text-white" : "text-black"}
                        />
                      </div>
                      <span
                        className={`text-base text-black ${
                          isActive ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}
