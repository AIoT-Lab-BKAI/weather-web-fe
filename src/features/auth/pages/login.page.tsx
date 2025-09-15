import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context";
import { handleApiError } from "@/lib/error-handle";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input, notification } from "antd";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { loginApi } from "../apis/auth.api";

export function LoginPage() {
  const { login } = useAuth();
  const [loginFormData, setLoginFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  // const search = useSearch({ from: "/login" });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoginLoading(true);
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      await login(() => loginApi({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      }));

      notification.success({
        message: "Login successful",
      });

      navigate({ to: "/admin" });
    }
    catch (error: any) {
      handleApiError(error, {
        customMessage: "Login failed",
        skipGlobal: true,
      });
    }
    finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="rounded-lg p-8 w-full max-w-lg">
      <div className="mb-14 flex items-center justify-center">
        <h2 className="text-4xl">Sign In</h2>
      </div>
      <div className="w-full max-w-lg space-y-4">
        <div>
          <label className="">Email</label>
          <Input
            placeholder="Email"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<MailIcon className="h-5 w-5 text-muted-foreground mr-1" />}
            value={loginFormData.email}
            onChange={handleLoginInputChange}
            name="email"
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
          <Button className="w-full" disabled={isLoginLoading}>Log In</Button>
        </div>
        <div className="mt-12 flex flex-col items-center">
          <Link to="/register">
            <Button variant="link">Create a account</Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
