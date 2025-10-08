import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { useNavigate } from "@tanstack/react-router";
import { Popover } from "antd";
import { ChevronDown, CircleUserIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useAdminLayoutStore } from "../store";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function HeaderComponent() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { headerTitle } = useAdminLayoutStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    logout();
    navigate({ to: "/login" });
  };

  const isLoggedIn = !!user;

  return (
    <header className="flex items-center justify-between h-[var(--header-height)] bg-white px-6">
      <div>
        <h1>{headerTitle}</h1>
      </div>
      {isLoggedIn && (
        <Popover
          content={() => (
            <div className="flex flex-col space">
              <Button onClick={handleLogout} className="text-left">
                <LogOutIcon className="size-4" />
                {" "}
                Logout
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
            <div className="">
              <CircleUserIcon />
            </div>
            <span className="text-sm font-medium">{user.role}</span>
            <ChevronDown className="size-4" />
          </div>
        </Popover>
      )}
      {!isLoggedIn && (
        <Button variant="link" onClick={() => navigate({ to: "/login" })}>
          Login
        </Button>
      )}
    </header>
  );
}
