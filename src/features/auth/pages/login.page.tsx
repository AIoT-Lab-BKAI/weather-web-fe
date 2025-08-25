import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context";
import { handleApiError } from "@/lib/error-handle";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input, notification } from "antd";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";

export function LoginPage() {
  const auth = useAuth();
  const [loginFormData, setLoginFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  // const search = useSearch({ from: "/login" });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      await auth.loginMutation.mutateAsync({
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      });

      notification.success({
        message: "Login successful",
      });

      // Redirect to the intended page or dashboard
      navigate({
        to: "/dashboard",
        search: {
          isFromLogin: true,
        },
      });
    }
    catch (error: any) {
      handleApiError(error, {
        customMessage: "Login failed",
        skipGlobal: true,
      });
    }
  };

  const loading = auth.loginMutation.isPending;

  return (
    <form onSubmit={handleLoginSubmit} className="rounded-lg p-8 w-full max-w-lg">
      <div className="mb-14 flex items-center justify-center">
        <h2 className="text-4xl">Sign In</h2>
      </div>
      <div className="w-full max-w-lg space-y-4">
        <div>
          <label className="">Email or username</label>
          <Input
            placeholder="Email"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<MailIcon className="h-5 w-5 text-muted-foreground mr-1" />}
            value={loginFormData.username}
            onChange={handleLoginInputChange}
            name="username"
          />
        </div>
        <div>
          <label className="">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<LockIcon className="h-5 w-5 text-muted-foreground  mr-1" />}
            suffix={showPassword ? <EyeOffIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground" /> : <EyeIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground" />}
            value={loginFormData.password}
            onChange={handleLoginInputChange}
            name="password"
          />
        </div>
        <div className="flex flex-row-reverse mb-2">
          <Button variant="link">Forgot password</Button>
        </div>
        <div className="mb-8">
          <Button className="w-full" disabled={loading}>Log In</Button>
        </div>
        <div className="mt-12 flex flex-col items-center">
          <Link to="/signup">
            <Button variant="link">Create a account</Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
