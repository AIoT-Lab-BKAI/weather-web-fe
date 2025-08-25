import { AI4LIFELogo } from "@/components/logos/ai4life-logo";
import { Outlet } from "@tanstack/react-router";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Sign In */}
      <div className="w-full md:w-4/9 flex items-center justify-center bg-white p-10">
        <Outlet />
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden md:flex w-5/9 bg-[#eef5f9] items-center justify-center p-10">
        <div className="text-center">
          <div className="flex flex-col justify-center mb-10">
            <AI4LIFELogo className="mx-auto w-64 mb-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
