import { AI4LIFELogo } from "@/components/logos/ai4life-logo";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

export function LandingComponent() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-dscl-blue1">
      <AI4LIFELogo className="w-1/2 h-1/2" />
      <Link to="/login">
        <Button>
          Get Started
          <ChevronLeftIcon className="rotate-180 stroke-dscl-white" />
        </Button>
      </Link>
    </div>
  );
}
