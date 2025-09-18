import { AI4LIFELogo } from "@/components/logos/ai4life-logo";
import { WeatherLogo } from "@/components/logos/weather-logo";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronsRightIcon } from "lucide-react";

export function LandingComponent() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-dscl-blue1">
      <AI4LIFELogo className="w-32 h-32" />
      <div className="flex flex-col items-center">
        <WeatherLogo className="w-80 h-80" />
        <h2 className="text-center font-light text-6xl">Weather Web</h2>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <Link to="/login">
          <Button className="w-48">
            Login
            <ChevronsRightIcon className="text-white" />
          </Button>
        </Link>
        <Link to="/admin">
          <Button className="w-48">
            Admin
            <ChevronsRightIcon className="text-white" />
          </Button>
        </Link>
        <Link to="/weather-map">
          <Button className="w-48">
            Weather Map
            <ChevronsRightIcon className="text-white" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
