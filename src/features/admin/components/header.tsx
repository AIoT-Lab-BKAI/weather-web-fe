import { AI4LIFELogo } from "@/components/logos/ai4life-logo";
import { useAuth } from "@/features/auth/context";
import { useNavigate } from "@tanstack/react-router";
import { Button, Popover } from "antd";
import { ChevronDown, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useAdminLayout } from "../context";

export function HeaderComponent() {
  const { getUserQuery: { data: user }, logoutMutation } = useAuth();
  const { headerTitle } = useAdminLayout();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate({ to: "/login" });
  };

  const isLoggedIn = !!user;

  return (
    <header className="flex items-center justify-between h-[var(--header-height)] bg-white px-6">
      <div>
        <h1>{headerTitle}</h1>
      </div>
      <Popover
        content={() => (
          <div className="flex flex-col space">
            <Button type="text" onClick={handleLogout} className="text-left" icon={<LogOutIcon className="size-4" />} iconPosition="end">
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
          </div>
        )}
        title="Account"
        trigger="click"
        placement="bottomRight"
        open={open}
        onOpenChange={handleOpenChange}
        className="cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <span className="text-sm font-medium">{isLoggedIn ? user?.name : "Not logged in"}</span>
          <ChevronDown className="size-4" />
        </div>
      </Popover>

    </header>
  );
}
