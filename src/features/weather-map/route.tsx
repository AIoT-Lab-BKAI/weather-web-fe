import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";
import { WeatherMapLayout } from "./layout";

import { HumidityPage } from "./pages/humidity.page";
import { LevelPage } from "./pages/level.page";
import { PrecipitationPage } from "./pages/precipitation.page";
import { PressurePage } from "./pages/pressure.page";
import { TemperaturePage } from "./pages/temperature.page";
import { TropicalCyclonePage } from "./pages/tropical-cyclone.page";
import { WindPage } from "./pages/wind.page";

export const weatherMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/weather-map",
  component: WeatherMapLayout,
});

const weatherMapIndexRoute = createRoute({
  getParentRoute: () => weatherMapRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({
      to: "/weather-map/tropical-cyclone",
    });
  },
});

const tropicalCycloneRoute = createRoute({
  getParentRoute: () => weatherMapRoute,
  path: "/tropical-cyclone",
  component: TropicalCyclonePage,
});

const precipitationRoute = createRoute({
  getParentRoute: () => weatherMapRoute,
  path: "/precipitation",
  component: PrecipitationPage,
});

const levelRoute = createRoute({
  getParentRoute: () => weatherMapRoute,
  path: "/level",
  component: LevelPage,
});

const windRoute = createRoute({
  getParentRoute: () => weatherMapRoute,
  path: "/wind",
  component: WindPage,
});

const temperatureRoute = createRoute({
  getParentRoute: () => weatherMapRoute,
  path: "/temperature",
  component: TemperaturePage,
});

const humidityRoute = createRoute({
  getParentRoute: () => weatherMapRoute,
  path: "/humidity",
  component: HumidityPage,
});

const pressureRoute = createRoute({
  getParentRoute: () => weatherMapRoute,
  path: "/pressure",
  component: PressurePage,
});

export const weatherMapRouteTree = weatherMapRoute.addChildren([
  weatherMapIndexRoute,
  tropicalCycloneRoute,
  precipitationRoute,
  levelRoute,
  windRoute,
  temperatureRoute,
  humidityRoute,
  pressureRoute,
]);
