import { WeatherLogo } from "@/components/logos/weather-logo";
import { cn } from "@/lib/utils";
import { mdiMapLegend, mdiWavesArrowUp, mdiWeatherHurricaneOutline, mdiWeatherPouring } from "@mdi/js";
import Icon from "@mdi/react";
import { Link, LinkComponentProps } from "@tanstack/react-router";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon, UserIcon } from "lucide-react";
import { useAdminLayout } from "../context";

interface NavItemBase extends Omit<LinkComponentProps, "children"> {
  label: string;
  icon: React.ReactNode;
}

export type NavItem = NavItemBase & Required<Pick<NavItemBase, "icon" | "label">>;

export function Sidebar() {
  /**
   * Top navigation items ----------------------------------------------------
   */
  const navItems: NavItem[] = [
    {
      label: "Dữ liệu bão",
      icon: <Icon path={mdiWeatherHurricaneOutline} size={1} />,
      to: "/admin/tropical-cyclone",
    },
    {
      label: "Dữ liệu mưa",
      icon: <Icon path={mdiWeatherPouring} size={1} />,
      to: "/admin/precipitation",
    },
    {
      label: "Dữ liệu nước sông",
      icon: <Icon path={mdiWavesArrowUp} size={1} />,
      to: "/admin/rive-level",
    },
  ];

  /**
   * Bottom navigation items -------------------------------------------------
   */
  const bottomItems: NavItem[] = [
    {
      label: "Account",
      icon: <UserIcon size={20} />,
      to: "/admin/profile",
    },
  ];

  const { sidebarCollapsed, toggleSidebar } = useAdminLayout();

  return (
    <aside
      className={clsx(
        "bg-white shadow-md p-4 flex flex-col justify-between transition-all duration-300 z-50",
        sidebarCollapsed ? "w-18" : "w-64",
      )}
    >
      <div>
        {/* Collapse button */}
        <button
          type="button"
          title="Collapse"
          onClick={toggleSidebar}
          className="flex w-full justify-end mb-6 px-3 py-2 hover:bg-gray-100 rounded"
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center justify-center mt-4 mb-30">
          <WeatherLogo className={cn("h-40 w-40", sidebarCollapsed && "h-10 w-10")} />
          <h3 className={cn("text-center text-3xl", sidebarCollapsed && "hidden")}>Weather</h3>
        </div>
        <NavigationItem label="Go to Weather Map" icon={<Icon path={mdiMapLegend} size={1} />} to="/weather-map" />
        <hr />

        {/* Top navigation */}
        <nav>
          {navItems.map(item => (
            <NavigationItem key={item.label} {...item} />
          ))}
        </nav>
      </div>

      {/* Bottom navigation */}
      <nav className="mt-4">
        {bottomItems.map(item => (
          <NavigationItem key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  );
}

/**
 * NavigationItem -----------------------------------------------
 */
function NavigationItem(item: NavItem) {
  const { sidebarCollapsed, setHeaderTitle } = useAdminLayout();
  const { icon, label, ...linkProps } = item;

  const linkClass = clsx(
    "space-x-3 p-1 my-2 no-underline hover:bg-main-hover text-black h-10 rounded-full flex items-center transition-colors",
  );

  const activeProps = {
    className: clsx("bg-second font-bold backdrop-blur-sm"),
  };

  return (
    <Link {...linkProps} className={linkClass} activeProps={activeProps}>
      {({ isActive }) => {
        if (isActive) {
          setHeaderTitle(label);
        }
        return (
          <>
            <span className={clsx("flex justify-center p-1 rounded-full", isActive && "bg-main text-white")}>{icon}</span>
            {!sidebarCollapsed && <span>{label}</span>}
          </>
        );
      }}
    </Link>
  );
}
